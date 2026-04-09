import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User, MapPin, Settings, Edit, ArrowRight, X, Plus } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const base = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
  return `${base}${path}`;
};

const PosterProfile = () => {
  const { user, updateUser } = React.useContext(AuthContext);
  const skillInputRef = useRef(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [profileData, setProfileData] = useState({
    name: '', email: '', title: '', location: '',
    role: '', skills: [], bio: '', profilePicture: null
  });
  const [tempProfileData, setTempProfileData] = useState({ ...profileData });

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        const res = await API.get('/users/profile');
        const d = res.data;
        setProfileData({
          name: d.name || '',
          email: d.email || '',
          title: d.currentRole || '',
          location: d.location || '',
          role: d.role || '',
          skills: d.skills || [],
          bio: d.bio || '',
          profilePicture: d.avatarUrl || null
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };
    fetchProfile();
  }, [user]);

  const handleEditProfile = () => {
    setTempProfileData({ ...profileData });
    setShowEditForm(true);
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await API.put('/users/profile', {
        name: tempProfileData.name,
        bio: tempProfileData.bio,
        location: tempProfileData.location,
        currentRole: tempProfileData.title,
        skills: tempProfileData.skills,
      });
      setProfileData({ ...tempProfileData });
      setShowEditForm(false);
      // ✅ Update navbar name immediately
      updateUser({ name: tempProfileData.name });
      alert('Profile updated successfully!');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Unknown error';
      alert(`Failed to save profile: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('photo', file);
      const res = await API.post('/users/profile/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setTempProfileData(prev => ({ ...prev, profilePicture: res.data.avatarUrl }));
      setProfileData(prev => ({ ...prev, profilePicture: res.data.avatarUrl }));
      alert('Photo uploaded successfully!');
    } catch (err) {
      alert('Failed to upload photo.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-strong overflow-hidden animate-scale-in">

          {/* Banner */}
          <div className="relative h-48 bg-gradient-to-r from-primary-500 to-accent-500">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute left-8 bottom-4">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-strong overflow-hidden bg-secondary-100">
                {profileData.profilePicture ? (
                  <img src={getImageUrl(profileData.profilePicture)} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User size={36} className="text-secondary-400" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Left */}
              <div className="lg:col-span-1">
                <div className="mb-6">
                  <h1 className="text-2xl font-black text-secondary-900">{profileData.name || 'No Name'}</h1>
                  <p className="text-lg text-secondary-600">{profileData.title}</p>
                </div>
                <div className="flex items-center gap-2 mb-6 text-secondary-600">
                  <MapPin size={16} /><span>{profileData.location}</span>
                </div>
                <div className="flex flex-col gap-3">
                  <button onClick={handleEditProfile}
                    className="bg-secondary-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-secondary-900 transition-all flex items-center justify-center gap-2 w-full">
                    <Edit size={16} /> Edit Profile
                  </button>
                  <Link to="/settings"
                    className="border-2 border-secondary-300 text-secondary-700 px-6 py-3 rounded-xl font-semibold hover:bg-secondary-50 transition-all flex items-center justify-center gap-2 w-full">
                    <Settings size={16} /> Settings
                  </Link>
                </div>
              </div>

              {/* Middle */}
              <div className="lg:col-span-1">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-3">Current role</h3>
                  <p className="text-secondary-700 bg-secondary-50 rounded-xl px-4 py-3">{profileData.role}</p>
                </div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-700">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="lg:col-span-1">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-3">About</h3>
                  <p className="text-secondary-600 bg-secondary-50 rounded-xl px-4 py-3">{profileData.bio || 'No bio provided.'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom cards */}
          <div className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Ready for work', desc: "Show recruiters that you're ready for work." },
                { title: 'Share posts', desc: 'Share latest news to get connected with others.' },
                { title: 'Update', desc: 'Keep your profile updated so that recruiters know you better.' }
              ].map((card) => (
                <div key={card.title} className="card group cursor-pointer hover:scale-105 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-secondary-900 mb-1">{card.title}</h4>
                      <p className="text-sm text-secondary-600">{card.desc}</p>
                    </div>
                    <ArrowRight className="text-primary-600 group-hover:translate-x-1 transition-transform" size={20} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-secondary-900">Edit Profile</h2>
              <button onClick={() => setShowEditForm(false)} className="text-secondary-400 hover:text-secondary-600">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Full Name</label>
                <input type="text" value={tempProfileData.name}
                  onChange={(e) => setTempProfileData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your full name" />
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Professional Title</label>
                <input type="text" value={tempProfileData.title}
                  onChange={(e) => setTempProfileData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Software Engineer" />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Location</label>
                <input type="text" value={tempProfileData.location}
                  onChange={(e) => setTempProfileData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Pune, India" />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Skills</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tempProfileData.skills.map((skill, i) => (
                    <span key={i}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium cursor-pointer hover:bg-primary-200"
                      onClick={() => setTempProfileData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }))}>
                      {skill} <X size={12} className="inline ml-1" />
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input ref={skillInputRef} type="text" placeholder="Add new skill"
                    className="flex-1 px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        setTempProfileData(prev => ({ ...prev, skills: [...prev.skills, e.target.value.trim()] }));
                        e.target.value = '';
                      }
                    }} />
                  <button type="button" onClick={() => {
                    const input = skillInputRef.current;
                    if (input?.value.trim()) {
                      setTempProfileData(prev => ({ ...prev, skills: [...prev.skills, input.value.trim()] }));
                      input.value = '';
                    }
                  }} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Add</button>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">About</label>
                <textarea value={tempProfileData.bio}
                  onChange={(e) => setTempProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  rows={4} placeholder="Tell us about yourself..." />
              </div>

              {/* Profile Picture */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Profile Picture</label>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-full bg-secondary-100 flex items-center justify-center overflow-hidden">
                    {tempProfileData.profilePicture ? (
                      <img src={getImageUrl(tempProfileData.profilePicture)} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User size={32} className="text-secondary-400" />
                    )}
                  </div>
                  <label className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 cursor-pointer">
                    Upload Photo
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button onClick={() => setShowEditForm(false)}
                className="px-6 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50">Cancel</button>
              <button onClick={handleSaveProfile} disabled={saving}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PosterProfile;
