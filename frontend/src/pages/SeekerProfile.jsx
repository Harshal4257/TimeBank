import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User, MapPin, Briefcase, Settings, Edit, ArrowRight, Share, Plus, X, Camera } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const SeekerProfile = () => {
  const { user } = React.useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const skillInputRef = useRef(null);
  
  // Debug: Log user data to see what we're getting
  console.log('SeekerProfile - User data:', user);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    title: '',
    location: '',
    role: '',
    skills: [],
    bio: '',
    readyForWork: true,
    profilePicture: null
  });

  const [tempProfileData, setTempProfileData] = useState({ ...profileData });

  useEffect(() => {
    if (!user) {
      console.log('SeekerProfile - No user data available');
      return;
    }

    // Set minimal profile Data from AuthContext first for instant UI response
    setProfileData(prev => ({
      ...prev,
      name: user.name || localStorage.getItem('name') || prev.name,
      email: user.email || localStorage.getItem('email') || prev.email,
      skills: user.skills && user.skills.length > 0 ? user.skills : prev.skills
    }));

    // Perform an asynchronous DB fetch to ensure absolute newest fields
    const fetchUserProfile = async () => {
      try {
        // Cache-busting URL parameter prevents browser from sticking to old, empty profile data during SPA navigation
        const response = await API.get(`/users/profile?_t=${new Date().getTime()}`);
        const dbData = response.data;
        
        // Use dbData exclusively over previous fields, as DB is single source of truth!
        setProfileData(prev => ({
          ...prev,
          name: dbData.name || prev.name,
          email: dbData.email || prev.email,
          title: dbData.currentRole || prev.title,
          location: dbData.location || prev.location,
          role: dbData.role || prev.role,
          skills: dbData.skills || prev.skills, // Use exact skills array mapping
          bio: dbData.bio || prev.bio,
          profilePicture: dbData.avatarUrl || prev.profilePicture
        }));
      } catch (error) {
        console.error('SeekerProfile - Error fetching fresh user profile:', error);
      }
    };
    
    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleEditProfile = () => {
    setTempProfileData({ ...profileData });
    setShowEditForm(true);
  };

  const handleSaveProfile = async () => {
    try {
        await API.put('/users/profile', {
            name: tempProfileData.name,
            bio: tempProfileData.bio,
            location: tempProfileData.location,
            currentRole: tempProfileData.title,
            skills: tempProfileData.skills,
        });
        setProfileData({ ...tempProfileData });
        setShowEditForm(false);
        alert('Profile updated successfully!');
    } catch (error) {
        console.error('Error saving profile:', error);
        alert('Failed to save profile. Please try again.');
    }
};

  const handleCancelEdit = () => {
    setTempProfileData({ ...profileData });
    setShowEditForm(false);
  };

  // ✅ Fix — uploads to backend
const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
        const formData = new FormData();
        formData.append('photo', file);
        const res = await API.post('/users/profile/photo', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        setTempProfileData(prev => ({ 
            ...prev, 
            profilePicture: res.data.avatarUrl 
        }));
        alert('Photo uploaded successfully!');
    } catch (error) {
        console.error('Error uploading photo:', error);
        alert('Failed to upload photo.');
    }
};

  const handleSkillToggle = (skill) => {
    if (isEditing) {
      setTempProfileData(prev => ({
        ...prev,
        skills: prev.skills.includes(skill)
          ? prev.skills.filter(s => s !== skill)
          : [...prev.skills, skill]
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
      
      <div className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Horizontal Profile Card */}
        <div className="bg-white rounded-3xl shadow-strong overflow-hidden animate-scale-in">
          
          {/* Banner and Profile Picture Section */}
          <div className="relative h-48 bg-gradient-to-r from-primary-500 to-accent-500">
            <div className="absolute inset-0 bg-black/20"></div>
            {/* Banner Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="h-full w-full bg-repeat" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M30 5l25 25v10l-25-25V5z' fill='white' fill-opacity='0.1'/%3E%3Cpath d='M5 30l25-25v10l-25 25V30z' fill='white' fill-opacity='0.1'/%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px'
              }}></div>
            </div>
            
            {/* Profile Picture */}
            <div className="absolute left-8 bottom-4">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-strong overflow-hidden bg-secondary-100">
                  {profileData.profilePicture ? (
                    <img 
                      src={profileData.profilePicture} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={36} className="text-secondary-400" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content - Horizontal Layout */}
          <div className="px-6 pb-6 pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Section - Basic Info */}
              <div className="lg:col-span-1">
                <div className="mb-6">
                  <h1 className="text-2xl font-black text-secondary-900">
                    {user?.name || localStorage.getItem('name') || profileData.name || 'No Name'}
                  </h1>
                  <p className="text-lg text-secondary-600">{profileData.title}</p>
                </div>

                <div className="flex items-center gap-2 mb-6 text-secondary-600">
                  <MapPin size={16} />
                  <span>{profileData.location}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleEditProfile}
                    className="bg-secondary-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-secondary-900 transition-all flex items-center justify-center gap-2 w-full"
                  >
                    <Edit size={16} /> Edit Profile
                  </button>
                  <Link
                    to="/settings"
                    className="border-2 border-secondary-300 text-secondary-700 px-6 py-3 rounded-xl font-semibold hover:bg-secondary-50 transition-all flex items-center justify-center gap-2 w-full"
                  >
                    <Settings size={16} /> Settings
                  </Link>
                </div>
              </div>

              {/* Middle Section - Role and Skills */}
              <div className="lg:col-span-1">
                {/* Current Role */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-3">Current role</h3>
                  <p className="text-secondary-700 bg-secondary-50 rounded-xl px-4 py-3">{profileData.role}</p>
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Section - Bio Only */}
              <div className="lg:col-span-1">
                {/* Bio */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-3">About</h3>
                  <p className="text-secondary-600 bg-secondary-50 rounded-xl px-4 py-3">{profileData.bio}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Cards at Bottom */}
          <div className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card group cursor-pointer hover:scale-105 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-secondary-900 mb-1">Ready for work</h4>
                    <p className="text-sm text-secondary-600">Show recruiters that you're ready for work.</p>
                  </div>
                  <ArrowRight className="text-primary-600 group-hover:translate-x-1 transition-transform" size={20} />
                </div>
              </div>

              <div className="card group cursor-pointer hover:scale-105 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-secondary-900 mb-1">Share posts</h4>
                    <p className="text-sm text-secondary-600">Share latest news to get connected with others.</p>
                  </div>
                  <ArrowRight className="text-primary-600 group-hover:translate-x-1 transition-transform" size={20} />
                </div>
              </div>

              <div className="card group cursor-pointer hover:scale-105 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-secondary-900 mb-1">Update</h4>
                    <p className="text-sm text-secondary-600">Keep your profile updated so that recruiters know you better.</p>
                  </div>
                  <ArrowRight className="text-primary-600 group-hover:translate-x-1 transition-transform" size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Form Modal */}
        {showEditForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-secondary-900">Edit Profile</h2>
                <button
                  onClick={handleCancelEdit}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={tempProfileData.name}
                    onChange={(e) => setTempProfileData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={tempProfileData.email}
                    onChange={(e) => setTempProfileData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Professional Title</label>
                  <input
                    type="text"
                    value={tempProfileData.title}
                    onChange={(e) => setTempProfileData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Software Engineer"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={tempProfileData.location}
                    onChange={(e) => setTempProfileData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Los Angeles, California"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Current Role</label>
                  <input
                    type="text"
                    value={tempProfileData.role}
                    onChange={(e) => setTempProfileData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Software Engineer"
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Skills</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tempProfileData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium cursor-pointer hover:bg-primary-200"
                        onClick={() => {
                          setTempProfileData(prev => ({
                            ...prev,
                            skills: prev.skills.filter(s => s !== skill)
                          }));
                        }}
                      >
                        {skill} <X size={12} className="inline ml-1" />
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      ref={skillInputRef}
                      type="text"
                      placeholder="Add new skill"
                      className="flex-1 px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          setTempProfileData(prev => ({
                            ...prev,
                            skills: [...prev.skills, e.target.value.trim()]
                          }));
                          e.target.value = '';
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = skillInputRef.current;
                        if (input && input.value.trim()) {
                          setTempProfileData(prev => ({
                            ...prev,
                            skills: [...prev.skills, input.value.trim()]
                          }));
                          input.value = '';
                        }
                      }}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">About</label>
                  <textarea
                    value={tempProfileData.bio}
                    onChange={(e) => setTempProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    rows={4}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Profile Picture */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Profile Picture</label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-full bg-secondary-100 flex items-center justify-center">
                      {tempProfileData.profilePicture ? (
                        <img src={tempProfileData.profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <User size={32} className="text-secondary-400" />
                      )}
                    </div>
                    <label className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 cursor-pointer">
                      Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={handleCancelEdit}
                  className="px-6 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeekerProfile;
