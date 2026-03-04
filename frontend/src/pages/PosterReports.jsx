import React from 'react';
import { BarChart3, TrendingUp, Users, Clock, ArrowUpRight, ArrowDownRight, FileText, Download } from 'lucide-react';

const PosterReports = () => {
    const stats = [
        { label: 'Time Spent Helping', value: '124 hrs', change: '+12%', positive: true, icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Community Impact', value: '8.4/10', change: '+2%', positive: true, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Connections Made', value: '45', change: '-4%', positive: false, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    return (
        <div className="min-h-screen bg-[#E6EEF2] py-12 px-6 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Performance Reports</h1>
                        <p className="text-slate-500 font-medium">Track your community impact and service metrics.</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all text-slate-700 shadow-sm text-sm">
                        <Download size={18} /> Export Data
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-xl transition-all">
                            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 shadow-sm`}>
                                <stat.icon size={28} />
                            </div>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">{stat.label}</p>
                            <div className="flex items-baseline gap-3">
                                <h2 className="text-4xl font-black text-slate-900 tracking-tight">{stat.value}</h2>
                                <span className={`flex items-center gap-1 text-sm font-bold ${stat.positive ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {stat.positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                    {stat.change}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Activity Chart Placeholder */}
                    <div className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100 min-h-[400px] flex flex-col">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Activity Trend</h3>
                            <select className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs text-slate-600 outline-none">
                                <option>Last 6 Months</option>
                                <option>Last Year</option>
                            </select>
                        </div>
                        <div className="flex-1 flex items-end gap-3 pb-4">
                            {[40, 70, 45, 90, 65, 80].map((h, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                                    <div
                                        className="w-full bg-slate-100 rounded-2xl transition-all duration-500 group-hover:bg-emerald-500 relative"
                                        style={{ height: `${h}%` }}
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            {h}h
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl h-full flex flex-col justify-center">
                            <div className="absolute top-0 right-0 p-10 opacity-10">
                                <BarChart3 size={150} />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-3xl font-black mb-4 tracking-tight">AI Insights</h3>
                                <p className="text-slate-400 font-medium mb-8 leading-relaxed">
                                    Based on your recent activity, you're most productive between 10 AM and 2 PM. Your "Next Skill" recommendation is **Cloud Computing**.
                                </p>
                                <button className="flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-2xl font-black hover:scale-105 transition-all text-sm uppercase tracking-widest shadow-lg">
                                    <FileText size={18} /> View Advanced Analytics
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PosterReports;
