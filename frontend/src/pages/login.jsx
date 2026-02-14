import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E6EEF2] p-4 font-sans">
      <div className="bg-white rounded-[40px] shadow-2xl flex flex-col md:flex-row max-w-5xl w-full overflow-hidden min-h-[600px]">
        
        {/* Left Side: Illustration (Matches the Pepper image) */}
        <div className="md:w-1/2 bg-[#F8FAFC] p-12 flex flex-col justify-center items-center border-r border-slate-100">
           <img src="https://illustrations.popsy.co/gray/manager.svg" alt="Login Illustration" className="w-80 mb-8" />
           <p className="text-xl font-medium text-slate-500 text-center px-4">
             Collaborative work just got easier for community members!
           </p>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-1/2 p-12 lg:p-20 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg"></div>
            <span className="text-xl font-bold text-slate-800 uppercase tracking-widest">TimeBank</span>
          </div>

          <h2 className="text-4xl font-bold text-slate-800 mb-8">Log In</h2>
          
          <form className="space-y-6">
            <input type="text" placeholder="User name" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <input type="password" placeholder="Password" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <input type="text" placeholder="Entity code (Optional)" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            
            <div className="flex justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-400"><input type="checkbox" className="accent-emerald-500" /> Keep me signed in</label>
              <Link to="#" className="text-emerald-600 font-medium">Forgot password?</Link>
            </div>

            <button className="w-full bg-[#2D3339] text-white p-4 rounded-xl font-bold hover:bg-black transition-all text-lg shadow-lg">Log In</button>
          </form>

          <div className="mt-8 flex items-center gap-4 text-slate-300">
            <div className="h-[1px] bg-slate-200 flex-1"></div> <span>or</span> <div className="h-[1px] bg-slate-200 flex-1"></div>
          </div>

          <button className="mt-8 w-full border border-slate-200 p-4 rounded-xl font-medium flex items-center justify-center gap-3 hover:bg-slate-50 transition-all">
            <img src="https://www.svgrepo.com/show/475656/google.svg" className="w-5" alt="google" />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;