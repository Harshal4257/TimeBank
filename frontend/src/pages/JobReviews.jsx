import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ArrowLeft, User, MessageSquare } from 'lucide-react';
import API from '../services/api';

const JobReviews = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const [reviewsRes, jobRes] = await Promise.all([
          API.get(`/reviews/job/${jobId}`),
          API.get(`/jobs/${jobId}`)
        ]);
        setReviews(reviewsRes.data);
        setJobTitle(jobRes.data?.title || 'Job');
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [jobId]);

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="min-h-screen bg-[#E6EEF2] py-10 px-6">
      <div className="max-w-3xl mx-auto">

        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-medium"
        >
          <ArrowLeft size={18} /> Back
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-3 mb-1">
            <MessageSquare size={20} className="text-emerald-600" />
            <h1 className="text-2xl font-black text-slate-900">Reviews</h1>
          </div>
          <p className="text-slate-500 text-sm ml-8">{jobTitle}</p>

          {avgRating && (
            <div className="flex items-center gap-3 mt-4 ml-8">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < Math.round(avgRating) ? 'text-yellow-500 fill-current' : 'text-slate-200'}
                  />
                ))}
              </div>
              <span className="text-2xl font-black text-slate-800">{avgRating}</span>
              <span className="text-slate-400 text-sm">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
            </div>
          )}
        </div>

        {/* Reviews list */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm">
            <Star size={48} className="text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-black text-slate-800 mb-2">No reviews yet</h3>
            <p className="text-slate-500 text-sm">Reviews will appear here once seekers complete this job.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                {/* Stars */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < review.rating ? 'text-yellow-500 fill-current' : 'text-slate-200'}
                    />
                  ))}
                  <span className="ml-2 text-sm font-bold text-slate-700">{review.rating}.0</span>
                </div>

                {/* Comment */}
                {review.comment && (
                  <p className="text-slate-700 text-sm leading-relaxed mb-4">"{review.comment}"</p>
                )}

                {/* Reviewer info */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center">
                      <User size={18} className="text-emerald-700" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {review.reviewerId?.name || 'Anonymous'}
                      </p>
                      <p className="text-xs text-slate-400">Verified worker</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">
                    {new Date(review.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobReviews;
