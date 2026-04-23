import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase, Clock, DollarSign, CheckCircle, XCircle,
  Clock4, ArrowRight, IndianRupee, Star, MessageSquare,
  Edit, Trash2, X
} from 'lucide-react';
import API from '../services/api';

// ─── Inline Review Form ──────────────────────────────────────
const ReviewModal = ({ jobId, jobTitle, revieweeId, existingReview, onClose, onSaved }) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!rating) { alert('Please select a rating.'); return; }
    try {
      setSaving(true);
      if (existingReview?._id) {
        const res = await API.put(`/reviews/${existingReview._id}`, { rating, comment });
        onSaved(res.data, 'edit');
      } else {
        const res = await API.post('/reviews', { jobId, revieweeId, rating, comment });
        onSaved(res.data, 'add');
      }
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save review.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-black text-slate-900">{existingReview ? 'Edit Review' : 'Write a Review'}</h3>
            <p className="text-slate-500 text-sm mt-1">{jobTitle}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl">
            <X size={18} className="text-slate-500" />
          </button>
        </div>

        {/* Star Rating */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-slate-700 mb-3">Rating <span className="text-red-500">*</span></label>
          <div className="flex gap-2">
            {[1,2,3,4,5].map(s => (
              <button
                key={s}
                onMouseEnter={() => setHovered(s)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(s)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  size={32}
                  className={`transition-colors ${s <= (hovered || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 self-center text-sm font-bold text-slate-600">
                {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
              </span>
            )}
          </div>
        </div>

        {/* Comment */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-slate-700 mb-2">Comment <span className="text-slate-400 font-normal">(optional)</span></label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Share your experience with this job..."
            rows={4}
            className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none text-sm"
          />
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !rating}
            className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : existingReview ? 'Update Review' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────
const SeekerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);  // { jobId, title, revieweeId, existingReview }

  useEffect(() => {
    fetchMyApplications();
    fetchMyReviews();
  }, []);

  const fetchMyApplications = async () => {
    try {
      setLoading(true);
      const res = await API.get('/applications/my');
      setApplications(res.data);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyReviews = async () => {
    try {
      setReviewsLoading(true);
      const res = await API.get('/reviews/my');
      setReviews(res.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleOpenReview = (app, existingReview = null) => {
    setSelectedJob({
      jobId: app.jobId?._id || app.jobId,
      title: app.jobId?.title || 'Job',
      revieweeId: app.jobId?.poster,
      existingReview
    });
    setShowReviewModal(true);
  };

  const handleReviewSaved = (savedReview, action) => {
    if (action === 'add') {
      setReviews(prev => [savedReview, ...prev]);
    } else {
      setReviews(prev => prev.map(r => r._id === savedReview._id ? savedReview : r));
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await API.delete(`/reviews/${reviewId}`);
      setReviews(prev => prev.filter(r => r._id !== reviewId));
    } catch (err) {
      alert('Failed to delete review.');
    }
  };

  // Check if seeker already reviewed a job
  const getExistingReview = (jobId) => {
    if (!jobId) return undefined;
    const id = typeof jobId === 'object' ? jobId?._id : jobId;
    if (!id) return undefined;
    return reviews.find(r => {
      const rJobId = r.jobId?._id || r.jobId;
      return rJobId?.toString() === id?.toString();
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted': return <span className="flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium"><CheckCircle size={14} /> Accepted</span>;
      case 'rejected': return <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium"><XCircle size={14} /> Rejected</span>;
      case 'completed': return <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"><CheckCircle size={14} /> Completed & Paid</span>;
      case 'submitted': return <span className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"><Clock4 size={14} /> Submitted</span>;
      case 'revision_requested': return <span className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"><Clock4 size={14} /> 🔄 Revision Needed</span>;
      default: return <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium"><Clock4 size={14} /> Pending</span>;
    }
  };

  const filters = ['all', 'pending', 'accepted', 'submitted', 'completed', 'rejected'];
  const filteredApplications = activeFilter === 'all' ? applications : applications.filter(app => app.status === activeFilter);
  const completedCount = applications.filter(a => a.status === 'completed').length;
  const totalEarned = applications.filter(a => a.status === 'completed').reduce((sum, a) => sum + (a.jobId ? (a.jobId.hourlyRate * a.jobId.hours || 0) : 0), 0);

  return (
    <div className="min-h-screen bg-[#E6EEF2]">
      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Briefcase className="text-emerald-600" size={28} /> My Applications
          </h1>
          <p className="text-slate-600">Track the status of all jobs you've applied for.</p>
        </div>

        {/* Stats */}
        {!loading && applications.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-sm font-medium">Total Applications</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{applications.length}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-sm font-medium">Completed Jobs</p>
              <p className="text-3xl font-black text-blue-600 mt-1">{completedCount}</p>
            </div>
            <div className="bg-emerald-600 rounded-2xl p-5 shadow-sm">
              <p className="text-emerald-100 text-sm font-medium">Total Earned</p>
              <p className="text-3xl font-black text-white mt-1">₹{totalEarned}</p>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        {!loading && applications.length > 0 && (
          <div className="flex gap-2 mb-6 flex-wrap">
            {filters.map(filter => (
              <button key={filter} onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                  activeFilter === filter ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}>
                {filter === 'all' ? `All (${applications.length})` : `${filter.charAt(0).toUpperCase() + filter.slice(1)} (${applications.filter(a => a.status === filter).length})`}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <p className="mt-4 text-slate-600 font-medium">Loading your applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
            <Briefcase size={64} className="mx-auto text-slate-300 mb-6" />
            <h3 className="text-2xl font-bold text-slate-900 mb-4">You haven't applied to any jobs yet</h3>
            <Link to="/seeker-home" className="px-8 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-bold">Browse Jobs</Link>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
            <p className="text-slate-500 text-lg">No {activeFilter} applications found</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-100">
              {filteredApplications.map((app) => {
                const existingReview = getExistingReview(app.jobId);
                return (
                  <div key={app._id} className={`p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    app.status === 'completed' ? 'border-l-4 border-blue-500' :
                    app.status === 'accepted' ? 'border-l-4 border-emerald-500' :
                    app.status === 'submitted' ? 'border-l-4 border-purple-500' :
                    app.status === 'rejected' ? 'border-l-4 border-red-400' : 'border-l-4 border-yellow-400'
                  }`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-bold text-slate-900">{app.jobId ? app.jobId.title : 'Deleted Job'}</h3>
                        {getStatusBadge(app.status)}
                      </div>
                      {app.jobId && (
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <DollarSign size={16} className="text-slate-400" />
                            ₹{app.jobId.hourlyRate}/hr • {app.jobId.hours} hrs
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={16} className="text-slate-400" />
                            Applied {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                          </div>
                          {app.status === 'completed' && (
                            <div className="flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-full">
                              <IndianRupee size={14} className="text-emerald-600" />
                              <span className="text-emerald-700 font-bold">₹{app.jobId.hourlyRate * app.jobId.hours} received</span>
                            </div>
                          )}
                        </div>
                      )}
                      {/* Show existing review stars inline */}
                      {existingReview && (
                        <div className="flex items-center gap-1 mt-2">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} size={12} className={s <= existingReview.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'} />
                          ))}
                          <span className="text-xs text-slate-500 ml-1">Your review</span>
                        </div>
                      )}
                    </div>

                    <div className="flex shrink-0 gap-2">
                      {app.status === 'completed' && (
                        <button
                          onClick={() => handleOpenReview(app, existingReview || null)}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center gap-2"
                        >
                          <Star size={16} />
                          {existingReview ? 'Edit Review' : 'Write Review'}
                        </button>
                      )}
                      <Link
                        to={app.jobId?._id ? `/jobs/${app.jobId._id}` : '#'}
                        className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors font-medium flex items-center gap-2"
                      >
                        View Details <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── My Reviews Section ── */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">My Reviews</h2>
            <span className="text-sm text-slate-500">{reviews.length} review{reviews.length !== 1 ? 's' : ''} written</span>
          </div>

          {reviewsLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <MessageSquare size={48} className="text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No Reviews Yet</h3>
              <p className="text-slate-600">Complete a job and write a review to help other seekers.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="bg-white rounded-2xl border border-slate-200 p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="font-bold text-slate-900">{review.jobId?.title || 'Job'}</h3>
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} size={14} className={s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'} />
                          ))}
                          <span className="ml-1 text-sm font-medium text-slate-700">{review.rating}.0</span>
                        </div>
                      </div>
                      {review.comment && <p className="text-slate-700 leading-relaxed text-sm">{review.comment}</p>}
                      <p className="text-xs text-slate-400 mt-2">
                        Reviewed {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 ml-4">
                      <button
                        onClick={() => {
                          // Find app for this review to open modal
                          const app = applications.find(a => {
                            const jId = a.jobId?._id || a.jobId;
                            const rId = review.jobId?._id || review.jobId;
                            return jId?.toString() === rId?.toString();
                          });
                          if (app) handleOpenReview(app, review);
                        }}
                        className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Edit review"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete review"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showReviewModal && selectedJob && (
        <ReviewModal
          jobId={selectedJob.jobId}
          jobTitle={selectedJob.title}
          revieweeId={selectedJob.revieweeId}
          existingReview={selectedJob.existingReview}
          onClose={() => { setShowReviewModal(false); setSelectedJob(null); }}
          onSaved={handleReviewSaved}
        />
      )}
    </div>
  );
};

export default SeekerApplications;
