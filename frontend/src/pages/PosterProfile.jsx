import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, MapPin, Briefcase, Settings, Edit, ArrowRight, Share, Plus, X, Camera, Building, Users, TrendingUp } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const PosterProfile = () => {
  const { user } = React.useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  
  // Debug: Log user data to see what we're getting
  console.log('PosterProfile - User data:', user);
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    title: 'Software Engineer',
    location: 'Los Angeles, California',
    role: 'Software Engineer',
    skills: ['HTML', 'CSS', 'Dart', 'C++', 'UI Design'],
    bio: 'Passionate software engineer with 5+ years of experience in web development and mobile applications.',
    readyForWork: true,
    profilePicture: null
  });

  const [tempProfileData, setTempProfileData] = useState({ ...profileData });

  useEffect(() => {
    // Load user data from context or API
    console.log('PosterProfile - useEffect triggered, user:', user);
    
    // Also check localStorage directly as a fallback
    const storedName = localStorage.getItem('name');
    const storedEmail = localStorage.getItem('email');
    const storedProfile = localStorage.getItem('posterProfile'); // Use poster-specific key
    
    console.log('PosterProfile - localStorage data:', { storedName, storedEmail, storedProfile });
    
    if (user) {
      // Try to load saved profile from localStorage first
      let profileToUse = { ...profileData };
      
      if (storedProfile) {
        try {
          const savedProfile = JSON.parse(storedProfile);
          profileToUse = { ...profileToUse, ...savedProfile };
          console.log('PosterProfile - Using saved profile from localStorage:', savedProfile);
        } catch (error) {
          console.log('PosterProfile - Error parsing saved profile:', error);
        }
      }
      
      // Always use name directly as display name, fallback to email if name not available
      const displayName = user.name || storedName || user.email || storedEmail || 'No Name';
      console.log('PosterProfile - displayName:', displayName);
      
      const finalSkills = user?.skills || profileToUse.skills || ['HTML', 'CSS', 'Dart', 'C++', 'UI Design'];
      console.log('PosterProfile - user.skills:', user?.skills);
      console.log('PosterProfile - finalSkills:', finalSkills);
      console.log('PosterProfile - FORCING logged-in user skills, ignoring database data');
      
      setProfileData(prev => ({
        ...profileToUse,
        name: displayName,
        email: user.email || storedEmail || profileToUse.email || '',
        title: user.title || profileToUse.title || 'Software Engineer',
        location: user.location || profileToUse.location || 'Los Angeles, California',
        role: user.role || profileToUse.role || 'Software Engineer',
        skills: finalSkills,
        bio: user.bio || profileToUse.bio || 'Passionate software engineer with 5+ years of experience in web development and mobile applications.'
      }));
    } else {
      console.log('PosterProfile - No user data available');
    }
  }, [user]);

  const handleEditProfile = () => {
    setTempProfileData({ ...profileData });
    setShowEditForm(true);
  };

  const handleSaveProfile = () => {
    // Update local state
    setProfileData({ ...tempProfileData });
    setShowEditForm(false);
    
    // Save to poster-specific localStorage key
    localStorage.setItem('posterProfile', JSON.stringify(tempProfileData));
    
    // TODO: Save to backend API
    console.log('PosterProfile - Profile saved:', tempProfileData);
  };

  const handleCancelEdit = () => {
    setTempProfileData({ ...profileData });
    setShowEditForm(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempProfileData(prev => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
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
                
                {/* Camera Overlay */}
                {isEditing && (
                  <label className="absolute inset-0 w-24 h-24 rounded-full bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors">
                    <Camera size={20} className="text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content - Horizontal Layout */}
          <div className="px-6 pb-6 pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Section - Basic Info */}
              <div className="lg:col-span-1">
                <div className="mb-6">
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempProfileData.name}
                      onChange={(e) => setTempProfileData(prev => ({ ...prev, name: e.target.value }))}
                      className="text-2xl font-black bg-transparent border-b-2 border-secondary-300 focus:border-primary-500 outline-none px-2 py-1 mb-2 w-full"
                    />
                  ) : (
                    <h1 className="text-2xl font-black text-secondary-900">
                      {user?.name || localStorage.getItem('name') || profileData.name || 'No Name'}
                    </h1>
                  )}
                  
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempProfileData.title}
                      onChange={(e) => setTempProfileData(prev => ({ ...prev, title: e.target.value }))}
                      className="text-lg bg-transparent border-b-2 border-secondary-300 focus:border-primary-500 outline-none px-2 py-1 w-full"
                    />
                  ) : (
                    <p className="text-lg text-secondary-600">{profileData.title}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-6 text-secondary-600">
                  <MapPin size={16} />
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempProfileData.location}
                      onChange={(e) => setTempProfileData(prev => ({ ...prev, location: e.target.value }))}
                      className="bg-transparent border-b border-secondary-300 focus:border-primary-500 outline-none px-2 py-1 flex-1"
                    />
                  ) : (
                    <span>{profileData.location}</span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSaveProfile}
                        className="btn-primary flex items-center justify-center gap-2 w-full"
                      >
                        Save Profile
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="btn-secondary flex items-center justify-center gap-2 w-full"
                      >
                        <X size={16} /> Cancel
                      </button>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </div>

              {/* Middle Section - Role and Skills */}
              <div className="lg:col-span-1">
                {/* Current Role */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-3">Current role</h3>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempProfileData.role}
                      onChange={(e) => setTempProfileData(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full bg-secondary-50 border border-secondary-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  ) : (
                    <p className="text-secondary-700 bg-secondary-50 rounded-xl px-4 py-3">{profileData.role}</p>
                  )}
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {(isEditing ? tempProfileData.skills : profileData.skills).map((skill, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          isEditing 
                            ? 'bg-primary-100 text-primary-700 hover:bg-primary-200 cursor-pointer' 
                            : 'bg-secondary-100 text-secondary-700'
                        }`}
                        onClick={() => isEditing && handleSkillToggle(skill)}
                      >
                        {skill}
                        {isEditing && (
                          <X size={12} className="ml-1" />
                        )}
                      </span>
                    ))}
                    
                    {isEditing && (
                      <button
                        onClick={() => {
                          const newSkill = prompt('Add new skill:');
                          if (newSkill && newSkill.trim()) {
                            setTempProfileData(prev => ({
                              ...prev,
                              skills: [...prev.skills, newSkill.trim()]
                            }));
                          }
                        }}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-primary-600 text-white hover:bg-primary-700 transition-all flex items-center gap-1"
                      >
                        <Plus size={12} /> Add Skill
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Section - Bio Only */}
              <div className="lg:col-span-1">
                {/* Bio */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-3">About</h3>
                  {isEditing ? (
                    <textarea
                      value={tempProfileData.bio}
                      onChange={(e) => setTempProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      className="w-full bg-secondary-50 border border-secondary-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                      rows={4}
                    />
                  ) : (
                    <p className="text-secondary-600 bg-secondary-50 rounded-xl px-4 py-3">{profileData.bio}</p>
                  )}
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
      </div>
    </div>
  );
};

export default PosterProfile;
