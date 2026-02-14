import React from 'react';
import { UserCircle, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-slate-800 mb-2">Welcome to TimeBank</h1>
      <p className="text-slate-600 mb-12 text-lg">Choose how you want to use the platform</p>
      
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
        {/* Job Seeker Card */}
        <div onClick={() => navigate('/register?role=Seeker')} 
             className="flex-1 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:scale-105 transition-all cursor-pointer text-center">
          <div className="bg-emerald-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <UserCircle size={40} className="text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Job Seeker</h2>
          <p className="text-slate-500">I want to provide my skills and earn time credits.</p>
        </div>

        {/* Job Poster Card */}
        <div onClick={() => navigate('/register?role=Poster')} 
             className="flex-1 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:scale-105 transition-all cursor-pointer text-center">
          <div className="bg-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Briefcase size={40} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Job Poster</h2>
          <p className="text-slate-500">I have a task and want to offer time credits.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;