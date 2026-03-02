import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, MapPin, Edit, Briefcase, Award, Settings, Pencil, RefreshCw, Share2, Upload, Camera } from 'lucide-react';
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import SeekerNavbar from '../components/SeekerNavbar';

const SeekerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/users/profile');
        setProfile(res.data);
      } catch (err) {
        console.error('Error fetching profile', err);
      }
    };
    fetchProfile();
  }, []);

  const handlePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);
    setUploading(true);
    try {
      const res = await API.post('/users/profile/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const { avatarUrl } = res.data;
      setProfile((prev) => prev ? { ...prev, avatarUrl } : prev);
    } catch (err) {
      console.error('Error uploading profile photo', err);
      const serverMessage = err.response?.data?.message;
      const status = err.response?.status;
      alert(serverMessage ? `Failed to upload photo (${status}): ${serverMessage}` : 'Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
      // reset value so selecting the same file again still triggers change
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (!profile) return (
    <div className="min-h-screen bg-[#E6EEF2]">
      <SeekerNavbar />
      <div className="p-10 text-center">Loading Profile...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#E6EEF2]">
      <SeekerNavbar />

      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-white">
          {/* Gradient Banner */}
          <div className="h-40 relative bg-gradient-to-r from-orange-400 via-pink-400 to-emerald-400">
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-slate-600"
              aria-label="Edit banner"
            >
              <Pencil size={18} />
            </button>
          </div>

          <div className="px-8 pb-8 relative">
            {/* Profile picture overlapping banner */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-16 relative z-10">
              <div className="relative w-28 h-28 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center overflow-hidden shadow-lg shrink-0">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl.startsWith('http') ? profile.avatarUrl : `http://localhost:5000${profile.avatarUrl}`}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={56} className="text-slate-400" />
                )}
                <button
                  type="button"
                  onClick={handlePhotoClick}
                  className="absolute bottom-1 right-1 p-1.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-md"
                  title="Change profile photo"
                >
                  <Camera size={14} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                {uploading && (
                  <span className="absolute inset-0 bg-black/40 flex items-center justify-center text-xs text-white font-semibold">
                    Uploading...
                  </span>
                )}
              </div>
              <div className="flex-1 flex flex-wrap items-center gap-4 mt-2 sm:mt-0">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{profile.name}</h1>
                  <p className="text-slate-600 font-medium">{profile.currentRole || 'Job Seeker'}</p>
                  <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                    <MapPin size={14} /> {profile.location || 'Location not set'}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate('/seeker/profile/edit')}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold transition-all"
                  >
                    <Edit size={18} /> Edit Profile
                  </button>
                  <Link
                    to="/settings"
                    className="flex items-center gap-2 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 px-5 py-2.5 rounded-xl font-semibold transition-all"
                  >
                    <Settings size={18} /> Settings
                  </Link>
                </div>
              </div>
            </div>

            {/* Current role & Skills row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div>
                <h3 className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  <Briefcase size={14} /> Current role
                </h3>
                <span className="inline-block px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium">
                  {profile.currentRole || 'Not set'}
                </span>
              </div>
              <div className="md:col-span-2">
                <h3 className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  <Award size={14} /> Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills?.length ? profile.skills.map((skill, i) => (
                    <span key={i} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium text-sm">
                      {skill}
                    </span>
                  )) : (
                    <span className="text-slate-500 text-sm">No skills added yet</span>
                  )}
                </div>
              </div>
            </div>

            {/* Email (optional display) */}
            <div className="mt-6 flex items-center gap-3 p-4 bg-slate-50 rounded-2xl w-fit">
              <Mail className="text-slate-500" size={20} />
              <span className="font-medium text-slate-800">{profile.email}</span>
            </div>

            {/* Bio */}
            {profile.bio && (
              <div className="mt-6">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Bio</h3>
                <p className="text-slate-600 bg-slate-50 p-4 rounded-2xl">{profile.bio}</p>
              </div>
            )}

            {/* Three action cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer">
                <p className="text-slate-700 text-sm font-medium">Show recruiters that you're ready for work.</p>
                <RefreshCw size={20} className="text-slate-400 shrink-0 ml-2" />
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer">
                <p className="text-slate-700 text-sm font-medium">Share latest news to get connected with others.</p>
                <Share2 size={20} className="text-slate-400 shrink-0 ml-2" />
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer">
                <p className="text-slate-700 text-sm font-medium">Keep your profile updated so recruiters know you better.</p>
                <Upload size={20} className="text-slate-400 shrink-0 ml-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerProfile;
