import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Briefcase, Clock, Mail, User, ArrowLeft, Upload, Download, IndianRupee, FileText, Edit, PlayCircle, Lock } from 'lucide-react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import TimeDisplay from '../components/TimeDisplay';

const SeekerJobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = React.useContext(AuthContext);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [application, setApplication] = useState(null);

  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [submissionFiles, setSubmissionFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [showEditSubmissionModal, setShowEditSubmissionModal] = useState(false);
  const [editedNotes, setEditedNotes] = useState('');
  const [editedSubmissionFiles, setEditedSubmissionFiles] = useState([]);
  const [editSubmissionLoading, setEditSubmissionLoading] = useState(false);

  const [startingTimer, setStartingTimer] = useState(false);

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
  }, [jobId]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // ✅ Seeker clicks "Start Work" — starts timer and unlocks files
  const handleStartTimer = async () => {
    if (!application) return;
    const confirmed = window.confirm(
      `⏱ Starting the timer will begin your ${job?.hours}-hour countdown and cannot be undone.\n\nAre you ready to start work?`
    );
    if (!confirmed) return;
    try {
      setStartingTimer(true);
      const res = await API.put(`/applications/${application._id}/start-timer`);
      setApplication(res.data.application);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to start timer. Please try again.');
    } finally {
      setStartingTimer(false);
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
      submissionFiles.forEach(file => formData.append('files', file));
      await API.put(`/applications/${application._id}/submit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Work submitted successfully! The poster will review and pay you.');
      setShowSubmitForm(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit work.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmission = async () => {
    if (!editedNotes.trim() && editedSubmissionFiles.length === 0) {
      alert('Please add notes or upload files.');
      return;
    }
    try {
      setEditSubmissionLoading(true);
      const formData = new FormData();
      formData.append('submissionNotes', editedNotes);
      editedSubmissionFiles.forEach(file => formData.append('files', file));
      await API.put(`/applications/${application._id}/resubmit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Submission updated successfully!');
      setShowEditSubmissionModal(false);
      setEditedNotes('');
      setEditedSubmissionFiles([]);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update submission.');
    } finally {
      setEditSubmissionLoading(false);
    }
  };

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
  const isRevisionRequested = appStatus === 'revision_requested';
  const timerStarted = !!application?.timerStartedAt;
  const isPaused = application?.timerStatus === 'paused';

  const postedDate = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Recently';

  return (
    <div className="min-h-screen bg-[#E6EEF2]">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-medium">
          <ArrowLeft size={18} /> Back to jobs
        </button>

        {/* ── Time Tracking — shown when timer is running or job is done ── */}
        {(isAccepted || isSubmitted || isCompleted || isRevisionRequested) && application && (
          <div className="mb-6">
            <TimeDisplay
              application={application}
              job={job}
              role="seeker"
              onApplicationUpdate={(updated) => setApplication(updated)}
            />
          </div>
        )}

        {/* ── Revision Requested Banner ── */}
        {isRevisionRequested && (
          <div className="mb-6 rounded-2xl border-2 border-orange-300 bg-orange-50 p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xl">🔄</span>
              </div>
              <div>
                <h2 className="text-lg font-black text-orange-900">Poster Requested a Revision</h2>
                <p className="text-sm text-orange-700">Please review the feedback below, make the changes, and resubmit your work.</p>
              </div>
            </div>

            {application?.revisionFeedback && (
              <div className="mb-4 p-4 bg-white border border-orange-200 rounded-xl">
                <p className="text-sm font-bold text-slate-700 mb-2">📋 Poster's Feedback:</p>
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{application.revisionFeedback}</p>
              </div>
            )}

            {application?.revisionDeadline && (
              <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                <span className="text-sm font-bold text-red-700">⏰ Resubmit by: {new Date(application.revisionDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            )}

            {application?.revisionCount > 1 && (
              <p className="text-xs text-orange-600 mb-3">This is revision #{application.revisionCount}.</p>
            )}

            {/* Resubmit form */}
            {!showEditSubmissionModal ? (
              <button
                onClick={() => {
                  setEditedNotes(application?.submissionNotes || '');
                  setEditedSubmissionFiles([]);
                  setShowEditSubmissionModal(true);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-100"
              >
                <Upload size={18} /> Resubmit Revised Work
              </button>
            ) : null}
          </div>
        )}

        {/* ── Accepted state ── */}
        {isAccepted && (
          <div className="mb-6 rounded-2xl border overflow-hidden">

            {/* ── LOCKED: Timer not started yet ── */}
            {!timerStarted && (
              <div className="bg-amber-50 border-amber-200 border p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <Lock size={20} className="text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-amber-900">🎉 You Got the Job!</h2>
                    <p className="text-sm text-amber-700">Start work to unlock files and begin the timer.</p>
                  </div>
                </div>

                <div className="p-4 bg-white border border-amber-200 rounded-xl mb-5">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    The poster has accepted your application and provided work instructions.
                    Once you click <span className="font-bold text-amber-700">Start Work</span>, the files
                    and instructions will be unlocked and your <span className="font-bold">{job.hours}-hour</span> countdown will begin.
                  </p>
                  <p className="text-xs text-amber-600 font-medium mt-2">
                    ⚠️ Once started, the timer will run. You can pause it at any time and resume later within the allocated hours.
                  </p>
                </div>

                {/* Locked preview — blurred file list */}
                <div className="mb-5 p-4 bg-white border border-amber-100 rounded-xl opacity-60 select-none pointer-events-none">
                  <div className="flex items-center gap-2 mb-3">
                    <Lock size={14} className="text-slate-400" />
                    <p className="text-sm font-bold text-slate-400">Files & Instructions (locked)</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4 blur-sm" />
                    <div className="h-4 bg-slate-200 rounded w-1/2 blur-sm" />
                    <div className="h-8 bg-slate-100 border border-slate-200 rounded-lg blur-sm" />
                  </div>
                </div>

                <button
                  onClick={handleStartTimer}
                  disabled={startingTimer}
                  className="flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-xl font-black text-lg hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-lg shadow-emerald-200 w-full justify-center"
                >
                  <PlayCircle size={24} />
                  {startingTimer ? 'Starting...' : `Start Work — Begin ${job.hours}h Timer`}
                </button>
              </div>
            )}

            {/* ── UNLOCKED: Timer started, show instructions and files ── */}
            {timerStarted && (
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl">
                <h2 className="text-lg font-black text-blue-800 mb-4">🚀 Work In Progress</h2>

                {application?.posterInstructions && (
                  <div className="mb-4">
                    <p className="text-sm font-bold text-slate-700 mb-2">📋 Work Instructions from Poster:</p>
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                        {application.posterInstructions}
                      </p>
                    </div>
                  </div>
                )}

                {application?.posterFiles?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-bold text-slate-700 mb-2">📁 Project Files to Work On:</p>
                    <div className="space-y-2">
                      {application.posterFiles.map((file, i) => (
                        <button
                          key={i}
                          onClick={() => handleDownload(file.url, file.originalName)}
                          className="w-full flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition-all text-left"
                        >
                          <Download size={18} className="text-emerald-600 shrink-0" />
                          <span className="text-slate-700 text-sm font-medium truncate">{file.originalName || `File ${i + 1}`}</span>
                          <span className="ml-auto text-xs text-emerald-600 font-bold shrink-0">Download</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {!showSubmitForm && (
                  <button
                    onClick={() => setShowSubmitForm(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                  >
                    <Upload size={18} /> Submit Completed Work
                  </button>
                )}

                {showSubmitForm && (
                  <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200">
                    <h3 className="font-bold text-slate-900 mb-4">Submit Your Work</h3>
                    <div className="mb-4">
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Submission Notes <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={submissionNotes}
                        onChange={(e) => setSubmissionNotes(e.target.value)}
                        placeholder="Describe what you've done, any important notes, links to your work..."
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
                      <button onClick={() => setShowSubmitForm(false)} className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 text-sm font-medium">
                        Cancel
                      </button>
                      <button onClick={handleSubmitWork} disabled={submitting} className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 text-sm">
                        {submitting ? 'Submitting...' : '🚀 Submit Work'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Submitted / Completed state ── */}
        {(isSubmitted || isCompleted) && (
          <div className={`mb-6 rounded-2xl p-6 border ${
            isCompleted ? 'bg-emerald-50 border-emerald-200' : 'bg-purple-50 border-purple-200'
          }`}>
            <h2 className={`text-lg font-black mb-3 ${isCompleted ? 'text-emerald-800' : 'text-purple-800'}`}>
              {isCompleted ? '✅ Job Completed & Paid!' : '📦 Work Submitted — Awaiting Payment'}
            </h2>

            {isCompleted && application?.paymentAmount > 0 && (
              <div className="flex items-center gap-2 mb-3 p-3 bg-emerald-100 rounded-xl">
                <IndianRupee size={18} className="text-emerald-600" />
                <span className="text-emerald-700 font-bold text-lg">
                  ₹{application.paymentAmount} received on{' '}
                  {application.paidAt ? new Date(application.paidAt).toLocaleDateString('en-IN') : 'N/A'}
                </span>
              </div>
            )}

            {/* Show instructions even after submission */}
            {application?.posterInstructions && (
              <div className="mb-4">
                <p className="text-sm font-bold text-slate-700 mb-2">📋 Work Instructions from Poster:</p>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {application.posterInstructions}
                  </p>
                </div>
              </div>
            )}

            {/* Show your submission */}
            <div className="mb-4 p-4 bg-white rounded-xl border border-purple-200">
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-bold text-purple-800">📦 Your Submission:</p>
                {isSubmitted && (
                  <button
                    onClick={() => {
                      setEditedNotes(application?.submissionNotes || '');
                      setEditedSubmissionFiles([]);
                      setShowEditSubmissionModal(true);
                    }}
                    className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 text-xs font-medium"
                  >
                    <Edit size={12} /> Edit Submission
                  </button>
                )}
              </div>
              {application?.submissionNotes && (
                <div className="mb-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <p className="text-slate-600 text-sm">{application.submissionNotes}</p>
                </div>
              )}
              {application?.submissionFiles?.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-600 mb-1">📎 Submitted Files:</p>
                  {application.submissionFiles.map((file, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 bg-purple-50 border border-purple-100 rounded-lg">
                      <FileText size={16} className="text-purple-600 shrink-0" />
                      <span className="text-slate-700 text-sm truncate">{file.originalName || `File ${i + 1}`}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Job detail card ── */}
        <div className="bg-white rounded-3xl shadow-xl border border-white p-8 space-y-8">
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
              <p className="text-emerald-600 font-black">Total: ₹{job.hourlyRate * job.hours}</p>
            </div>
          </div>

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
                    <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">{skill}</span>
                  ))}
                </div>
              </div>
            )}
            {job.deadline && (
              <div>
                <h2 className="text-sm font-semibold text-slate-700 mb-1">Deadline</h2>
                <p className="text-slate-600 text-sm">
                  {new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {appStatus && (
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                isCompleted ? 'bg-emerald-100 text-emerald-700' :
                isSubmitted ? 'bg-purple-100 text-purple-700' :
                isRevisionRequested ? 'bg-blue-100 text-blue-700' :
                isAccepted ? 'bg-blue-100 text-blue-700' :
                isPending ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {isCompleted ? '✅ Completed & Paid' :
                 isSubmitted ? '📦 Work Submitted' :
                 isRevisionRequested ? '🚀 In Progress' :
                 isAccepted ? (timerStarted ? '🚀 In Progress' : '🎉 Accepted — Start When Ready') :
                 isPending ? '⏳ Pending Review' : '❌ Rejected'}
              </span>
            )}
            <div className="flex gap-3 ml-auto">
              {isPending && (
                <button onClick={handleUnapply} className="px-4 py-2 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 text-sm font-medium">
                  Remove Application
                </button>
              )}
              {!application && (
                <button onClick={handleApply} disabled={applying} className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-60">
                  {applying ? 'Submitting...' : 'Apply for this job'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Submission Modal */}
      {showEditSubmissionModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <h3 className="text-xl font-black text-slate-900 mb-2">Edit Your Submission</h3>
            <p className="text-slate-500 text-sm mb-6">Update your submission notes and replace uploaded files.</p>
            <div className="mb-4">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Submission Notes <span className="text-red-500">*</span>
              </label>
              <textarea
                value={editedNotes}
                onChange={(e) => setEditedNotes(e.target.value)}
                placeholder="Describe your work, add links, notes..."
                rows={4}
                className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Replace Files <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                <Upload className="w-7 h-7 mb-2 text-slate-400" />
                <p className="text-sm text-slate-600"><span className="font-semibold">Click to upload</span> new files</p>
                <p className="text-xs text-slate-500 mt-1">ZIP, PDF, DOCX, PNG, JPG</p>
                <input type="file" multiple className="hidden" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.zip,.rar,.txt,.xlsx,.pptx"
                  onChange={(e) => setEditedSubmissionFiles(Array.from(e.target.files))} />
              </label>
              {editedSubmissionFiles.length > 0 && (
                <div className="mt-2 space-y-1">
                  {editedSubmissionFiles.map((f, i) => <p key={i} className="text-xs text-slate-600">📄 {f.name}</p>)}
                </div>
              )}
            </div>
            {application?.submissionFiles?.length > 0 && (
              <div className="mb-6 p-3 bg-purple-50 rounded-lg border border-purple-100">
                <p className="text-xs font-bold text-purple-700 mb-2">Current Submitted Files:</p>
                {application.submissionFiles.map((file, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-600 py-1">
                    <FileText size={12} className="text-purple-500" />
                    <span>{file.originalName || `File ${i + 1}`}</span>
                  </div>
                ))}
                {editedSubmissionFiles.length > 0 && (
                  <p className="text-xs text-orange-600 mt-2 font-medium">⚠️ Uploading new files will replace the above.</p>
                )}
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => { setShowEditSubmissionModal(false); setEditedSubmissionFiles([]); }}
                className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50">
                Cancel
              </button>
              <button onClick={handleEditSubmission} disabled={editSubmissionLoading || !editedNotes.trim()}
                className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 disabled:opacity-50">
                {editSubmissionLoading ? 'Updating...' : 'Update Submission'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeekerJobDetail;
