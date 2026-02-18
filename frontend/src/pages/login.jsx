import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send login request to Backend
      // The baseURL in api.js already includes '/api'
      const { data } = await API.post('/users/login', { email, password });

      // Save User Data to LocalStorage
      // Using ?. ensures that if 'skills' or 'role' is missing, it won't throw an error
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.user?.role || 'Seeker'); 
      localStorage.setItem('userSkills', JSON.stringify(data.user?.skills || []));
      localStorage.setItem('userEmail', data.user?.email);

      alert("Login Successful!");
      
      // Debug: Check what data we're getting
      console.log('Login response data:', data);
      console.log('User role:', data.user?.role);
      
      const userRole = data.user?.role || 'Seeker';
      console.log('Redirecting to:', userRole === 'Seeker' ? '/seeker-home' : '/poster/dashboard');
      
      if (userRole === 'Seeker') {
        navigate('/seeker-home');
      } else {
        navigate('/poster/dashboard');
      } 
    } catch (error) {
      // This will now show the actual error message from the backend if available
      const errorMessage = error.response?.data?.message || "Login failed. Check your connection or credentials.";
      alert(errorMessage);
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E6EEF2] p-4 font-sans">
      <div className="bg-white rounded-[40px] shadow-2xl flex flex-col md:flex-row max-w-5xl w-full overflow-hidden min-h-[600px]">
        
        {/* Left Side: Illustration */}
        <div className="md:w-1/2 bg-[#F8FAFC] p-12 flex flex-col justify-center items-center border-r border-slate-100">
          <img 
            src="https://illustrations.popsy.co/gray/manager.svg" 
            alt="Login Illustration" 
            className="w-80 mb-8" 
          />
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
            
            <button 
              type="submit" 
              className="w-full bg-[#2D3339] text-white p-4 rounded-xl font-bold hover:bg-black transition-all text-lg shadow-lg"
            >
              Log In
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500">
              Don't have an account? 
              <button 
                onClick={() => navigate('/register')} 
                className="text-emerald-600 font-bold ml-2 hover:underline"
              >
                Register
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;