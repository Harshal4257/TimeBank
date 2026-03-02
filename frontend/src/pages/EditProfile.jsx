import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, User, MapPin, Tag, AlignLeft, Mail, Briefcase } from 'lucide-react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import SeekerNavbar from '../components/SeekerNavbar';

const EditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    currentRole: '',
    skills: '',
    bio: ''
  });

  useEffect(() => {
    const fetchCurrentData = async () => {
      try {
        const res = await API.get('/users/profile');
        const { name, email, location, currentRole, skills, bio } = res.data;
        setFormData({
          name: name || '',
          email: email || '',
          location: location || '',
          currentRole: currentRole || '',
          skills: skills && skills.length ? skills.join(', ') : '',
          bio: bio || ''
        });
      } catch (err) {
        console.error('Error fetching profile', err);
      }
    };
    fetchCurrentData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const skillsArray = formData.skills
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      const payload = {
        name: formData.name,
        location: formData.location,
        currentRole: formData.currentRole,
        skills: skillsArray,
        bio: formData.bio
      };
      await API.put('/users/profile', payload);
      alert('Profile updated! Your changes have been saved.');
      navigate('/seeker/profile');
    } catch (err) {
      console.error(err);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E6EEF2]">
      <SeekerNavbar />

      <div className="max-w-2xl mx-auto py-12 px-6">
        <button
          onClick={() => navigate('/seeker/profile')}
          className="flex items-center gap-2 text-slate-600 font-bold mb-8 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft size={20} /> Back to Profile
        </button>

        <div className="bg-white rounded-[32px] shadow-xl overflow-hidden border border-white">
          <div className="bg-slate-900 p-10 text-white">
            <h1 className="text-3xl font-black mb-2">Edit Profile</h1>
            <p className="text-slate-400 text-sm">Update your information; changes will be saved to your profile.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-6">
            <div>
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase mb-2">
                <User size={14} /> Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 outline-none font-bold"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase mb-2">
                <Mail size={14} /> Email
              </label>
              <input
                type="email"
                value={formData.email}
                readOnly
                className="w-full px-5 py-4 bg-slate-100 border border-slate-200 rounded-2xl text-slate-500 cursor-not-allowed"
              />
              <p className="text-xs text-slate-400 mt-1">Email cannot be changed.</p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase mb-2">
                <Briefcase size={14} /> Current role / Title
              </label>
              <input
                type="text"
                value={formData.currentRole}
                onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 outline-none font-bold"
                placeholder="e.g. Software Engineer"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase mb-2">
                <MapPin size={14} /> Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 outline-none font-bold"
                placeholder="e.g. Los Angeles, California"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase mb-2">
                <Tag size={14} /> Skills (comma separated)
              </label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 outline-none font-bold"
                placeholder="React, HTML, CSS, Python"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase mb-2">
                <AlignLeft size={14} /> Bio
              </label>
              <textarea
                rows="4"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 outline-none font-bold resize-none"
                placeholder="Tell recruiters about your experience and goals..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {loading ? 'Saving...' : <><Save size={20} /> Save Changes</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
