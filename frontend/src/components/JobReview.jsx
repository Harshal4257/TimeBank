import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, MessageSquare, Calendar, User, Trash2 } from 'lucide-react';

const JobReview = ({ 
  review, 
  isPoster = false, 
  onDeleteReview, 
  currentUserId,
  onReply,
  replyingTo,
  replyText,
  onReplyTextChange,
  onSubmitReply,
  onCancelReply
}) => {
  const [helpful, setHelpful] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('JobReview rendered with review:', review);
    console.log('Seeker name:', review.seekerName);
  }, [review]);

  const handleHelpful = () => {
    setHelpful(!helpful);
  };

  const handleReplySubmit = () => {
    onSubmitReply(review._id);
  };

  return (
    <div className="bg-white rounded-xl border border-secondary-200 p-6 hover:shadow-md transition-shadow">
      {/* Review Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <User size={20} className="text-primary-600" />
          </div>
          <div>
            <h4 className="font-semibold text-secondary-900">{review.seekerName}</h4>
            <div className="flex items-center gap-2 text-sm text-secondary-500">
              <Calendar size={14} />
              {new Date(review.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        
        {/* Star Rating */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={16}
              className={`${
                star <= review.rating
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
          <span className="ml-2 text-sm font-medium text-secondary-700">
            {review.rating}.0
          </span>
        </div>
      </div>

      {/* Review Comment */}
      <p className="text-secondary-700 mb-4 leading-relaxed">
        {review.comment}
      </p>

      {/* Review Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-secondary-100">
        <div className="flex items-center gap-4">
          <button
            onClick={handleHelpful}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              helpful
                ? 'bg-primary-100 text-primary-700'
                : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
            }`}
          >
            <ThumbsUp size={14} />
            Helpful {review.helpfulCount + (helpful ? 1 : 0)}
          </button>
          
          <button 
          onClick={() => onReply(review._id)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-secondary-100 text-secondary-600 hover:bg-secondary-200 transition-colors"
        >
          <MessageSquare size={14} />
          Reply
        </button>
        </div>
        
        <div className="flex items-center gap-2">
          {isPoster && (
            <span className="text-xs text-secondary-500">
              Applied: {review.appliedDate}
            </span>
          )}
          
          {/* Show delete button if it's the current user's review or if poster is deleting */}
          {(currentUserId === review.seekerId || isPoster) && onDeleteReview && (
            <button
              onClick={() => onDeleteReview(review._id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete review"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Reply Form */}
      {replyingTo === review._id && (
        <div className="mt-4 pt-4 border-t border-secondary-100">
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-primary-600" />
              </div>
              <div className="flex-1">
                <textarea
                  value={replyText}
                  onChange={(e) => onReplyTextChange(e.target.value)}
                  placeholder="Write your reply..."
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  rows="3"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={onCancelReply}
                className="px-4 py-2 border border-secondary-300 text-secondary-600 rounded-lg hover:bg-secondary-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleReplySubmit}
                disabled={!replyText.trim()}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Replies (if any) */}
      {review.replies && review.replies.length > 0 && (
        <div className="mt-4 pt-4 border-t border-secondary-100">
          <h5 className="text-sm font-semibold text-secondary-900 mb-3">Replies</h5>
          <div className="space-y-3">
            {review.replies.map((reply, index) => (
              <div key={index} className="flex gap-3 p-3 bg-secondary-50 rounded-lg">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={16} className="text-primary-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-secondary-900">
                      {reply.author}
                    </span>
                    <span className="text-xs text-secondary-500">
                      {new Date(reply.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-secondary-700">{reply.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobReview;
