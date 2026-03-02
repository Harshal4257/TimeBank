import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Calendar, Clock, DollarSign, CheckCircle, XCircle, Clock4, ArrowRight } from 'lucide-react';
import SeekerNavbar from '../components/SeekerNavbar';
import API from '../services/api';

const SeekerApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyApplications();
    }, []);

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
                        <CheckCircle size={14} /> Completed
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

    return (
        <div className="min-h-screen bg-[#E6EEF2]">
            <SeekerNavbar />

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <Briefcase className="text-emerald-600" size={28} />
                        My Applications
                    </h1>
                    <p className="text-slate-600">Track the status of all jobs you've applied for.</p>
                </div>

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
                ) : (
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="divide-y divide-slate-100">
                            {applications.map((app) => (
                                <div key={app._id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-slate-900">
                                                {app.jobId ? app.jobId.title : 'Deleted Job'}
                                            </h3>
                                            {getStatusBadge(app.status)}
                                        </div>

                                        {app.jobId && (
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                                                <div className="flex items-center gap-1">
                                                    <DollarSign size={16} className="text-slate-400" />
                                                    {app.jobId.hourlyRate} / hr
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock size={16} className="text-slate-400" />
                                                    Applied {new Date(app.appliedAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex shrink-0">
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
            </div>
        </div>
    );
};

export default SeekerApplications;
