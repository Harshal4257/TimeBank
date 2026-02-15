import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'Seeker', skills: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sending skills as an array since your model likely expects that
      const dataToSend = { ...formData, skills: formData.skills.split(',') };
      await API.post('/users/register', dataToSend);
      alert("Registration Successful! Please login.");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Create Account</h2>
        
        <input type="text" placeholder="Full Name" className="w-full p-3 mb-4 border rounded-xl" 
          onChange={(e) => setFormData({...formData, name: e.target.value})} required />
        
        <input type="email" placeholder="Email Address" className="w-full p-3 mb-4 border rounded-xl" 
          onChange={(e) => setFormData({...formData, email: e.target.value})} required />
        
        <input type="password" placeholder="Password" className="w-full p-3 mb-4 border rounded-xl" 
          onChange={(e) => setFormData({...formData, password: e.target.value})} required />

        <select className="w-full p-3 mb-4 border rounded-xl bg-white" 
          onChange={(e) => setFormData({...formData, role: e.target.value})}>
          <option value="Seeker">Seeker (I want to learn)</option>
          <option value="Poster">Poster (I want to teach)</option>
        </select>

        <input type="text" placeholder="Skills (comma separated: Java, Python)" className="w-full p-3 mb-6 border rounded-xl" 
          onChange={(e) => setFormData({...formData, skills: e.target.value})} />

        <button className="w-full bg-emerald-500 text-white py-3 rounded-xl font-bold hover:bg-emerald-600 transition-all">
          Sign Up
        </button>
        
        <p className="mt-4 text-center text-slate-500 text-sm">
          Already have an account? <Link to="/login" className="text-emerald-600 font-bold">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;