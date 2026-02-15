import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api'; // Import our new bridge

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/users/login', { email, password });
      localStorage.setItem('token', data.token); // Save token like we did in Postman
      navigate('/dashboard'); // Send user to dashboard after login
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E6EEF2] p-4 font-sans">
      <div className="bg-white rounded-[40px] shadow-2xl flex flex-col md:flex-row max-w-5xl w-full overflow-hidden min-h-[600px]">
        {/* Left Side: Illustration */}
        <div className="md:w-1/2 bg-[#F8FAFC] p-12 flex flex-col justify-center items-center border-r border-slate-100">
           <img src="https://illustrations.popsy.co/gray/manager.svg" alt="Login Illustration" className="w-80 mb-8" />
           <p className="text-xl font-medium text-slate-500 text-center px-4">
             Collaborative work just got easier for community members!
           </p>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-1/2 p-12 lg:p-20 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-slate-800 mb-8">Log In</h2>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <button type="submit" className="w-full bg-[#2D3339] text-white p-4 rounded-xl font-bold hover:bg-black transition-all text-lg shadow-lg">
              Log In
            </button>
          </form>
          {/* ... rest of your friend's buttons ... */}
        </div>
      </div>
    </div>
  );
};

export default Login;