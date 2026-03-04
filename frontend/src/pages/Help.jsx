import React from 'react';
import { HelpCircle, Search, MessageCircle, FileText, ChevronRight, PlayCircle } from 'lucide-react';

const Help = () => {
    const faqs = [
        { q: "How do Time Credits work?", a: "One hour of service equals one Time Credit. You earned 30 credits automatically upon registration!" },
        { q: "How do I apply for a job?", a: "Go to the Marketplace, find a job that matches your skills, and click the 'Apply' button." },
        { q: "Can I be both a Seeker and a Poster?", a: "Yes! You can switch roles at any time. Your credits remain the same across both roles." },
        { q: "How are credits transferred?", a: "Once a job is marked as complete by the Poster, credits are automatically transferred to the Seeker's account." },
    ];

    return (
        <div className="min-h-screen bg-[#E6EEF2] font-sans">
            {/* Hero Section */}
            <div className="bg-slate-900 pt-20 pb-40 px-6 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl font-black text-white mb-6 tracking-tight">How can we help?</h1>
                    <div className="relative max-w-2xl mx-auto shadow-2xl">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
                        <input
                            type="text"
                            placeholder="Search help articles..."
                            className="w-full pl-16 pr-6 py-6 bg-white border-0 rounded-[24px] focus:ring-4 focus:ring-emerald-500/20 outline-none text-lg font-medium"
                        />
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-6xl mx-auto px-6 -mt-20 pb-20">
                {/* Stats / Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <div className="bg-white p-8 rounded-[32px] shadow-xl border border-white hover:scale-105 transition-all">
                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 font-bold shadow-sm">
                            <PlayCircle size={28} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Getting Started</h3>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">Learn the basics of TimeBank and how to make the most of your membership.</p>
                        <button className="flex items-center gap-2 text-emerald-600 font-black text-sm uppercase tracking-widest hover:gap-4 transition-all">
                            Learn More <ChevronRight size={18} />
                        </button>
                    </div>

                    <div className="bg-white p-8 rounded-[32px] shadow-xl border border-white hover:scale-105 transition-all shadow-emerald-900/5">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 font-bold shadow-sm">
                            <MessageCircle size={28} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Community Rules</h3>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">Our guide to keeping the community safe, respectful, and productive for everyone.</p>
                        <button className="flex items-center gap-2 text-blue-600 font-black text-sm uppercase tracking-widest hover:gap-4 transition-all">
                            Read Rules <ChevronRight size={18} />
                        </button>
                    </div>

                    <div className="bg-white p-8 rounded-[32px] shadow-xl border border-white hover:scale-105 transition-all">
                        <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 font-bold shadow-sm">
                            <FileText size={28} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Payments & Credits</h3>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">Understand how Time Credits are calculated, earned, and transferred safely.</p>
                        <button className="flex items-center gap-2 text-purple-600 font-black text-sm uppercase tracking-widest hover:gap-4 transition-all">
                            View Guide <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-black text-slate-900 mb-8 text-center tracking-tight">Frequent Questions</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 hover:border-emerald-200 transition-colors group">
                                <h4 className="font-black text-slate-900 mb-2 flex justify-between items-center tracking-tight">
                                    {faq.q}
                                    <ChevronRight size={20} className="text-slate-200 group-hover:text-emerald-500 transition-all group-hover:translate-x-1" />
                                </h4>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 bg-slate-900 rounded-[40px] p-12 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <HelpCircle size={200} className="text-white" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-3xl font-black text-white mb-4 tracking-tight">Still have questions?</h3>
                            <p className="text-slate-400 font-medium mb-8">Our support team is always here to help you solve any issues.</p>
                            <button className="px-10 py-4 bg-emerald-600 text-white rounded-[20px] font-black shadow-xl shadow-emerald-900/40 hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Help;
