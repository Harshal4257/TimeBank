import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Clock, DollarSign, CheckCircle, XCircle, Clock4, ArrowRight, IndianRupee, Star, MessageSquare, Edit, Trash2 } from 'lucide-react';
import API from '../services/api';
import ReviewForm from '../components/ReviewForm';

const SeekerApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const [reviews, setReviews] = useState([]);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [selectedJobForReview, setSelectedJobForReview] = useState(null);

    useEffect(() => {
        fetchMyApplications();
        fetchMyReviews();
    }, []);

    const fetchMyReviews = async () => {
        try {
            // Load reviews from localStorage first
            const savedReviews = JSON.parse(localStorage.getItem('userReviews') || '[]');
            setReviews(savedReviews);

            // Mock reviews data - replace with actual API call
            const mockReviews = [
                {
                    _id: '1',
                    jobId: 'job123',
                    jobTitle: 'Senior React Developer',
                    rating: 5,
                    comment: 'Great opportunity! The job description was clear, the interview process was smooth, and the team was very professional.',
                    createdAt: new Date('2024-01-15').toISOString(),
                    helpfulCount: 12,
                    canEdit: true,
                    canDelete: true
                },
                {
                    _id: '2',
                    jobId: 'job456',
                    jobTitle: 'Frontend Developer',
                    rating: 4,
                    comment: 'Good job overall. The requirements were clear and the company seems to have a good culture.',
                    createdAt: new Date('2024-01-10').toISOString(),
                    helpfulCount: 8,
                    canEdit: true,
                    canDelete: true
                }
            ];
            
            // Combine saved reviews with mock reviews (avoid duplicates)
            const combinedReviews = [...savedReviews];
            mockReviews.forEach(mockReview => {
                if (!combinedReviews.find(r => r._id === mockReview._id)) {
                    combinedReviews.push(mockReview);
                }
            });
            
            setReviews(combinedReviews);
        } catch (err) {
            console.error('Error fetching reviews:', err);
        }
    };

    const fetchMyApplications = async () => {
        try {
            setLoading(true);
            const response = await API.get('/applications/my');
            setApplications(response.data);
        } catch (err) {
            console.error('Error fetching applications:', err);
        } finally {
            setLoading(false);
        }
    };

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

        const completeReview = {
            _id: `review_${Date.now()}`,
            jobId: selectedJobForReview.jobId,
            jobTitle: selectedJobForReview.title,
            rating: newReview.rating,
            comment: newReview.comment,
            createdAt: newReview.createdAt,
            helpfulCount: 0,
            canEdit: true,
            canDelete: true,
            seekerName: getUserDisplayName(), // Get actual user name
            seekerId: 'current_user'
        };

        // Add the new review to the beginning of the reviews array
        const updatedReviews = [completeReview, ...reviews];
        setReviews(updatedReviews);
        
        // Save to localStorage for persistence
        try {
            localStorage.setItem('userReviews', JSON.stringify(updatedReviews));
        } catch (error) {
            console.error('Error saving reviews to localStorage:', error);
        }
        
        // Also save to job-specific storage
        try {
            const jobReviews = JSON.parse(localStorage.getItem('jobReviews') || '{}');
            if (!jobReviews[selectedJobForReview.jobId]) {
                jobReviews[selectedJobForReview.jobId] = [];
            }
            jobReviews[selectedJobForReview.jobId].unshift(completeReview);
            localStorage.setItem('jobReviews', JSON.stringify(jobReviews));
        } catch (error) {
            console.error('Error saving job reviews to localStorage:', error);
        }
        
        setShowReviewForm(false);
        setSelectedJobForReview(null);
    };

    const handleEditReview = (review) => {
        setSelectedJobForReview({
            jobId: review.jobId,
            title: review.jobTitle,
            existingReview: review
        });
        setShowReviewForm(true);
    };

    const handleDeleteReview = async (reviewId) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            try {
                // Mock API call - replace with actual API
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Remove from state
                const updatedReviews = reviews.filter(r => r._id !== reviewId);
                setReviews(updatedReviews);
                
                // Remove from localStorage
                try {
                    localStorage.setItem('userReviews', JSON.stringify(updatedReviews));
                    
                    // Also remove from job-specific storage
                    const jobReviews = JSON.parse(localStorage.getItem('jobReviews') || '{}');
                    const reviewToDelete = reviews.find(r => r._id === reviewId);
                    if (reviewToDelete && jobReviews[reviewToDelete.jobId]) {
                        jobReviews[reviewToDelete.jobId] = jobReviews[reviewToDelete.jobId].filter(r => r._id !== reviewId);
                        localStorage.setItem('jobReviews', JSON.stringify(jobReviews));
                    }
                } catch (error) {
                    console.error('Error removing review from localStorage:', error);
                }
                
                alert('Review deleted successfully!');
            } catch (err) {
                console.error('Error deleting review:', err);
                alert('Failed to delete review. Please try again.');
            }
        }
    };

    const handleAddReview = (app) => {
        setSelectedJobForReview({
            jobId: app.jobId?._id || app.jobId,
            title: app.jobId?.title || app.title || 'Job Title'
        });
        setShowReviewForm(true);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'accepted':
                return (
                    <span className="flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                        <CheckCircle size={14} /> Accepted
                    </span>
                );
            case 'rejected':
                return (
                    <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                        <XCircle size={14} /> Rejected
                    </span>
                );
            case 'completed':
                return (
                    <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        <CheckCircle size={14} /> Completed & Paid
                    </span>
                );
            case 'pending':
            default:
                return (
                    <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                        <Clock4 size={14} /> Pending
                    </span>
                );
        }
    };

    const filters = ['all', 'pending', 'accepted', 'completed', 'rejected'];

    const filteredApplications = activeFilter === 'all'
        ? applications
        : applications.filter(app => app.status === activeFilter);

    const completedCount = applications.filter(a => a.status === 'completed').length;
    const totalEarned = applications
        .filter(a => a.status === 'completed')
        .reduce((sum, a) => sum + (a.jobId?.hourlyRate * a.jobId?.hours || 0), 0);

    return (
        <div className="min-h-screen bg-[#E6EEF2]">
            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <Briefcase className="text-emerald-600" size={28} />
                        My Applications
                    </h1>
                    <p className="text-slate-600">Track the status of all jobs you've applied for.</p>
                </div>

                {/* Stats Cards */}
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
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                                    activeFilter === filter
                                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                                {filter === 'all' ? `All (${applications.length})` : 
                                 filter === 'completed' ? `Completed (${applications.filter(a => a.status === 'completed').length})` :
                                 filter === 'pending' ? `Pending (${applications.filter(a => a.status === 'pending').length})` :
                                 filter === 'accepted' ? `Accepted (${applications.filter(a => a.status === 'accepted').length})` :
                                 `Rejected (${applications.filter(a => a.status === 'rejected').length})`}
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
                        <p className="text-slate-600 mb-8 max-w-md mx-auto">
                            Start earning Time Credits by volunteering for tasks in your community!
                        </p>
                        <Link to="/marketplace" className="px-8 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-bold shadow-lg shadow-emerald-100 transition-all">
                            Browse Jobs
                        </Link>
                    </div>
                ) : filteredApplications.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
                        <p className="text-slate-500 text-lg">No {activeFilter} applications found</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="divide-y divide-slate-100">
                            {filteredApplications.map((app) => (
                                <div
                                    key={app._id}
                                    className={`p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                                        app.status === 'completed' ? 'border-l-4 border-blue-500' :
                                        app.status === 'accepted' ? 'border-l-4 border-emerald-500' :
                                        app.status === 'rejected' ? 'border-l-4 border-red-400' :
                                        'border-l-4 border-yellow-400'
                                    }`}
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                                            <h3 className="text-lg font-bold text-slate-900">
                                                {app.jobId ? app.jobId.title : 'Deleted Job'}
                                            </h3>
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
                                                {/* ✅ Show payment amount for completed jobs */}
                                                {app.status === 'completed' && (
                                                    <div className="flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-full">
                                                        <IndianRupee size={14} className="text-emerald-600" />
                                                        <span className="text-emerald-700 font-bold">
                                                            ₹{app.jobId.hourlyRate * app.jobId.hours} received
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex shrink-0 gap-2">
                                        {app.status === 'completed' && (
                                            <button
                                                onClick={() => handleAddReview(app)}
                                                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center gap-2"
                                            >
                                                <Star size={16} />
                                                Write Review
                                            </button>
                                        )}
                                        <Link
                                            to={app.jobId ? `/jobs/${app.jobId._id}` : '#'}
                                            className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors font-medium flex items-center gap-2"
                                        >
                                            View Details <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* My Reviews Section */}
                <div className="mt-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">My Reviews</h2>
                        <div className="text-sm text-slate-600">
                            {reviews.length} review{reviews.length !== 1 ? 's' : ''} written
                        </div>
                    </div>

                    {reviews.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
                            <MessageSquare size={48} className="text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Reviews Yet</h3>
                            <p className="text-slate-600 mb-4">
                                Share your experience with jobs you've applied to help other seekers.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div key={review._id} className="bg-white rounded-2xl border border-slate-200 p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-semibold text-slate-900">{review.jobTitle}</h3>
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
                                                    <span className="ml-2 text-sm font-medium text-slate-700">
                                                        {review.rating}.0
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-slate-700 leading-relaxed">{review.comment}</p>
                                            <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                                                <span>Reviewed {new Date(review.createdAt).toLocaleDateString()}</span>
                                                <span>{review.helpfulCount} helpful votes</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEditReview(review)}
                                                className="p-2 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                title="Edit review"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteReview(review._id)}
                                                className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

            {/* Review Form Modal */}
            {showReviewForm && selectedJobForReview && (
                <ReviewForm
                    jobId={selectedJobForReview.jobId}
                    jobTitle={selectedJobForReview.title}
                    onReviewSubmitted={handleReviewSubmitted}
                    onClose={() => {
                        setShowReviewForm(false);
                        setSelectedJobForReview(null);
                    }}
                />
            )}
        </div>
    );
};

export default SeekerApplications;
