import React, { useEffect, useState } from 'react';
import { CreditCard, ArrowUpRight, History } from 'lucide-react';
import API from '../services/api';
import { initiatePayment } from '../utils/razorpay';

const PosterPayments = () => {
    const [transactions, setTransactions] = useState([]);
    const [completedApps, setCompletedApps] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [txRes, appRes] = await Promise.all([
                API.get('/payments/transactions'),
                API.get('/applications/my-accepted')
            ]);
            setTransactions(txRes.data);
            setCompletedApps(appRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handlePayment = (applicationId) => {
        initiatePayment(applicationId, fetchData);
    };

    const totalSpent = transactions
        .filter(t => t.status === 'paid')
        .reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="min-h-screen bg-[#E6EEF2] py-12 px-6 font-sans">
            <div className="max-w-5xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Financial Center</h1>
                    <p className="text-slate-500 font-medium mt-1">Pay seekers and manage your transactions.</p>
                </div>

                {/* Stats Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="md:col-span-2 bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-10 opacity-10">
                            <CreditCard size={150} />
                        </div>
                        <div className="relative z-10">
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">Total Paid Out</p>
                            <h2 className="text-6xl font-black mb-10">₹{totalSpent}</h2>
                            <p className="text-slate-400 text-sm">{transactions.filter(t => t.status === 'paid').length} completed payments</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-[40px] p-8 shadow-xl flex flex-col justify-center items-center text-center">
                        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-4">
                            <History size={32} />
                        </div>
                        <h3 className="font-black text-slate-900 text-xl">Pending Payments</h3>
                        <p className="text-4xl font-black text-emerald-600 mt-2">{completedApps.length}</p>
                        <p className="text-slate-500 text-sm mt-1">jobs awaiting payment</p>
                    </div>
                </div>

                {/* Pay Seekers Section */}
                {completedApps.length > 0 && (
                    <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm mb-8">
                        <div className="p-8 border-b border-slate-50 bg-slate-50/30">
                            <h3 className="text-xl font-black text-slate-900">Pay Seekers</h3>
                            <p className="text-slate-500 text-sm mt-1">These jobs are complete — pay the seeker now</p>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {completedApps.map(app => (
                                <div key={app._id} className="p-6 flex items-center justify-between hover:bg-slate-50/50">
                                    <div>
                                        <h4 className="font-bold text-slate-900">{app.jobId?.title}</h4>
                                        <p className="text-sm text-slate-500">Seeker: {app.seekerId?.name}</p>
                                        {/* ✅ New */}
                                        <p className="text-sm text-emerald-600 font-bold">₹{app.jobId?.hourlyRate * app.jobId?.hours}</p>
                                    </div>
                                    <button
                                        onClick={() => handlePayment(app._id)}
                                        className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                                    >
                                        Pay Now
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Transaction History */}
                <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-8 border-b border-slate-50 bg-slate-50/30">
                        <h3 className="text-xl font-black text-slate-900">Transaction History</h3>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {loading ? (
                            <p className="p-8 text-slate-400 text-center">Loading...</p>
                        ) : transactions.length === 0 ? (
                            <p className="p-8 text-slate-400 text-center">No transactions yet</p>
                        ) : transactions.map(t => (
                            <div key={t._id} className="p-6 flex items-center justify-between hover:bg-slate-50/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                                        <ArrowUpRight size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{t.jobId?.title}</h4>
                                        <p className="text-xs text-slate-400">To: {t.seekerId?.name} • {new Date(t.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-lg text-slate-900">-₹{t.amount}</p>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${t.status === 'paid' ? 'text-blue-500' : 'text-yellow-500'}`}>
                                        {t.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PosterPayments;