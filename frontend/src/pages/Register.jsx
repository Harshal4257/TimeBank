import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Register = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate(); 
  const roleFromUrl = searchParams.get('role') || 'Seeker';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: roleFromUrl, 
    skills: ''
  });

  useEffect(() => {
    setFormData(prev => ({ ...prev, role: roleFromUrl }));
  }, [roleFromUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // 1. Save data so the Dashboard knows who just logged in
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', formData.role);
        localStorage.setItem('userSkills', formData.skills); 
        localStorage.setItem('userEmail', formData.email);

        alert("Registration Successful!");

        // 2. Redirect to the Seeker/Poster dashboard
        navigate('/dashboard'); 
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Navigation error:", error);
      alert("Backend is not running. Check your terminal!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-[32px] shadow-xl border border-slate-100">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">Create Account</h2>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" />
          <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" />

          <select 
            name="role" 
            value={formData.role} 
            onChange={handleChange}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
          >
            <option value="Seeker">Seeker</option>
            <option value="Poster">Poster</option>
          </select>

          <input 
            type="text" 
            name="skills" 
            placeholder={formData.role === 'Poster' ? "Required Skills (e.g. Java, Python)" : "Your Skills (e.g. Java, Python)"} 
            onChange={handleChange}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" 
          />

          <button type="submit" className="w-full bg-emerald-500 text-white p-4 rounded-xl font-bold hover:bg-emerald-600 transition-all text-lg shadow-lg shadow-emerald-100">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;