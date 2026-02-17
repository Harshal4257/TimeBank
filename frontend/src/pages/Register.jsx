import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api'; 

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Seeker', 
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    // Dynamically update the state based on input 'name' attribute
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // The baseURL in api.js is 'http://localhost:5000/api'
      // So we only need '/users/register' here
      const { data } = await API.post('/users/register', formData);

      alert("Registration Successful!");
      navigate('/login'); 
    } catch (error) {
      // This will capture specific error messages from your backend
      const errorMessage = error.response?.data?.message || "Registration failed. Check your connection!";
      alert(errorMessage);
      console.error("Registration Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E6EEF2] p-4 font-sans">
      <div className="bg-white rounded-[40px] shadow-2xl flex flex-col md:flex-row max-w-5xl w-full overflow-hidden min-h-[600px]">
        
        {/* Left Side: Form */}
        <div className="md:w-1/2 p-12 lg:p-20 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-slate-800 mb-8">Register</h2>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input 
              name="name"
              type="text" 
              placeholder="Full Name" 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input 
              name="email"
              type="email" 
              placeholder="Email" 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input 
              name="password"
              type="password" 
              placeholder="Password" 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={formData.password}
              onChange={handleChange}
              required
            />
            
            <select 
              name="role"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="Seeker">Seeker</option>
              <option value="Provider">Provider</option>
            </select>

            <button 
              type="submit" 
              className="w-full bg-[#2D3339] text-white p-4 rounded-xl font-bold hover:bg-black transition-all text-lg shadow-lg"
            >
              Register
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500">
              Already have an account? 
              <button 
                onClick={() => navigate('/login')} 
                className="text-emerald-600 font-bold ml-2 hover:underline"
              >
                Log In
              </button>
            </p>
          </div>
        </div>

        {/* Right Side: Illustration */}
        <div className="md:w-1/2 bg-[#F8FAFC] p-12 flex flex-col justify-center items-center border-l border-slate-100">
          <img 
            src="https://illustrations.popsy.co/gray/work-from-home.svg" 
            alt="Register Illustration" 
            className="w-80 mb-8" 
          />
        </div>
      </div>
    </div>
  );
};

export default Register;