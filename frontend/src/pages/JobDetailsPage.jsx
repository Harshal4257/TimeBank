import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Briefcase, MapPin, Clock, DollarSign, Calendar, Users, ArrowLeft, MessageSquare, Star } from 'lucide-react';
import JobReviewsSection from '../components/JobReviewsSection';
import { AuthContext } from '../context/AuthContext';

const JobDetailsPage = () => {
  const { jobId } = useParams();
  const { user } = React.useContext(AuthContext);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      // Mock API call - replace with actual API
      const mockJob = {
        _id: jobId,
        title: 'Senior React Developer',
        company: 'Tech Solutions Inc.',
        location: 'San Francisco, CA',
        type: 'Remote',
        duration: '3 months',
        hourlyRate: 75,
        hours: '40 hours/week',
        description: 'We are looking for an experienced React Developer to join our team and help build amazing web applications.',
        requirements: [
          '5+ years of React experience',
          'Strong TypeScript skills',
          'Experience with Node.js',
          'Excellent problem-solving skills'
        ],
        requiredSkills: ['React', 'TypeScript', 'Node.js', 'CSS'],
        postedDate: new Date('2024-01-10').toISOString(),
        applicationDeadline: new Date('2024-02-10').toISOString(),
        applicantsCount: 24,
        averageRating: 4.2,
        reviewCount: 8,
        posterId: 'poster123'
      };

      setJob(mockJob);
      
      // Check if current user has reviewed this job (mock logic)
      if (user?.role === 'seeker') {
        setHasReviewed(false); // In real app, check from API
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching job details:', error);
      setLoading(false);
    }
  };

  const handleApply = () => {
    // Handle job application
    console.log('Applying to job:', jobId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E6EEF2] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#E6EEF2] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Job Not Found</h2>
          <Link to="/jobs" className="text-primary-600 hover:text-primary-700">
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user?.role === 'poster' && job.posterId === user?.id;

  return (
    <div className="min-h-screen bg-[#E6EEF2] pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to="/jobs" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
              <ArrowLeft size={20} />
              Back to Jobs
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Header */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">{job.title}</h1>
                  <h2 className="text-xl text-slate-600 mb-4">{job.company}</h2>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase size={16} />
                      {job.type}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      {job.duration}
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} />
                      ${job.hourlyRate}/hr
                    </div>
                  </div>
                </div>

                {/* Rating Display */}
                <div className="text-center">
                  <div className="flex items-center gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={24}
                        className={`${
                          star <= Math.round(job.averageRating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-lg font-semibold text-slate-900">
                    {job.averageRating.toFixed(1)}
                  </div>
                  <div className="text-sm text-slate-600">
                    ({job.reviewCount} reviews)
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="text-center">
                  <div className="text-lg font-semibold text-slate-900">{job.applicantsCount}</div>
                  <div className="text-xs text-slate-600">Applicants</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-slate-900">{job.hours}</div>
                  <div className="text-xs text-slate-600">Hours/Week</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-slate-900">
                    ${job.hourlyRate * 40 * 4}
                  </div>
                  <div className="text-xs text-slate-600">Monthly Est.</div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Job Description</h3>
              <p className="text-slate-700 leading-relaxed mb-6">
                {job.description}
              </p>

              <h4 className="text-lg font-semibold text-slate-900 mb-3">Requirements</h4>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>

            {/* Skills Required */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Skills Required</h3>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-slate-400" />
                  <div>
                    <div className="text-sm font-medium text-slate-900">Posted</div>
                    <div className="text-sm text-slate-600">{formatDate(job.postedDate)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-slate-400" />
                  <div>
                    <div className="text-sm font-medium text-slate-900">Application Deadline</div>
                    <div className="text-sm text-slate-600">{formatDate(job.applicationDeadline)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Apply Button */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
              {user?.role === 'seeker' ? (
                <button
                  onClick={handleApply}
                  className="w-full px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Apply Now
                </button>
              ) : isOwner ? (
                <div className="text-center">
                  <div className="text-sm text-slate-600 mb-2">This is your job posting</div>
                  <Link
                    to={`/poster/job/${jobId}/edit`}
                    className="inline-block px-6 py-3 bg-slate-600 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors"
                  >
                    Edit Job
                  </Link>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-sm text-slate-600 mb-2">Login as seeker to apply</div>
                  <Link
                    to="/login"
                    className="inline-block px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>

            {/* Company Info */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">About Company</h3>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Briefcase size={32} className="text-primary-600" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-1">{job.company}</h4>
                <p className="text-sm text-slate-600 mb-3">Technology Company</p>
                <div className="flex items-center justify-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span>100-500 employees</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <span>{job.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8">
          <JobReviewsSection
            jobId={jobId}
            jobTitle={job.title}
            isOwner={isOwner}
            hasReviewed={hasReviewed}
            currentUserId={user?.id}
          />
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
