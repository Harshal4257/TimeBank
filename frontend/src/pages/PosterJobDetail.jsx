import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Clock, 
  Users, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  Edit,
  Trash2,
  ArrowLeft,
  Star,
  User
} from 'lucide-react';
import API from '../services/api';

const PosterJobDetail = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('applicants');

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch job details
      const jobResponse = await API.get(`/api/jobs/${jobId}`);
      setJob(jobResponse.data);
      
      // Fetch applicants
      const applicantsResponse = await API.get(`/api/jobs/${jobId}/applicants`);
      setApplicants(applicantsResponse.data);
      
    } catch (err) {
      console.error('Error fetching job details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplicantAction = async (applicantId, action) => {
    try {
      await API.post(`/api/applications/${applicantId}/${action}`);
      fetchJobDetails(); // Refresh data
    } catch (err) {
      console.error(`Error ${action} applicant:`, err);
      alert(`Failed to ${action} applicant. Please try again.`);
    }
  };

  const handleJobAction = async (action) => {
    try {
      await API.patch(`/api/jobs/${jobId}/${action}`);
      fetchJobDetails(); // Refresh data
    } catch (err) {
      console.error(`Error ${action} job:`, err);
      alert(`Failed to ${action} job. Please try again.`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E6EEF2] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        <p className="ml-4 text-slate-600">Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#E6EEF2] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Job not found</h2>
          <Link
            to="/poster/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const ApplicantCard = ({ applicant }) => (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
            <User size={24} className="text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">{applicant.name}</h4>
            <p className="text-sm text-slate-600">{applicant.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <Star size={14} className="text-yellow-500 fill-current" />
              <span className="text-sm text-slate-600">{applicant.rating || 'No rating'}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            applicant.status === 'accepted' 
              ? 'bg-emerald-100 text-emerald-700'
              : applicant.status === 'rejected'
              ? 'bg-red-100 text-red-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}>
            {applicant.status}
          </span>
        </div>
      </div>

      {/* Skills Match */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-700">Skills Match</span>
          <span className="text-sm font-bold text-emerald-600">{applicant.skillsMatch}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className="bg-emerald-600 h-2 rounded-full transition-all"
            style={{ width: `${applicant.skillsMatch}%` }}
          ></div>
        </div>
      </div>

      {/* Applicant Skills */}
      <div className="mb-4">
        <p className="text-sm font-medium text-slate-700 mb-2">Skills</p>
        <div className="flex flex-wrap gap-2">
          {applicant.skills?.map((skill, index) => (
            <span key={index} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Applied Date */}
      <div className="mb-4">
        <p className="text-sm text-slate-600">
          Applied on {new Date(applicant.appliedDate).toLocaleDateString()}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => handleApplicantAction(applicant._id, 'accept')}
          disabled={applicant.status !== 'pending'}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          <CheckCircle size={16} />
          Accept
        </button>
        <button
          onClick={() => handleApplicantAction(applicant._id, 'reject')}
          disabled={applicant.status !== 'pending'}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          <XCircle size={16} />
          Reject
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
          <MessageSquare size={16} />
          Message
        </button>
        <Link
          to={`/seeker/profile/${applicant.userId}`}
          className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
        >
          <User size={16} />
          View Profile
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#E6EEF2]">
      {/* Poster Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link to="/poster/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-emerald-600">
              <ArrowLeft size={20} />
              Back to Dashboard
            </Link>
            <h1 className="text-xl font-bold text-slate-900">Job Details</h1>
          </div>
          
          <div className="flex gap-2">
            <Link
              to={`/poster/job/${jobId}/edit`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit size={16} />
              Edit Job
            </Link>
            {job.status === 'active' ? (
              <button
                onClick={() => handleJobAction('close')}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <XCircle size={16} />
                Close Job
              </button>
            ) : (
              <button
                onClick={() => handleJobAction('reopen')}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <CheckCircle size={16} />
                Reopen Job
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Job Info Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">{job.title}</h2>
                  <div className="flex items-center gap-4 text-slate-600">
                    <div className="flex items-center gap-1">
                      <DollarSign size={18} />
                      <span className="font-semibold">{job.hourlyRate}/hr</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={18} />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={18} />
                      <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  job.status === 'active' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {job.status === 'active' ? 'Active' : 'Closed'}
                </span>
              </div>

              {/* Job Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Job Description</h3>
                <p className="text-slate-600 leading-relaxed">{job.description}</p>
              </div>

              {/* Job Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Work Location</h4>
                  <p className="text-slate-600">{job.workLocation}</p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Total Hours Required</h4>
                  <p className="text-slate-600">{job.totalHours} hours</p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Deadline</h4>
                  <p className="text-slate-600">{new Date(job.deadline).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Posted Date</h4>
                  <p className="text-slate-600">{new Date(job.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Required Skills */}
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Skills Required</h4>
                <div className="flex flex-wrap gap-2">
                  {job.skills?.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Applicants Section */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">
                  👥 Applicants ({applicants.length})
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('pending')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === 'pending'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Pending ({applicants.filter(a => a.status === 'pending').length})
                  </button>
                  <button
                    onClick={() => setActiveTab('accepted')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === 'accepted'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Accepted ({applicants.filter(a => a.status === 'accepted').length})
                  </button>
                  <button
                    onClick={() => setActiveTab('rejected')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === 'rejected'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Rejected ({applicants.filter(a => a.status === 'rejected').length})
                  </button>
                </div>
              </div>

              {/* Applicants List */}
              <div className="space-y-4">
                {applicants
                  .filter(applicant => activeTab === 'all' || applicant.status === activeTab)
                  .map((applicant) => (
                    <ApplicantCard key={applicant._id} applicant={applicant} />
                  ))}
                
                {applicants.filter(applicant => activeTab === 'all' || applicant.status === activeTab).length === 0 && (
                  <div className="text-center py-8">
                    <Users size={48} className="text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">
                      No {activeTab} applicants found
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Applicants</span>
                  <span className="font-semibold text-slate-900">{applicants.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Pending</span>
                  <span className="font-semibold text-yellow-600">
                    {applicants.filter(a => a.status === 'pending').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Accepted</span>
                  <span className="font-semibold text-emerald-600">
                    {applicants.filter(a => a.status === 'accepted').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Rejected</span>
                  <span className="font-semibold text-red-600">
                    {applicants.filter(a => a.status === 'rejected').length}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  to={`/poster/job/${jobId}/edit`}
                  className="w-full flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Edit size={16} />
                  Edit Job
                </Link>
                <button
                  onClick={() => handleJobAction('close')}
                  className="w-full flex items-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                  <XCircle size={16} />
                  Close Job
                </button>
                <button
                  onClick={() => handleJobAction('delete')}
                  className="w-full flex items-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  <Trash2 size={16} />
                  Delete Job
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosterJobDetail;
