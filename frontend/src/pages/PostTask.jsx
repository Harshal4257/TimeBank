import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const PostTask = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Programming',
    hours: 1,
    requiredSkills: '', // New field for Matching Algorithm
    hourlyRate: 1       // New field required by Job model
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Process skills: Convert comma-separated string into an array
      const submissionData = {
        ...formData,
        requiredSkills: formData.requiredSkills.split(',').map(skill => skill.trim())
      };

      // 2. Change endpoint to /jobs
      await API.post('/jobs', submissionData);
      
      alert("Task posted successfully!");
      navigate('/poster/dashboard'); // Updated to your poster dashboard path
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post task. Check required fields.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-lg border border-slate-100">
        <h2 className="text-3xl font-bold text-slate-800 mb-6">Post a New Task</h2>
        
        {error && <p className="text-red-500 mb-4 bg-red-50 p-3 rounded-lg">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Task Title</label>
            <input 
              type="text" 
              placeholder="e.g., Help with Python Script"
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Description</label>
            <textarea 
              placeholder="Describe what you need help with..."
              className="w-full p-3 border border-slate-200 rounded-xl h-24 focus:ring-2 focus:ring-emerald-500 outline-none"
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required 
            />
          </div>

          {/* NEW: Required Skills Input Field */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Required Skills (Comma separated)</label>
            <input 
              type="text" 
              placeholder="e.g., Python, React, SQL"
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              onChange={(e) => setFormData({...formData, requiredSkills: e.target.value})}
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Category</label>
              <select 
                className="w-full p-3 border border-slate-200 rounded-xl bg-white"
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Programming">Programming</option>
                <option value="Data Analytics">Data Analytics</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Hours (Credits)</label>
              <input 
                type="number" 
                min="1"
                value={formData.hours}
                className="w-full p-3 border border-slate-200 rounded-xl"
                onChange={(e) => setFormData({...formData, hours: e.target.value})}
                required 
              />
            </div>
          </div>

          {/* NEW: Hourly Rate Input Field */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Hourly Rate (Credits/Hour)</label>
            <input 
              type="number" 
              min="1"
              value={formData.hourlyRate}
              className="w-full p-3 border border-slate-200 rounded-xl"
              onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
              required 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-600 transform hover:scale-[1.02] transition-all shadow-lg shadow-emerald-200"
          >
            Post Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostTask;