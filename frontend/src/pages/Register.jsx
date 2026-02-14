import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const Register = () => {
  const [searchParams] = useSearchParams();
  const roleFromUrl = searchParams.get('role') || 'Seeker';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: roleFromUrl,
    skills: ''
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E6EEF2] p-4">
      <div className="bg-white rounded-[40px] shadow-2xl flex flex-col md:flex-row max-w-5xl w-full overflow-hidden">
        
        {/* Left Side: Branding */}
        <div className="md:w-1/2 bg-[#2D3339] p-12 text-white flex flex-col justify-center">
          <h2 className="text-4xl font-bold mb-6">Join the Community.</h2>
          <p className="text-slate-400 text-lg">
            {formData.role === 'Poster' 
              ? "Start posting tasks and find the best talent in the network." 
              : "Showcase your skills and earn time credits by helping others."}
          </p>
          <img src="https://illustrations.popsy.co/white/creative-work.svg" alt="Register" className="mt-8 w-64 self-center" />
        </div>

        {/* Right Side: Form */}
        <div className="md:w-1/2 p-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Create Account</h2>
          <p className="text-slate-500 mb-8">Registering as a <span className="text-emerald-600 font-bold">{formData.role}</span></p>
          
          <form className="space-y-4">
            <input type="text" placeholder="Full Name" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
            <input type="email" placeholder="Email Address" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
            <input type="password" placeholder="Password" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
            
            {/* Conditional Skills Input for Seekers */}
            {formData.role === 'Seeker' && (
              <textarea 
                placeholder="Your Skills (e.g. React, Python, Writing - separate with commas)" 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none h-24"
              />
            )}

            <button className="w-full bg-emerald-500 text-white p-4 rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200 mt-4">
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-slate-500 text-sm">
            Already have an account? <Link to="/login" className="text-emerald-600 font-bold">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;