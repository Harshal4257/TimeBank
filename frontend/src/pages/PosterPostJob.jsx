import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, IndianRupee, Calendar, Clock, ArrowLeft } from 'lucide-react';
import API from '../services/api';

const PosterPostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    hourlyRate: '',
    totalHours: '',
    deadline: '',
    skills: [],
    category: 'Technology'
  });
  const [skillInput, setSkillInput] = useState('');

  const categories = [
    'Technology',
    'Design',
    'Marketing',
    'Writing',
    'Business',
    'Education',
    'Healthcare',
    'Customer Service',
    'Data Entry',
    'Sales',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.hourlyRate ||
      !formData.totalHours || !formData.deadline || formData.skills.length === 0) {
      alert('Please fill in all required fields and add at least one skill');
      return;
    }

    try {
      setLoading(true);

      const jobData = {
        title: formData.title,
        description: formData.description,
        location: 'Remote',         // ✅ hardcoded as Remote
        workLocation: 'Remote',     // ✅ hardcoded as Remote
        category: formData.category,
        hourlyRate: parseFloat(formData.hourlyRate),
        hours: parseInt(formData.totalHours),
        requiredSkills: formData.skills,
        deadline: new Date(formData.deadline).toISOString(),
        status: 'active'
      };

      await API.post('/jobs', jobData);
      alert('Job posted successfully!');
      navigate('/poster/dashboard');

    } catch (error) {
      console.error('Error posting job:', error);
      alert('Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E6EEF2]">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/poster/dashboard')}
              className="flex items-center gap-2 text-slate-600 hover:text-emerald-600"
            >
              <ArrowLeft size={20} />
              Back to Dashboard
            </button>
            <h1 className="text-xl font-bold text-slate-900">Post New Job</h1>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Job Title */}
            <div>
              <label className="block text-slate-700 font-medium mb-2">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Senior React Developer"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-slate-700 font-medium mb-2">
                Job Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the job responsibilities, requirements, and what the candidate will do..."
                rows={6}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-slate-700 font-medium mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Hourly Rate + Total Hours */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Hourly Rate — ₹ */}
              <div>
                <label className="block text-slate-700 font-medium mb-2">
                  <IndianRupee size={18} className="inline mr-2" />
                  Hourly Rate (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                  <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    placeholder="500"
                    min="1"
                    step="1"
                    className="w-full p-4 pl-8 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              {/* Total Hours */}
              <div>
                <label className="block text-slate-700 font-medium mb-2">
                  <Clock size={18} className="inline mr-2" />
                  Total Hours Required <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="totalHours"
                  value={formData.totalHours}
                  onChange={handleChange}
                  placeholder="10"
                  min="1"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            {/* Remote Badge */}
            <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🌐</span>
              </div>
              <div>
                <p className="text-emerald-800 font-bold text-sm">Remote Only</p>
                <p className="text-emerald-600 text-xs">All TimeBank jobs are 100% remote — work from anywhere!</p>
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-slate-700 font-medium mb-2">
                <Calendar size={18} className="inline mr-2" />
                Application Deadline <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            {/* Skills Section */}
            <div>
              <label className="block text-slate-700 font-medium mb-2">
                Required Skills <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Add a skill (e.g., JavaScript, React, Python)"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-emerald-500 hover:text-emerald-700"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {formData.skills.length === 0 && (
                <p className="text-slate-500 text-sm">Add at least one required skill</p>
              )}
            </div>

            {/* Total Pay Preview */}
            {formData.hourlyRate && formData.totalHours && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Total Pay to Seeker</span>
                    <span className="text-emerald-600 font-black text-xl">
                        ₹{(parseFloat(formData.hourlyRate) * parseInt(formData.totalHours)).toLocaleString('en-IN')}
                    </span>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/poster/dashboard')}
                className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Posting Job...
                  </div>
                ) : 'Post Job'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PosterPostJob;