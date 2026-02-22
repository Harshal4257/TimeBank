import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Save, Briefcase, MapPin, DollarSign, AlignLeft, Tag, Clock } from 'lucide-react';
import API from '../services/api';

const PostJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    hourlyRate: '',
    location: '',
    category: '',
    requiredSkills: '', // Aligned with backend
    hours: '',          // Aligned with backend
    deadline: ''
  });
  
  const [loading, setLoading] = useState(false);

  // --- 1. PRE-FILL DATA IF EDITING ---
  useEffect(() => {
    if (isEditMode) {
      const fetchJobDetails = async () => {
        try {
          // Note: Check if your API baseURL already includes /api
          const res = await API.get(`/jobs/${id}`);
          const job = res.data;
          
          setFormData({
            title: job.title || '',
            description: job.description || '',
            hourlyRate: job.hourlyRate || '',
            location: job.location || '',
            category: job.category || '',
            requiredSkills: job.requiredSkills ? job.requiredSkills.join(', ') : '',
            hours: job.hours || '',
            deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : ''
          });
        } catch (err) {
          console.error("Error fetching job details:", err);
          alert("Could not load job data.");
        }
      };
      fetchJobDetails();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 2. SUBMIT LOGIC ---
 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  // We are creating an object that EXACTLY matches your 
  // backend destructuring: { title, description, requiredSkills, hourlyRate, category, hours }
  const processedData = {
    title: formData.title,
    description: formData.description,
    location: formData.location, // kept for your UI
    category: formData.category,
    hourlyRate: Number(formData.hourlyRate),
    hours: Number(formData.hours), 
    // This is the important one: renaming 'skills' to 'requiredSkills'
    requiredSkills: typeof formData.requiredSkills === 'string' 
      ? formData.requiredSkills.split(',').map(s => s.trim()) 
      : formData.requiredSkills
  };

 try {
  if (isEditMode) {
    await API.put(`/jobs/${id}`, processedData);
    alert("✅ Job updated successfully!");
  } else {
    await API.post('/jobs', processedData);
    alert("🚀 Job posted successfully!");
  }

  // CHANGE THIS LINE:
  navigate('/poster-dashboard'); 

} catch (err) {
    // This will print the EXACT reason the backend rejected it in your browser console
    console.error("Backend Error Details:", err.response?.data);
    const message = err.response?.data?.message || "Failed to save job details.";
    alert(`❌ ${message}`);
  } finally {
    setLoading(false);
  }
};
const handleDelete = async (id) => {
  try {
    // Ensure the path is /jobs/ID (assuming baseURL ends in /api)
    await API.delete(`/jobs/${id}`); 
    alert("Job deleted!");
    window.location.reload(); // Refresh the list
  } catch (err) {
    console.log(err.response);
    alert("Delete failed: " + (err.response?.data?.message || "Unknown error"));
  }
};
  return (
    <div className="min-h-screen bg-[#E6EEF2] py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-600 font-bold mb-8 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <div className="bg-white rounded-[32px] shadow-xl overflow-hidden border border-white">
          <div className="bg-slate-900 p-10 text-white">
            <h1 className="text-3xl font-black mb-2">
              {isEditMode ? "📝 Edit Listing" : "🚀 Post a New Job"}
            </h1>
            <p className="text-slate-400 font-medium text-sm">
              {isEditMode ? "Update your job details to attract the best applicants." : "Fill in the details below to reach thousands of seekers."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-6">
            {/* Job Title */}
            <div>
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                <Briefcase size={14} className="text-emerald-500" /> Job Title
              </label>
              <input 
                type="text" name="title" value={formData.title} onChange={handleChange} required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 outline-none transition-all font-bold text-slate-800"
                placeholder="e.g. Graphic Designer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hourly Rate */}
              <div>
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  <DollarSign size={14} className="text-emerald-500" /> Rate ($/hr)
                </label>
                <input 
                  type="number" name="hourlyRate" value={formData.hourlyRate} onChange={handleChange} required
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 outline-none font-bold text-slate-800"
                />
              </div>
              {/* Estimated Hours */}
              <div>
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  <Clock size={14} className="text-emerald-500" /> Total Hours
                </label>
                <input 
                  type="number" name="hours" value={formData.hours} onChange={handleChange} required
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 outline-none font-bold text-slate-800"
                  placeholder="e.g. 40"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Category */}
               <div>
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  <Tag size={14} className="text-emerald-500" /> Category
                </label>
                <input 
                  type="text" name="category" value={formData.category} onChange={handleChange} required
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 outline-none font-bold text-slate-800"
                  placeholder="e.g. Design"
                />
              </div>
              {/* Location */}
              <div>
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  <MapPin size={14} className="text-emerald-500" /> Location
                </label>
                <input 
                  type="text" name="location" value={formData.location} onChange={handleChange} required
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 outline-none font-bold text-slate-800"
                  placeholder="Remote / New York"
                />
              </div>
            </div>

            {/* Required Skills */}
            <div>
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                <Tag size={14} className="text-emerald-500" /> Required Skills (comma separated)
              </label>
              <input 
                type="text" name="requiredSkills" value={formData.requiredSkills} onChange={handleChange} required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 outline-none font-bold text-slate-800"
                placeholder="React, Tailwind, Photoshop"
              />
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                <AlignLeft size={14} className="text-emerald-500" /> Job Description
              </label>
              <textarea 
                name="description" value={formData.description} onChange={handleChange} required rows="4"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 outline-none font-bold text-slate-800 resize-none"
              ></textarea>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? "Saving..." : isEditMode ? <><Save size={20}/> Update Job</> : <><Send size={20}/> Publish Job</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;