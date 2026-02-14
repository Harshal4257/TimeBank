import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E6EEF2] p-4">
      <div className="bg-white rounded-[40px] shadow-2xl flex flex-col md:flex-row max-w-5xl w-full overflow-hidden">
        
        {/* Left Side: Illustration */}
        <div className="md:w-1/2 bg-[#F8FAFC] p-12 flex flex-col justify-center items-center border-r border-slate-100">
           <img src="https://illustrations.popsy.co/gray/manager.svg" alt="Login Illustration" className="w-80 mb-8" />
           <p className="text-xl font-medium text-slate-700 text-center">Collaborative work just got easier with TimeBank!</p>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-1/2 p-12 lg:p-20">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 bg-emerald-500 rounded-full"></div>
            <span className="text-xl font-bold text-slate-800 uppercase tracking-widest">TimeBank</span>
          </div>

          <h2 className="text-3xl font-bold text-slate-800 mb-8">Log In</h2>
          
          <form className="space-y-6">
            <input type="email" placeholder="Email" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <input type="password" placeholder="Password" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            
            <div className="flex justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-500"><input type="checkbox" /> Keep me signed in</label>
              <Link to="#" className="text-emerald-600 font-medium">Forgot password?</Link>
            </div>

            <button className="w-full bg-[#2D3339] text-white p-4 rounded-xl font-bold hover:bg-black transition-colors">Log In</button>
          </form>

          <p className="mt-8 text-center text-slate-500">
            Don't have an account? <Link to="/register" className="text-emerald-600 font-bold">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;