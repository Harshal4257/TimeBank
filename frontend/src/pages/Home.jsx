import React from 'react';
import { Search, Users, Laptop } from 'lucide-react';

const Home = () => {
  return (
    <div className="bg-[#F4F9F8] min-h-screen">
      {/* Hero Section - Matches Civi Style */}
      <section className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2">
          <h1 className="text-6xl font-extrabold text-slate-900 leading-tight mb-6">
            Got Talent? <br />
            <span className="text-emerald-600">Meet Opportunity</span>
          </h1>
          <p className="text-slate-500 text-xl mb-10">Community reviews. Salaries. Interviews. Jobs.</p>
          
          {/* Search Bar - Matches Civi Style */}
          <div className="bg-white p-2 rounded-full shadow-xl flex items-center max-w-xl border border-slate-100">
            <Search className="ml-4 text-slate-400" />
            <input type="text" placeholder="Job title or keywords" className="flex-1 p-4 outline-none rounded-full" />
            <button className="bg-emerald-600 text-white px-10 py-4 rounded-full font-bold hover:bg-emerald-700 transition-all">
              Search
            </button>
          </div>
        </div>

        <div className="md:w-1/2 mt-16 md:mt-0 relative flex justify-center">
           <img src="https://illustrations.popsy.co/emerald/web-design.svg" alt="Hero" className="w-full max-w-lg" />
           {/* Floating Badge (Matches Civi Image) */}
           <div className="absolute top-10 right-0 bg-white p-4 rounded-2xl shadow-lg border border-slate-50 flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-full"><Users size={20} className="text-orange-500" /></div>
              <p className="text-sm font-bold text-slate-700">5k+ candidates got jobs</p>
           </div>
        </div>
      </section>

      {/* Category Section - Matches Civi Layout */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">Popular categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {['Development & IT', 'Marketing & Sales', 'Design & Creative', 'Customer Service'].map((cat) => (
              <div key={cat} className="p-8 border border-slate-100 rounded-3xl hover:shadow-xl hover:border-emerald-200 transition-all cursor-pointer group">
                <div className="bg-slate-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                  <Laptop size={24} />
                </div>
                <h3 className="font-bold text-lg text-slate-800">{cat}</h3>
                <p className="text-slate-400 text-sm mt-2">16+ jobs available</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;