import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, Clock, DollarSign, Mail, User, ArrowLeft, Star, MessageSquare } from 'lucide-react';
import API from '../services/api';
import SeekerNavbar from '../components/SeekerNavbar';
import JobReviewsSection from '../components/JobReviewsSection';
import { AuthContext } from '../context/AuthContext';

const SeekerJobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = React.useContext(AuthContext);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [unapplying, setUnapplying] = useState(false);
  const [application, setApplication] = useState(null);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
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
          console.error('Error loading applications list:', appErr);
        }
      } catch (err) {
        console.error('Error loading job details', err);
        setJob(null);
      } finally {
        setLoading(false);
      }
    };
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
      console.error('Error applying for job:', err);
      alert('Failed to apply. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  const handleUnapply = async () => {
    if (!application) return;
    try {
      setUnapplying(true);
      await API.delete(`/applications/${application._id}`);
      setApplication(null);
      alert('Application cancelled.');
    } catch (err) {
      console.error('Error cancelling application:', err);
      const msg = err.response?.data?.message;
      const status = err.response?.status;
      alert(msg ? `Failed to cancel application (${status}): ${msg}` : 'Failed to cancel application. Please try again.');
    } finally {
      setUnapplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E6EEF2]">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
          <p className="ml-3 text-slate-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#E6EEF2]">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-xl font-semibold text-slate-800 mb-4">Job not found</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
          >
            <ArrowLeft size={18} /> Back to jobs
          </button>
        </div>
      </div>
    );
  }

 const postedDate = job.createdAt ? new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently';

  const appStatus = application?.status || null;
  const isCompleted = appStatus?.toLowerCase() === 'completed';
  const isApplied = !!application && !isCompleted;

  return (
    <div className="min-h-screen bg-[#E6EEF2]">

      <div className="max-w-4xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-medium"
        >
          <ArrowLeft size={18} /> Back to jobs
        </button>

        <div className="bg-white rounded-3xl shadow-xl border border-white p-8 space-y-8">
          {/* Job header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">{job.title}</h1>
              <p className="flex items-center gap-2 text-slate-600 mb-1">
                <Briefcase size={16} /> {job.poster?.name || 'Community Member'}
              </p>
              {job.location && (
                <p className="flex items-center gap-2 text-slate-500 text-sm">
                  <MapPin size={14} /> {job.location}
                </p>
              )}
              <p className="text-xs text-slate-400 mt-1">Posted on {postedDate}</p>
              
              {/* Review Rating */}
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={`${
                        star <= (job.averageRating || 0)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {job.averageRating?.toFixed(1) || '0.0'}
                </span>
                <span className="text-xs text-slate-500">
                  ({job.reviewCount || 0} reviews)
                </span>
                <button
                  onClick={() => document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                >
                  <MessageSquare size={12} />
                  Read Reviews
                </button>
              </div>
            </div>
            <div className="text-right space-y-1">
              <p className="flex items-center justify-end gap-1 text-slate-700">
                <DollarSign size={18} className="text-emerald-600" />
                <span className="font-semibold">₹{job.hourlyRate}/hr</span>
              </p>
              {job.hours && (
                <p className="flex items-center justify-end gap-1 text-slate-600 text-sm">
                  <Clock size={16} />
                  <span>{job.hours} hrs total</span>
                </p>
              )}
            </div>
          </div>

          {/* Poster info */}
          <div className="bg-slate-50 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <User size={22} className="text-emerald-700" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">
                {job.poster?.name || 'Job poster'}
              </p>
              {job.poster?.email && (
                <p className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                  <Mail size={14} /> {job.poster.email}
                </p>
              )}
              <p className="text-xs text-slate-500 mt-1">
                This is the person who will review your application for this job.
              </p>
            </div>
          </div>

          {/* Job details */}
          <div className="space-y-5">
            {job.description && (
              <div>
                <h2 className="text-sm font-semibold text-slate-700 mb-2">Job description</h2>
                <p className="text-slate-600 leading-relaxed">{job.description}</p>
              </div>
            )}

            {job.requiredSkills?.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-slate-700 mb-2">Required skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Apply / status / unapply */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {appStatus && (
              <p className="text-sm text-slate-600">
                Status:{' '}
                <span className="font-semibold">
                  {appStatus}
                </span>
              </p>
            )}
            <div className="flex gap-3 ml-auto">
              {isApplied && (
                <button
                  type="button"
                  onClick={handleUnapply}
                  disabled={unapplying}
                  className="px-4 py-2 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-60"
                >
                  {unapplying ? 'Removing...' : 'Remove Application'}
                </button>
              )}
              <button
                onClick={handleApply}
                disabled={applying || isCompleted || isApplied}
                className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-60"
              >
                {isCompleted
                  ? 'Completed'
                  : isApplied
                    ? 'Already applied'
                    : applying
                      ? 'Submitting application...'
                      : 'Apply for this job'}
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div id="reviews-section" className="mt-8">
          <JobReviewsSection
            jobId={jobId}
            jobTitle={job.title}
            isOwner={false}
            hasReviewed={hasReviewed}
            currentUserId={user?.id}
          />
        </div>
      </div>
    </div>
  );
};

export default SeekerJobDetail;

