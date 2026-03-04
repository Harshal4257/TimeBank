import React, { useState, useEffect } from 'react';
import { Bookmark, Briefcase, Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const SavedJobs = () => {
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSavedJobs();
    }, []);

    const fetchSavedJobs = async () => {
        try {
            setLoading(true);
            const res = await API.get('/jobs/saved');
            setSavedJobs(res.data);
        } catch (err) {
            console.error('Error fetching saved jobs:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUnsave = async (jobId) => {
        try {
            await API.delete(`/jobs/save/${jobId}`);
            setSavedJobs(savedJobs.filter(job => job._id !== jobId));
        } catch (err) {
            console.error('Error unsaving job:', err);
            alert('Failed to unsave job');
        }
    };

    return (
        <div className="min-h-screen bg-[#E6EEF2] py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <Bookmark size={32} className="text-emerald-600" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Saved Jobs</h1>
                        <p className="text-slate-500 font-medium">Opportunities you've bookmarked for later</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                        <p className="mt-4 text-slate-600 font-bold">Loading your bookmarks...</p>
                    </div>
                ) : savedJobs.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-slate-200 p-20 text-center shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Bookmark size={40} className="text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">No saved jobs yet</h3>
                        <p className="text-slate-500 font-medium max-w-sm mx-auto mb-8">
                            Browse the marketplace and save jobs that interest you to see them here!
                        </p>
                        <Link
                            to="/marketplace"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg"
                        >
                            Browse Jobs
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {savedJobs.map(job => (
                            <div key={job._id} className="bg-white rounded-3xl border border-slate-200 p-6 flex items-center justify-between hover:shadow-md transition-all group">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                                        <Briefcase size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">
                                            {job.title}
                                        </h3>
                                        <div className="flex items-center gap-4 mt-1">
                                            <span className="text-sm font-bold text-slate-400 italic">By {job.poster?.name || 'Poster'}</span>
                                            <span className="text-sm font-black text-emerald-600">${job.hourlyRate}/hr</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Link
                                        to={`/jobs/${job._id}`}
                                        className="p-3 bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                        title="View Details"
                                    >
                                        <ExternalLink size={20} />
                                    </Link>
                                    <button
                                        onClick={() => handleUnsave(job._id)}
                                        className="p-3 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                        title="Remove from Saved"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedJobs;
