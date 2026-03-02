import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Briefcase,
    MapPin,
    Calendar,
    Clock,
    DollarSign,
    User,
    ArrowLeft,
    CheckCircle,
    ShieldCheck,
    Zap,
    Bookmark,
    Send,
    Info
} from 'lucide-react';
import SeekerNavbar from '../components/SeekerNavbar';
import API from '../services/api';

const SeekerJobDetail = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isApplied, setIsApplied] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchJobDetails();
        checkApplicationStatus();
    }, [jobId]);

    const fetchJobDetails = async () => {
        try {
            setLoading(true);
            const response = await API.get(`/jobs/${jobId}`);
            setJob(response.data);
            // In a real app, you'd also fetch if it's saved from the backend
        } catch (err) {
            console.error('Error fetching job details:', err);
        } finally {
            setLoading(false);
        }
    };

    const checkApplicationStatus = async () => {
        try {
            const response = await API.get('/applications/my');
            const hasApplied = response.data.some(app => app.jobId?._id === jobId);
            setIsApplied(hasApplied);
        } catch (err) {
            console.error('Error checking application status:', err);
        }
    };

    const handleApply = async () => {
        try {
            setSubmitting(true);
            await API.post(`/applications/apply/${jobId}`);
            setIsApplied(true);
            alert('Application submitted successfully!');
        } catch (err) {
            console.error('Error applying:', err);
            alert(err.response?.data?.message || 'Failed to apply. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSave = async () => {
        try {
            if (isSaved) {
                await API.delete(`/jobs/save/${jobId}`);
                setIsSaved(false);
            } else {
                await API.post(`/jobs/save/${jobId}`);
                setIsSaved(true);
            }
        } catch (err) {
            console.error('Error saving job:', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#E6EEF2] flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                <p className="mt-4 text-slate-600 font-medium">Fetching job details...</p>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-[#E6EEF2] flex flex-col items-center justify-center p-6 text-center">
                <Info size={64} className="text-slate-300 mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Job not found</h2>
                <p className="text-slate-600 mb-8 max-w-md">This job may have been removed or the link is invalid.</p>
                <Link to="/marketplace" className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                    Return to Marketplace
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#E6EEF2]">
            <SeekerNavbar />

            <div className="max-w-5xl mx-auto px-6 py-8">
                {/* Navigation / Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors mb-6 group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back to Jobs</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Job Header Card */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8">
                                <button
                                    onClick={handleSave}
                                    className={`p-3 rounded-2xl transition-all ${isSaved ? 'bg-amber-100 text-amber-600 shadow-inner' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                >
                                    <Bookmark size={24} fill={isSaved ? "currentColor" : "none"} />
                                </button>
                            </div>

                            <div className="flex flex-col gap-6">
                                <div>
                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-full border border-emerald-200 mb-4 inline-block">
                                        {job.category || 'Volunteer Task'}
                                    </span>
                                    <h1 className="text-3xl font-black text-slate-900 mb-4 leading-tight">
                                        {job.title}
                                    </h1>

                                    <div className="flex flex-wrap items-center gap-6 text-slate-600">
                                        <div className="flex items-center gap-2 font-medium">
                                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-emerald-600 border border-slate-200">
                                                <DollarSign size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Rate</p>
                                                <p className="text-slate-900">₹{job.hourlyRate}/hr</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 font-medium">
                                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-blue-600 border border-slate-200">
                                                <Clock size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Duration</p>
                                                <p className="text-slate-900">{job.hours} hrs total</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 font-medium">
                                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-amber-600 border border-slate-200">
                                                <MapPin size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Location</p>
                                                <p className="text-slate-900">{job.location || 'Local community'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-slate-100 w-full"></div>

                                {/* Match Score (If available) */}
                                {job.matchScore && (
                                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                                        <div>
                                            <h4 className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                                                <Zap size={18} className="text-amber-500 fill-amber-500" />
                                                AI Smart Match
                                            </h4>
                                            <p className="text-sm text-slate-600">Based on your shared skills, you are a strong candidate!</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-3xl font-black text-emerald-600">{Math.round(job.matchScore)}%</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <ShieldCheck className="text-emerald-600" size={24} />
                                Task Description
                            </h2>
                            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                                {job.description}
                            </div>

                            <div className="mt-8 pt-8 border-t border-slate-100">
                                <h3 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-widest">Skills You'll Use</h3>
                                <div className="flex flex-wrap gap-2">
                                    {job.requiredSkills?.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-4 py-2 bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 shadow-sm"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Column */}
                    <div className="space-y-6">
                        {/* Apply Action Card */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl sticky top-28">
                            <div className="mb-6">
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Potential Earnings</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-slate-900">₹{job.hourlyRate * job.hours}</span>
                                    <span className="text-slate-500 font-medium">Credits</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <Calendar size={18} className="text-emerald-500" />
                                    <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <CheckCircle size={18} className="text-emerald-500" />
                                    <span>Verified Community Member</span>
                                </div>
                            </div>

                            <button
                                onClick={handleApply}
                                disabled={isApplied || submitting}
                                className={`w-full py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 ${isApplied
                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-100 hover:shadow-emerald-200 hover:-translate-y-1'
                                    }`}
                            >
                                {isApplied ? (
                                    <>
                                        <CheckCircle size={22} /> Applied
                                    </>
                                ) : (
                                    <>
                                        {submitting ? 'Submitting...' : 'Apply for Task'}
                                        <Send size={20} />
                                    </>
                                )}
                            </button>

                            <p className="mt-4 text-center text-xs text-slate-400 font-medium leading-relaxed">
                                Applying will share your profile and contact info with {job.poster?.name || 'the poster'}.
                            </p>
                        </div>

                        {/* Poster Info Card */}
                        <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group">
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-700"></div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-4 inline-block border-b border-emerald-900 pb-1">Posted By</h3>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center font-bold text-2xl border border-emerald-400/30">
                                    {job.poster?.name?.charAt(0) || 'C'}
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold">{job.poster?.name || 'Community Member'}</h4>
                                    <div className="flex items-center gap-1 text-emerald-400 mt-1">
                                        <ShieldCheck size={14} />
                                        <span className="text-xs font-bold uppercase tracking-tighter">Trusted Member</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SeekerJobDetail;
