import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Users, CheckCircle, XCircle,
  Edit, Trash2, ArrowLeft, Star, User,
  Upload, Download, FileText, Clock, IndianRupee
} from 'lucide-react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { initiatePayment } from '../utils/razorpay';
import TimeDisplay from '../components/TimeDisplay';

const PosterJobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [posterInstructions, setPosterInstructions] = useState('');
  const [posterFiles, setPosterFiles] = useState([]);
  const [acceptLoading, setAcceptLoading] = useState(false);

  const [showEditFilesModal, setShowEditFilesModal] = useState(false);
  const [editingApplicant, setEditingApplicant] = useState(null);
  const [editedInstructions, setEditedInstructions] = useState('');
  const [editedFiles, setEditedFiles] = useState([]);
  const [editFilesLoading, setEditFilesLoading] = useState(false);

  const fetchJobDetails = useCallback(async () => {
    try {
      setLoading(true);
      const jobResponse = await API.get(`/jobs/${jobId}`);
      setJob(jobResponse.data);

      const applicantsResponse = await API.get(`/applications/job/${jobId}`);
      const formattedApplicants = applicantsResponse.data.map(app => ({
        ...app,
        _id: app._id,
        userId: app.seekerId?._id,
        name: app.seekerId?.name,
        email: app.seekerId?.email,
        rating: app.seekerId?.rating,
        skills: app.seekerId?.skills,
        skillsMatch: app.skillsMatch || 0,
        appliedDate: app.appliedAt,
        status: app.status ? app.status.toLowerCase() : 'pending',
      }));
      setApplicants(formattedApplicants);
    } catch (err) {
      console.error('Error fetching job details:', err);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchJobDetails();
  }, [fetchJobDetails]);

  const handleDownload = async (fileUrl, originalName) => {
    try {
      const params = new URLSearchParams({ url: fileUrl, filename: originalName || 'download' });
      const response = await API.get(`/applications/download-file?${params}`, { responseType: 'blob' });
      const blob = new Blob([response.data]);
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = originalName || 'download';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Download failed. Please try again.');
    }
  };

  const handleAcceptClick = (applicant) => {
    setSelectedApplicant(applicant);
    setPosterInstructions('');
    setPosterFiles([]);
    setShowAcceptModal(true);
  };

  const handleEditFilesClick = (applicant) => {
    setEditingApplicant(applicant);
    setEditedInstructions(applicant.posterInstructions || '');
    setEditedFiles([]);
    setShowEditFilesModal(true);
  };

  const handleAcceptSubmit = async () => {
    if (!posterInstructions.trim()) {
      alert('Please provide work instructions for the applicant.');
      return;
    }
    if (!selectedApplicant?._id) {
      alert('Invalid applicant selected.');
      return;
    }
    try {
      setAcceptLoading(true);
      const formData = new FormData();
      formData.append('posterInstructions', posterInstructions);
      posterFiles.forEach(file => formData.append('files', file));
      await API.put(`/applications/${selectedApplicant._id}/accept`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowAcceptModal(false);
      setPosterInstructions('');
      setPosterFiles([]);
      alert('Applicant accepted! They will see a "Start Work" button to begin the timer.');
      fetchJobDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept applicant. Please try again.');
    } finally {
      setAcceptLoading(false);
    }
  };

  const handleEditFilesSubmit = async () => {
    if (!editedInstructions.trim()) {
      alert('Please provide work instructions.');
      return;
    }
    try {
      setEditFilesLoading(true);
      const formData = new FormData();
      formData.append('posterInstructions', editedInstructions);
      editedFiles.forEach(file => formData.append('files', file));
      await API.put(`/applications/${editingApplicant._id}/accept`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowEditFilesModal(false);
      setEditedInstructions('');
      setEditedFiles([]);
      alert('Instructions and files updated successfully!');
      fetchJobDetails();
    } catch (err) {
      alert('Failed to update files and instructions. Please try again.');
    } finally {
      setEditFilesLoading(false);
    }
  };

  const handleReject = async (applicantId) => {
    try {
      await API.put(`/applications/${applicantId}/reject`);
      fetchJobDetails();
    } catch (err) {
      alert('Failed to reject applicant');
    }
  };

  const handlePayment = (applicant) => {
    initiatePayment(applicant._id, fetchJobDetails);
  };

  const handleJobAction = async (action) => {
    try {
      if (action === 'delete') {
        if (!window.confirm('Are you sure you want to delete this job?')) return;
        await API.delete(`/jobs/${jobId}`);
        alert('Job deleted successfully!');
        navigate('/poster/dashboard');
        return;
      }
      await API.put(`/jobs/${jobId}/status`, { status: action === 'close' ? 'Closed' : 'Open' });
      if (action === 'close') {
        alert('Job closed successfully!');
        navigate('/poster/dashboard');
      } else {
        fetchJobDetails();
      }
    } catch (err) {
      alert(`Failed to ${action} job.`);
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
          <Link to="/poster/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700">
            <ArrowLeft size={20} /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const ApplicantCard = ({ applicant }) => (
    <div className={`bg-white rounded-xl border p-6 hover:shadow-md transition-shadow ${
      applicant.status === 'submitted' ? 'border-blue-300 bg-blue-50/30' : 'border-slate-200'
    }`}>
      {applicant.status === 'submitted' && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-200 rounded-lg flex items-center gap-2">
          <FileText size={16} className="text-blue-600" />
          <span className="text-blue-700 font-bold text-sm">🎉 Seeker has submitted work! Review and pay.</span>
        </div>
      )}

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
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
          applicant.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
          applicant.status === 'rejected' ? 'bg-red-100 text-red-700' :
          applicant.status === 'completed' ? 'bg-blue-100 text-blue-700' :
          applicant.status === 'submitted' ? 'bg-purple-100 text-purple-700' :
          'bg-yellow-100 text-yellow-700'
        }`}>
          {applicant.status === 'submitted' ? '📦 Work Submitted' :
           applicant.status === 'accepted' && !applicant.timerStartedAt ? '⏳ Awaiting Start' :
           applicant.status === 'accepted' ? '🚀 In Progress' :
           applicant.status}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-700">Skills Match</span>
          <span className="text-sm font-bold text-emerald-600">{applicant.skillsMatch}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${applicant.skillsMatch}%` }}></div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-slate-700 mb-2">Skills</p>
        <div className="flex flex-wrap gap-2">
          {applicant.skills?.map((skill, index) => (
            <span key={index} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs">{skill}</span>
          ))}
        </div>
      </div>

      <p className="text-sm text-slate-500 mb-4">
        Applied on {applicant.appliedDate
          ? new Date(applicant.appliedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
          : 'N/A'}
      </p>

      {/* Poster Instructions */}
      {(applicant.status === 'accepted' || applicant.status === 'submitted' || applicant.status === 'completed') && applicant.posterInstructions && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
          <p className="text-sm font-bold text-emerald-800 mb-1">📋 Your Instructions:</p>
          <p className="text-sm text-emerald-700">{applicant.posterInstructions}</p>
        </div>
      )}

      {/* Poster Files */}
      {(applicant.posterFiles?.length > 0 || applicant.posterInstructions) && (
        <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-bold text-slate-700">📁 Files & Instructions:</p>
            <button onClick={() => handleEditFilesClick(applicant)}
              className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs font-medium">
              <Edit size={12} /> Edit Files
            </button>
          </div>
          {applicant.posterInstructions && (
            <div className="mb-2 p-2 bg-white rounded border border-slate-200">
              <p className="text-xs text-slate-600">{applicant.posterInstructions}</p>
            </div>
          )}
          {applicant.posterFiles?.length > 0 && (
            <div className="space-y-1">
              {applicant.posterFiles.map((file, i) => (
                <button key={i} onClick={() => handleDownload(file.url, file.originalName)}
                  className="w-full flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-all text-left">
                  <Download size={14} className="text-emerald-600 shrink-0" />
                  <span className="text-sm text-slate-700 truncate">{file.originalName || `File ${i + 1}`}</span>
                  <span className="ml-auto text-xs text-emerald-600 font-bold shrink-0">Download</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ✅ Time Tracking — shown per applicant when accepted/submitted/completed */}
      {(applicant.status === 'accepted' || applicant.status === 'submitted' || applicant.status === 'completed') && applicant.acceptedAt && (
        <div className="mb-4">
          <TimeDisplay application={applicant} job={job} role="poster" />
        </div>
      )}

      {/* Seeker Submission */}
      {(applicant.status === 'submitted' || applicant.status === 'completed') && (
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-sm font-bold text-purple-800 mb-2">📦 Seeker's Submission:</p>
          {applicant.submissionNotes && (
            <p className="text-sm text-purple-700 mb-3 p-2 bg-white rounded-lg border border-purple-100">
              {applicant.submissionNotes}
            </p>
          )}
          {applicant.submissionFiles?.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-bold text-purple-700 mb-1">📎 Submitted Files:</p>
              {applicant.submissionFiles.map((file, i) => (
                <button key={i} onClick={() => handleDownload(file.url, file.originalName)}
                  className="w-full flex items-center gap-2 p-2 bg-white border border-purple-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all text-left">
                  <Download size={14} className="text-purple-600 shrink-0" />
                  <span className="text-sm text-slate-700 truncate">{file.originalName || `Submitted File ${i + 1}`}</span>
                  <span className="ml-auto text-xs text-purple-600 font-bold shrink-0">Download</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-purple-500 italic">No files submitted — check submission notes above.</p>
          )}
        </div>
      )}

      {/* Payment info */}
      {applicant.status === 'completed' && applicant.paymentAmount > 0 && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2">
          <IndianRupee size={16} className="text-emerald-600" />
          <span className="text-emerald-700 font-bold">
            ₹{applicant.paymentAmount} paid on {applicant.paidAt ? new Date(applicant.paidAt).toLocaleDateString('en-IN') : 'N/A'}
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mt-2">
        {applicant.status === 'pending' && (
          <>
            <button onClick={() => handleAcceptClick(applicant)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium">
              <CheckCircle size={16} /> Accept
            </button>
            <button onClick={() => handleReject(applicant._id)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium">
              <XCircle size={16} /> Reject
            </button>
          </>
        )}
        {applicant.status === 'submitted' && (
          <button onClick={() => handlePayment(applicant)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-bold shadow-lg shadow-emerald-100">
            <IndianRupee size={16} /> Pay ₹{job.hourlyRate * job.hours} Now
          </button>
        )}
        <Link to={`/seeker/profile/${applicant.userId || applicant.seekerId || applicant._id}`}
          className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 text-sm font-medium">
          <User size={16} /> View Profile
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#E6EEF2]">
      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/poster/dashboard')} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-emerald-600 transition-all shadow-sm">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-black text-slate-900">Job Insights</h1>
              <p className="text-slate-500 font-medium italic">Viewing details and applicants</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to={`/poster/job/${jobId}/edit`} className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold">
              <Edit size={18} /> Edit
            </Link>
            <button onClick={() => handleJobAction('close')} className="flex items-center gap-2 px-5 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 font-bold">
              <XCircle size={18} /> Close Job
            </button>
            <button onClick={() => handleJobAction('delete')} className="flex items-center gap-2 px-5 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-bold">
              <Trash2 size={18} /> Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">{job.title}</h2>
                  <div className="flex items-center gap-4 text-slate-600">
                    <div className="flex items-center gap-1"><IndianRupee size={16} /><span className="font-semibold">₹{job.hourlyRate}/hr</span></div>
                    <div className="flex items-center gap-1"><Clock size={16} /><span>{job.hours} hrs</span></div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${job.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                    {job.status === 'active' ? 'Active' : 'Closed'}
                  </span>
                  <p className="text-emerald-600 font-black text-lg mt-2">Total: ₹{job.hourlyRate * job.hours}</p>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Job Description</h3>
                <p className="text-slate-600 leading-relaxed">{job.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div><h4 className="font-medium text-slate-900 mb-1">Work Type</h4><p className="text-slate-600">🌐 Remote</p></div>
                <div>
                  <h4 className="font-medium text-slate-900 mb-1">Deadline</h4>
                  <p className="text-slate-600">{job.deadline ? new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No deadline set'}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Skills Required</h4>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills?.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium">{skill}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-6">👥 Applicants ({applicants.length})</h3>
              <div className="flex gap-2 mb-6 flex-wrap">
                {['pending', 'accepted', 'submitted', 'completed', 'rejected'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg font-medium capitalize text-sm transition-colors ${
                      activeTab === tab ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}>
                    {tab === 'submitted' ? '📦 Submitted' : tab} ({applicants.filter(a => a.status === tab).length})
                  </button>
                ))}
              </div>
              <div className="space-y-4">
                {applicants.filter(a => a.status === activeTab).map(applicant => <ApplicantCard key={applicant._id} applicant={applicant} />)}
                {applicants.filter(a => a.status === activeTab).length === 0 && (
                  <div className="text-center py-8">
                    <Users size={48} className="text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No {activeTab} applicants</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                {['pending', 'accepted', 'submitted', 'completed', 'rejected'].map(status => (
                  <div key={status} className="flex justify-between">
                    <span className="text-slate-600 capitalize">{status}</span>
                    <span className={`font-semibold ${
                      status === 'completed' ? 'text-blue-600' :
                      status === 'accepted' ? 'text-emerald-600' :
                      status === 'submitted' ? 'text-purple-600' :
                      status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                    }`}>{applicants.filter(a => a.status === status).length}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accept Modal */}
      {showAcceptModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <h3 className="text-xl font-black text-slate-900 mb-2">Accept {selectedApplicant?.name}</h3>
            <p className="text-slate-500 text-sm mb-6">Add work instructions and share any existing files. The seeker will see a "Start Work" button — the timer only begins when they click it.</p>
            <div className="mb-4">
              <label className="block text-sm font-bold text-slate-700 mb-2">Work Instructions <span className="text-red-500">*</span></label>
              <textarea value={posterInstructions} onChange={(e) => setPosterInstructions(e.target.value)}
                placeholder="Describe exactly what the seeker needs to do..." rows={5}
                className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none text-sm" />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">Upload Project Files <span className="text-slate-400 font-normal">(optional)</span></label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center">
                <Upload size={24} className="text-slate-400 mx-auto mb-2" />
                <label className="cursor-pointer">
                  <span className="text-emerald-600 font-medium text-sm">Click to upload files</span>
                  <input type="file" multiple className="hidden" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.zip,.rar,.txt,.xlsx,.pptx"
                    onChange={(e) => setPosterFiles(Array.from(e.target.files))} />
                </label>
                {posterFiles.length > 0 && <div className="mt-2">{posterFiles.map((f, i) => <p key={i} className="text-xs text-slate-600">📄 {f.name}</p>)}</div>}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowAcceptModal(false); setPosterFiles([]); setPosterInstructions(''); }}
                className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50">Cancel</button>
              <button onClick={handleAcceptSubmit} disabled={acceptLoading || !posterInstructions.trim()}
                className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50">
                {acceptLoading ? 'Accepting...' : 'Accept & Send Instructions'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Files Modal */}
      {showEditFilesModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <h3 className="text-xl font-black text-slate-900 mb-2">Edit Files & Instructions</h3>
            <p className="text-slate-500 text-sm mb-6">Update work instructions and add new files for {editingApplicant?.name}.</p>
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">Work Instructions <span className="text-red-500">*</span></label>
              <textarea value={editedInstructions} onChange={(e) => setEditedInstructions(e.target.value)} rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Describe the work requirements..." />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">Add New Files <span className="text-slate-400 font-normal">(optional)</span></label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                <Upload className="w-8 h-8 mb-2 text-slate-400" />
                <p className="text-sm text-slate-600"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-slate-500 mt-1">ZIP, PDF, DOCX, PNG, JPG (MAX. 10MB)</p>
                <input type="file" multiple className="hidden" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.zip,.rar,.txt,.xlsx,.pptx"
                  onChange={(e) => setEditedFiles(Array.from(e.target.files))} />
              </label>
              {editedFiles.length > 0 && <div className="mt-2">{editedFiles.map((f, i) => <p key={i} className="text-xs text-slate-600">📄 {f.name}</p>)}</div>}
            </div>
            {editingApplicant?.posterFiles?.length > 0 && (
              <div className="mb-6 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-medium text-slate-700 mb-2">Current Files:</p>
                {editingApplicant.posterFiles.map((file, i) => (
                  <div key={i} className="flex items-center justify-between text-xs text-slate-600 py-1">
                    <span>📄 {file.originalName || `File ${i + 1}`}</span>
                    <button onClick={() => handleDownload(file.url, file.originalName)} className="text-blue-600 hover:underline">Download</button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => { setShowEditFilesModal(false); setEditedFiles([]); }}
                className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50">Cancel</button>
              <button onClick={handleEditFilesSubmit} disabled={editFilesLoading || !editedInstructions.trim()}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50">
                {editFilesLoading ? 'Updating...' : 'Update Files'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PosterJobDetail;
