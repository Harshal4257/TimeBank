import React, { useState } from 'react';
import { Star, Send, X } from 'lucide-react';

const ReviewForm = ({ jobId, jobTitle, onReviewSubmitted, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    
    if (comment.trim().length < 10) {
      alert('Please write at least 10 characters for your review');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Mock API call - replace with actual API
      const reviewData = {
        jobId,
        rating,
        comment: comment.trim(),
        createdAt: new Date().toISOString(),
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onReviewSubmitted(reviewData);
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = () => (
    <div className="flex gap-2 mb-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          onMouseEnter={() => setHoveredStar(star)}
          onMouseLeave={() => setHoveredStar(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={32}
            className={`${
              star <= (hoveredStar || rating)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-secondary-200">
          <div>
            <h2 className="text-xl font-bold text-secondary-900">Write a Review</h2>
            <p className="text-sm text-secondary-600 mt-1">{jobTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-secondary-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Rating */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              How would you rate this job?
            </label>
            <StarRating />
            {rating > 0 && (
              <p className="text-sm text-secondary-600 mt-2">
                {rating === 5 && 'Excellent!'}
                {rating === 4 && 'Good'}
                {rating === 3 && 'Average'}
                {rating === 2 && 'Below Average'}
                {rating === 1 && 'Poor'}
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this job. What did you like? What could be improved?"
              className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={4}
              minLength={10}
              required
            />
            <p className="text-xs text-secondary-500 mt-1">
              {comment.length}/10 characters minimum
            </p>
          </div>

          {/* Guidelines */}
          <div className="mb-6 p-4 bg-secondary-50 rounded-lg">
            <h4 className="text-sm font-semibold text-secondary-900 mb-2">Review Guidelines:</h4>
            <ul className="text-xs text-secondary-600 space-y-1">
              <li>• Be honest and constructive in your feedback</li>
              <li>• Focus on the job requirements, company culture, and experience</li>
              <li>• Avoid personal attacks or inappropriate language</li>
              <li>• Help other seekers make informed decisions</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-secondary-300 text-secondary-700 rounded-xl font-medium hover:bg-secondary-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
              className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Submit Review
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
