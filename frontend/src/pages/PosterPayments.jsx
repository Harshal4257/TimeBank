import React from 'react';
import { CreditCard, ArrowUpRight, ArrowDownLeft, Plus, DollarSign, History } from 'lucide-react';

const PosterPayments = () => {
    const transactions = [
        { id: 1, type: 'Credit', amount: 50, date: 'Mar 1, 2024', status: 'Completed', job: 'Logo Design' },
        { id: 2, type: 'Debit', amount: 15, date: 'Feb 26, 2024', status: 'Completed', job: 'Article Writing' },
        { id: 3, type: 'Credit', amount: 30, date: 'Feb 20, 2024', status: 'Pending', job: 'Web Development' },
    ];

    return (
        <div className="min-h-screen bg-[#E6EEF2] py-12 px-6 font-sans">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Financial Center</h1>
                        <p className="text-slate-500 font-medium mt-1">Manage your Time Credits and payments.</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                        <Plus size={20} /> Add Credits
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="md:col-span-2 bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-10 opacity-10">
                            <CreditCard size={150} />
                        </div>
                        <div className="relative z-10">
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">Available Balance</p>
                            <h2 className="text-6xl font-black mb-10">₹420.50</h2>
                            <div className="flex gap-8">
                                <div>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">Total Spent</p>
                                    <p className="text-2xl font-bold">₹1,250</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">Total Earned</p>
                                    <p className="text-2xl font-bold">₹890</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[40px] p-8 border border-white shadow-xl flex flex-col justify-center items-center text-center">
                        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-4">
                            <History size={32} />
                        </div>
                        <h3 className="font-black text-slate-900 text-xl tracking-tight">Quick Action</h3>
                        <p className="text-slate-500 font-medium text-sm mb-6 mt-1">View your full transaction history for tax or accounting purposes.</p>
                        <button className="w-full py-4 bg-slate-50 text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100">
                            Export History
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Activity</h3>
                        <button className="text-emerald-600 font-bold text-sm hover:underline">View All</button>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {transactions.map(t => (
                            <div key={t.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${t.type === 'Credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                        {t.type === 'Credit' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{t.job}</h4>
                                        <p className="text-xs text-slate-400 font-medium">{t.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-black text-lg ${t.type === 'Credit' ? 'text-emerald-600' : 'text-slate-900'}`}>
                                        {t.type === 'Credit' ? '+' : '-'}₹{t.amount}
                                    </p>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${t.status === 'Completed' ? 'text-blue-500' : 'text-yellow-500'}`}>
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
