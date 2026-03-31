import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Briefcase, Clock, DollarSign, Mail, User, ArrowLeft, Upload, Download, CheckCircle, IndianRupee, FileText } from 'lucide-react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

const SeekerJobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = React.useContext(AuthContext);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [application, setApplication] = useState(null);

  // Submission state
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [submissionFiles, setSubmissionFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const jobRes = await API.get(`/jobs/${jobId}`);
      setJob(jobRes.data);

      try {
        const appsRes = await API.get('/applications/my');
        const apps = Array.isArray(appsRes.data) ? appsRes.data : [];
        const found = apps.find((app) => {
          const id = app.jobId && app.jobId._id ? app.jobId._id : app.jobId;
          return id === jobId;
        });
        setApplication(found || null);
      } catch (appErr) {
        console.error('Error loading applications:', appErr);
      }
    } catch (err) {
      console.error('Error loading job details', err);
      setJob(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [jobId]);

  const handleApply = async () => {
    if (!job) return;
    try {
      setApplying(true);
      const res = await API.post(`/applications/apply/${job._id}`);
      setApplication(res.data);
      alert('Application submitted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  const handleUnapply = async () => {
    if (!application) return;
    try {
      await API.delete(`/applications/${application._id}`);
      setApplication(null);
      alert('Application cancelled.');
    } catch (err) {
      alert('Failed to cancel application.');
    }
  };

  const handleSubmitWork = async () => {
    if (!submissionNotes.trim() && submissionFiles.length === 0) {
      alert('Please add submission notes or upload files before submitting.');
      return;
    }
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('submissionNotes', submissionNotes);
      if (submissionFiles.length > 0) {
        submissionFiles.forEach(file => formData.append('files', file));
      }
      await API.put(`/applications/${application._id}/submit`, formData);

      alert('Work submitted successfully! The poster will review and pay you.');
      setShowSubmitForm(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit work.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E6EEF2] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
        <p className="ml-3 text-slate-600">Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#E6EEF2] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-slate-800 mb-4">Job not found</p>
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700">
            <ArrowLeft size={18} /> Back to jobs
          </button>
        </div>
      </div>
    );
  }

  const appStatus = application?.status?.toLowerCase() || null;
  const isCompleted = appStatus === 'completed';
  const isSubmitted = appStatus === 'submitted';
  const isAccepted = appStatus === 'accepted';
  const isPending = appStatus === 'pending';
  const isApplied = !!application && !isCompleted;
  const postedDate = job.createdAt ? new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently';

  return (
    <div className="min-h-screen bg-[#E6EEF2]">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-medium">
          <ArrowLeft size={18} /> Back to jobs
        </button>

        {/* ✅ Accepted — Show work instructions & files */}
        {(isAccepted || isSubmitted || isCompleted) && (
          <div className={`mb-6 rounded-2xl p-6 border ${
            isCompleted ? 'bg-emerald-50 border-emerald-200' :
            isSubmitted ? 'bg-purple-50 border-purple-200' :
            'bg-blue-50 border-blue-200'
          }`}>
            <h2 className={`text-lg font-black mb-3 ${
              isCompleted ? 'text-emerald-800' :
              isSubmitted ? 'text-purple-800' :
              'text-blue-800'
            }`}>
              {isCompleted ? '✅ Job Completed & Paid!' :
               isSubmitted ? '📦 Work Submitted — Awaiting Payment' :
               '🎉 You Got the Job!'}
            </h2>

            {/* Payment info */}
            {isCompleted && application?.paymentAmount > 0 && (
              <div className="flex items-center gap-2 mb-3 p-3 bg-emerald-100 rounded-xl">
                <IndianRupee size={18} className="text-emerald-600" />
                <span className="text-emerald-700 font-bold text-lg">
                  ₹{application.paymentAmount} received on {application.paidAt ? new Date(application.paidAt).toLocaleDateString('en-IN') : 'N/A'}
                </span>
              </div>
            )}

            {/* Poster Instructions */}
            <div className="mb-4">
              <p className="text-sm font-bold text-slate-700 mb-2">📋 Work Instructions from Poster:</p>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {application?.posterInstructions || "No instructions provided by the poster."}
                </p>
              </div>
            </div>

            {/* Poster Files */}
            {application?.posterFiles?.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-bold text-slate-700 mb-2">📁 Project Files to Work On:</p>
                <div className="space-y-2">
                  {application.posterFiles.map((file, i) => (
                      <a
                          key={i}
                          href={file.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition-all"
                      >
                          <Download size={18} className="text-emerald-600" />
                          <span className="text-slate-700 text-sm font-medium">{file.originalName || `File ${i + 1}`}</span>
                          <span className="ml-auto text-xs text-emerald-600 font-bold">Download</span>
                      </a>
                  ))}
                </div>
              </div>
            )}

            {/* Submitted files (if already submitted) */}
            {(isSubmitted || isCompleted) && application?.submissionFiles?.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-bold text-slate-700 mb-2">✅ Your Submitted Files:</p>
                <div className="space-y-2">
                  {application.submissionFiles.map((file, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl">
                      <FileText size={18} className="text-purple-600" />
                      <span className="text-slate-700 text-sm">{file.originalName || `File ${i + 1}`}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submission notes */}
            {(isSubmitted || isCompleted) && application?.submissionNotes && (
              <div className="mb-4">
                <p className="text-sm font-bold text-slate-700 mb-2">📝 Your Submission Notes:</p>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <p className="text-slate-600 text-sm">{application.submissionNotes}</p>
                </div>
              </div>
            )}

            {/* Submit Work Button */}
            {isAccepted && !showSubmitForm && (
              <button
                onClick={() => setShowSubmitForm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
              >
                <Upload size={18} /> Submit Completed Work
              </button>
            )}

            {/* Submit Form */}
            {isAccepted && showSubmitForm && (
              <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4">Submit Your Work</h3>

                <div className="mb-4">
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Submission Notes <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={submissionNotes}
                    onChange={(e) => setSubmissionNotes(e.target.value)}
                    placeholder="Describe what you've done, any important notes, links to your work (GitHub, Google Drive, etc.)..."
                    rows={4}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none text-sm"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Upload Completed Files <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center">
                    <Upload size={24} className="text-slate-400 mx-auto mb-2" />
                    <label className="cursor-pointer">
                      <span className="text-emerald-600 font-medium text-sm">Click to upload completed files</span>
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.zip,.rar,.txt,.xlsx,.pptx"
                        onChange={(e) => setSubmissionFiles(Array.from(e.target.files))}
                      />
                    </label>
                    {submissionFiles.length > 0 && (
                      <div className="mt-2">
                        {submissionFiles.map((f, i) => (
                          <p key={i} className="text-xs text-slate-600">📄 {f.name}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowSubmitForm(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitWork}
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 text-sm"
                  >
                    {submitting ? 'Submitting...' : '🚀 Submit Work'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Job Details Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-white p-8 space-y-8">
          {/* Job header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">{job.title}</h1>
              <p className="flex items-center gap-2 text-slate-600 mb-1">
                <Briefcase size={16} /> {job.poster?.name || 'Community Member'}
              </p>
              <p className="text-xs text-slate-400 mt-1">Posted on {postedDate}</p>
            </div>
            <div className="text-right space-y-1">
              <p className="flex items-center justify-end gap-1 text-slate-700">
                <IndianRupee size={18} className="text-emerald-600" />
                <span className="font-semibold">₹{job.hourlyRate}/hr</span>
              </p>
              {job.hours && (
                <p className="flex items-center justify-end gap-1 text-slate-600 text-sm">
                  <Clock size={16} />
                  <span>{job.hours} hrs total</span>
                </p>
              )}
              <p className="text-emerald-600 font-black">
                Total: ₹{job.hourlyRate * job.hours}
              </p>
            </div>
          </div>

          {/* Poster info */}
          <div className="bg-slate-50 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <User size={22} className="text-emerald-700" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">{job.poster?.name || 'Job poster'}</p>
              {job.poster?.email && (
                <p className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                  <Mail size={14} /> {job.poster.email}
                </p>
              )}
              <p className="text-xs text-slate-500 mt-1">🌐 Remote job — work from anywhere</p>
            </div>
          </div>

          {/* Job details */}
          <div className="space-y-5">
            {job.description && (
              <div>
                <h2 className="text-sm font-semibold text-slate-700 mb-2">Job Description</h2>
                <p className="text-slate-600 leading-relaxed">{job.description}</p>
              </div>
            )}

            {job.requiredSkills?.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-slate-700 mb-2">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {job.deadline && (
              <div>
                <h2 className="text-sm font-semibold text-slate-700 mb-1">Deadline</h2>
                <p className="text-slate-600 text-sm">{new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
            )}
          </div>

          {/* Apply / status section */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {appStatus && (
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                isCompleted ? 'bg-emerald-100 text-emerald-700' :
                isSubmitted ? 'bg-purple-100 text-purple-700' :
                isAccepted ? 'bg-blue-100 text-blue-700' :
                isPending ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {isCompleted ? '✅ Completed & Paid' :
                 isSubmitted ? '📦 Work Submitted' :
                 isAccepted ? '🎉 Accepted' :
                 isPending ? '⏳ Pending Review' :
                 '❌ Rejected'}
              </span>
            )}
            <div className="flex gap-3 ml-auto">
              {isPending && (
                <button
                  onClick={handleUnapply}
                  className="px-4 py-2 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 text-sm font-medium"
                >
                  Remove Application
                </button>
              )}
              {!application && (
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-60"
                >
                  {applying ? 'Submitting...' : 'Apply for this job'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerJobDetail;