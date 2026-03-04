import React from 'react';
import { Shield, Lock, Eye, FileLock, UserCheck, AlertCircle } from 'lucide-react';

const Privacy = () => {
    return (
        <div className="min-h-screen bg-[#E6EEF2] py-16 px-6 font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex p-4 bg-emerald-50 rounded-[28px] text-emerald-600 mb-6 border border-emerald-100 shadow-sm">
                        <Shield size={48} />
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">Privacy Center</h1>
                    <p className="text-xl text-slate-500 font-medium">Clear, honest terms about your data and safety.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                            <Lock size={32} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">Encrypted Data</h3>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">
                            Your personal information and password are encrypted using industry-standard protocols.
                        </p>
                    </div>

                    <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                            <Eye size={32} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">Control Visibility</h3>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">
                            You decide which parts of your profile are public to other community members.
                        </p>
                    </div>
                </div>

                <div className="bg-white p-12 rounded-[48px] shadow-xl border border-white mb-12">
                    <h2 className="text-2xl font-black text-slate-900 mb-8 border-b border-slate-50 pb-6 tracking-tight flex items-center gap-3">
                        <FileLock className="text-emerald-500" /> Information We Collect
                    </h2>
                    <div className="space-y-8">
                        <div className="flex gap-6">
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                                <UserCheck size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-lg mb-1">Account Information</h4>
                                <p className="text-slate-500 font-medium text-sm leading-relaxed">
                                    We collect your name, email, and skills to help match you with the right opportunities.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                                <AlertCircle size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-lg mb-1">Activity Data</h4>
                                <p className="text-slate-500 font-medium text-sm leading-relaxed">
                                    Your job postings, applications, and reviews are stored to maintain trust in the system.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-emerald-600 rounded-[48px] p-12 text-center text-white shadow-2xl shadow-emerald-200">
                    <h3 className="text-3xl font-black mb-4 tracking-tight">Your Data, Your Rights</h3>
                    <p className="text-emerald-50 mb-8 font-medium max-w-2xl mx-auto">
                        We never sell your data to third parties. You can request a copy of your data or account deletion at any time via settings.
                    </p>
                    <button className="bg-white text-emerald-700 px-10 py-4 rounded-[20px] font-black hover:scale-105 active:scale-95 transition-all shadow-lg">
                        Read Full Privacy Policy
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
