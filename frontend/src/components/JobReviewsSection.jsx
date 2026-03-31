import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, TrendingUp, Users, Filter, ChevronDown } from 'lucide-react';
import JobReview from './JobReview';
import ReviewForm from './ReviewForm';

const JobReviewsSection = ({ jobId, jobTitle, isOwner = false, hasReviewed = false, currentUserId }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [replyingTo, setReplyingTo] = useState(null); // Track which review is being replied to
  const [replyText, setReplyText] = useState(''); // Track reply text

  // Mock initial reviews data
  const initialReviews = [
    {
      _id: '1',
      seekerName: 'John Doe',
      rating: 5,
      comment: 'Great opportunity! The job description was clear, the interview process was smooth, and the team was very professional.',
      createdAt: new Date('2024-01-15').toISOString(),
      helpfulCount: 12,
      appliedDate: '2024-01-10',
      seekerId: 'seeker1',
      replies: [
        {
          author: 'Company HR',
          message: 'Thank you for your wonderful feedback! We\'re glad you had a positive experience.',
          createdAt: new Date('2024-01-16').toISOString()
        }
      ]
    },
    {
      _id: '2',
      seekerName: 'Jane Smith',
      rating: 4,
      comment: 'Good job overall. The requirements were clear and the company seems to have a good culture.',
      createdAt: new Date('2024-01-10').toISOString(),
      helpfulCount: 8,
      appliedDate: '2024-01-08',
      seekerId: 'seeker2',
      replies: []
    },
    {
      _id: '3',
      seekerName: 'Mike Johnson',
      rating: 3,
      comment: 'Average experience. The job itself is good but the application process could be more streamlined.',
      createdAt: new Date('2024-01-05').toISOString(),
      helpfulCount: 5,
      appliedDate: '2024-01-03',
      seekerId: 'seeker3',
      replies: []
    }
  ];

  // Load reviews from localStorage on component mount
  useEffect(() => {
    console.log('JobReviewsSection mounted with jobId:', jobId);
    const savedReviews = loadReviewsFromStorage(jobId);
    console.log('Loading reviews for job:', jobId, 'Found:', savedReviews.length, 'reviews');
    console.log('Review details:', savedReviews.map(r => ({ id: r._id, name: r.seekerName, rating: r.rating })));
    setReviews(savedReviews);
  }, [jobId]);

  // Calculate rating statistics
  const calculateStats = () => {
    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
    
    const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
      stars,
      count: reviews.filter(r => r.rating === stars).length,
      percentage: (reviews.filter(r => r.rating === stars).length / totalReviews) * 100
    }));

    return {
      totalReviews,
      averageRating: averageRating.toFixed(1),
      ratingDistribution
    };
  };

  const stats = calculateStats();

  const handleReviewSubmitted = (newReview) => {
    // Get actual user name from localStorage or context
    const getUserDisplayName = () => {
      try {
        // Try to get from localStorage first
        const storedName = localStorage.getItem('name');
        const storedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
        const profileName = storedProfile.name;
        
        // Use the most available name
        return profileName || storedName || 'Anonymous User';
      } catch (error) {
        console.error('Error getting user name:', error);
        return 'Anonymous User';
      }
    };

    // Create a complete review object with user info
    const completeReview = {
      _id: `review_${Date.now()}`,
      seekerName: getUserDisplayName(), // Get actual user name
      rating: newReview.rating,
      comment: newReview.comment,
      createdAt: newReview.createdAt,
      helpfulCount: 0,
      appliedDate: new Date().toISOString().split('T')[0],
      seekerId: currentUserId || 'current_user',
      replies: []
    };

    // Add the new review to the beginning of the reviews array
    const updatedReviews = [completeReview, ...reviews];
    setReviews(updatedReviews);
    
    // Save to localStorage for persistence
    saveReviewsToStorage(jobId, updatedReviews);
    
    // Close the form
    setShowReviewForm(false);
    
    console.log('New review added and saved:', completeReview);
  };

  // Function to save reviews to localStorage
  const saveReviewsToStorage = (jobId, reviewsList) => {
    try {
      const existingReviews = JSON.parse(localStorage.getItem('jobReviews') || '{}');
      existingReviews[jobId] = reviewsList;
      localStorage.setItem('jobReviews', JSON.stringify(existingReviews));
      console.log('Saved reviews for job:', jobId, 'Reviews:', reviewsList);
    } catch (error) {
      console.error('Error saving reviews to localStorage:', error);
    }
  };

  // Function to load reviews from localStorage
  const loadReviewsFromStorage = (jobId) => {
    try {
      const existingReviews = JSON.parse(localStorage.getItem('jobReviews') || '{}');
      console.log('All job reviews from storage:', existingReviews);
      console.log('Reviews for this job:', existingReviews[jobId]);
      
      const jobReviews = existingReviews[jobId] || initialReviews;
      console.log('Final reviews to load:', jobReviews);
      return jobReviews;
    } catch (error) {
      console.error('Error loading reviews from localStorage:', error);
      return initialReviews;
    }
  };

  // Function to delete a review
  const handleDeleteReview = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        // Remove from state
        const updatedReviews = reviews.filter(r => r._id !== reviewId);
        setReviews(updatedReviews);
        
        // Remove from localStorage
        saveReviewsToStorage(jobId, updatedReviews);
        
        // Also remove from user reviews if it's the current user's review
        try {
          const userReviews = JSON.parse(localStorage.getItem('userReviews') || '[]');
          const updatedUserReviews = userReviews.filter(r => r._id !== reviewId);
          localStorage.setItem('userReviews', JSON.stringify(updatedUserReviews));
        } catch (error) {
          console.error('Error removing review from userReviews:', error);
        }
        
        console.log('Review deleted successfully');
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  // Function to handle reply to review
  const handleReply = (reviewId) => {
    setReplyingTo(reviewId);
    setReplyText('');
  };

  // Function to submit reply
  const handleSubmitReply = (reviewId) => {
    if (!replyText.trim()) return;

    try {
      // Get poster name from localStorage
      const posterName = localStorage.getItem('name') || 'Company HR';
      
      // Update the review with new reply
      const updatedReviews = reviews.map(review => {
        if (review._id === reviewId) {
          const newReply = {
            author: posterName,
            message: replyText.trim(),
            createdAt: new Date().toISOString()
          };
          
          return {
            ...review,
            replies: [...(review.replies || []), newReply]
          };
        }
        return review;
      });

      setReviews(updatedReviews);
      saveReviewsToStorage(jobId, updatedReviews);
      
      // Reset reply form
      setReplyingTo(null);
      setReplyText('');
      
      console.log('Reply submitted successfully');
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  // Function to cancel reply
  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
  };

  const filteredAndSortedReviews = reviews
    .filter(review => {
      if (filterBy === 'all') return true;
      return review.rating === parseInt(filterBy);
    })
    .sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'helpful') return b.helpfulCount - a.helpfulCount;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="max-w-4xl mx-auto">
      {/* Reviews Header */}
      <div className="bg-white rounded-2xl border border-secondary-200 p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-secondary-900 mb-2">Reviews for {jobTitle}</h2>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      className={`${
                        star <= Math.round(stats.averageRating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-secondary-900">
                  {stats.averageRating}
                </span>
                <span className="text-secondary-600">({stats.totalReviews} reviews)</span>
              </div>
            </div>
          </div>

          {!hasReviewed && !isOwner && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              <MessageSquare size={18} />
              Write a Review
            </button>
          )}
        </div>

        {/* Rating Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-secondary-900 mb-3">Rating Distribution</h4>
            <div className="space-y-2">
              {stats.ratingDistribution.map(({ stars, count, percentage }) => (
                <div key={stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm text-secondary-600">{stars}</span>
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  </div>
                  <div className="flex-1 bg-secondary-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-yellow-400 h-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-secondary-600 w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-secondary-900 mb-3">Review Insights</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-secondary-600">
                <TrendingUp size={16} className="text-green-600" />
                <span>{Math.round(stats.totalReviews * 0.7)}% would recommend</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-secondary-600">
                <Users size={16} className="text-blue-600" />
                <span>{stats.totalReviews} verified applicants</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="bg-white rounded-2xl border border-secondary-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-secondary-600" />
              <span className="text-sm font-medium text-secondary-700">Filter:</span>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="px-3 py-1.5 border border-secondary-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Reviews</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-secondary-700">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 border border-secondary-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="recent">Most Recent</option>
                <option value="helpful">Most Helpful</option>
                <option value="rating">Highest Rating</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-secondary-600">
            Showing {filteredAndSortedReviews.length} of {reviews.length} reviews
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredAndSortedReviews.length === 0 ? (
          <div className="bg-white rounded-2xl border border-secondary-200 p-8 text-center">
            <MessageSquare size={48} className="text-secondary-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">No Reviews Yet</h3>
            <p className="text-secondary-600 mb-4">
              Be the first to share your experience with this job!
            </p>
            {!hasReviewed && !isOwner && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
              >
                Write First Review
              </button>
            )}
          </div>
        ) : (
          filteredAndSortedReviews.map((review) => (
            <JobReview
              key={review._id}
              review={review}
              isPoster={isOwner}
              onDeleteReview={handleDeleteReview}
              currentUserId={currentUserId}
              onReply={handleReply}
              replyingTo={replyingTo}
              replyText={replyText}
              onReplyTextChange={setReplyText}
              onSubmitReply={handleSubmitReply}
              onCancelReply={handleCancelReply}
            />
          ))
        )}
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          jobId={jobId}
          jobTitle={jobTitle}
          onReviewSubmitted={handleReviewSubmitted}
          onClose={() => setShowReviewForm(false)}
        />
      )}
    </div>
  );
};

export default JobReviewsSection;
