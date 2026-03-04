import React, { useState, useEffect } from 'react';
import { Star, User, Quote, Calendar } from 'lucide-react';
import API from '../services/api';

const MyReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const res = await API.get('/api/reviews/my'); // Use direct API route if baseURL handles it
            setReviews(res.data);
        } catch (err) {
            console.error('Error fetching reviews:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#E6EEF2] py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <Star size={32} className="text-yellow-500 fill-current" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Reviews</h1>
                        <p className="text-slate-500 font-medium">Feedback from the community members you've helped</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                        <p className="mt-4 text-slate-600 font-bold">Loading your feedback...</p>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-slate-200 p-20 text-center shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Quote size={40} className="text-slate-200" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">No reviews yet</h3>
                        <p className="text-slate-500 font-medium max-w-sm mx-auto">
                            Complete some tasks and provide great service to earn positive reviews from the community!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {reviews.map((review, index) => (
                            <div key={index} className="bg-white rounded-[32px] border border-white shadow-sm p-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 text-slate-50">
                                    <Quote size={80} className="group-hover:text-emerald-50 transition-colors" />
                                </div>

                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={20}
                                                className={`${i < review.rating ? 'text-yellow-500 fill-current' : 'text-slate-200'}`}
                                            />
                                        ))}
                                        <span className="ml-2 font-black text-slate-900">{review.rating.toFixed(1)}</span>
                                    </div>

                                    <p className="text-lg font-medium text-slate-700 italic mb-8 leading-relaxed">
                                        "{review.comment}"
                                    </p>

                                    <div className="flex items-center justify-between border-t border-slate-50 pt-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                                <User size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900">{review.reviewerId?.name}</h4>
                                                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{review.jobId?.title}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                                            <Calendar size={16} />
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyReviews;
