import React, { useState, useEffect } from 'react';
import {
    User,
    Mail,
    Briefcase,
    Award,
    Edit3,
    Check,
    X,
    Plus,
    Clock,
    Star,
    Save,
    Trash2,
    ShieldCheck,
    Package,
    Camera,
    MapPin,
    Settings,
    ArrowRight
} from 'lucide-react';
import API from '../services/api';
import SeekerNavbar from '../components/SeekerNavbar';
import PosterNavbar from '../components/PosterNavbar';
import { Link, useParams } from 'react-router-dom';

const Profile = () => {
    const { userId } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        skills: []
    });
    const [newSkill, setNewSkill] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const endpoint = userId ? `/users/profile/${userId}` : '/users/profile';
                const response = await API.get(endpoint);
                const data = response.data.user || response.data;
                setProfile(data);
                setFormData({
                    name: data.name,
                    bio: data.bio || '',
                    skills: data.skills || []
                });
            } catch (err) {
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [userId]);

    const handleEditProfile = () => {
        setEditing(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const response = await API.put('/users/profile', formData);
            setProfile(response.data);
            setEditing(false);
            alert('Profile updated successfully!');
        } catch (err) {
            console.error('Error updating profile:', err);
            alert('Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setFormData({
            name: profile.name,
            bio: profile.bio || '',
            skills: profile.skills || []
        });
        setEditing(false);
    };

    const addSkill = () => {
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData({
                ...formData,
                skills: [...formData.skills, newSkill.trim()]
            });
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter(s => s !== skillToRemove)
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    const isPoster = profile?.role === 'Poster';

    return (
        <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
            {isPoster ? <PosterNavbar /> : <SeekerNavbar />}

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Profile Card */}
                <div className="bg-white rounded-3xl shadow-strong overflow-hidden animate-scale-in">
                    
                    {/* Banner */}
                    <div className="relative h-48 bg-gradient-to-r from-primary-500 to-accent-500">
                        <div className="absolute inset-0 bg-black/20"></div>
                        {/* Banner Pattern Overlay */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="h-full w-full bg-repeat" style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M30 5l25 25v10l-25-25V5z' fill='white' fill-opacity='0.1'/%3E%3Cpath d='M5 30l25-25v10l-25 25V30z' fill='white' fill-opacity='0.1'/%3E%3C/g%3E%3C/svg%3E")`,
                                backgroundSize: '60px 60px'
                            }}></div>
                        </div>
                    </div>

                    {/* Profile Picture */}
                    <div className="relative px-8">
                        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full border-4 border-white shadow-strong overflow-hidden bg-secondary-100">
                                    <div className="w-full h-full flex items-center justify-center">
                                        <User size={48} className="text-secondary-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="px-8 pb-8 pt-20">
                        
                        {/* Name and Title */}
                        <div className="text-center mb-6">
                            {editing ? (
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="text-3xl font-black text-center bg-transparent border-b-2 border-secondary-300 focus:border-primary-500 outline-none px-2 py-1 mb-2"
                                />
                            ) : (
                                <h1 className="text-3xl font-black text-secondary-900">{profile.name}</h1>
                            )}
                            
                            {editing ? (
                                <input
                                    type="text"
                                    value={formData.title || ''}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="text-lg text-center bg-transparent border-b-2 border-secondary-300 focus:border-primary-500 outline-none px-2 py-1"
                                />
                            ) : (
                                <p className="text-lg text-secondary-600">{profile.title || 'Software Engineer'}</p>
                            )}
                        </div>

                        {/* Location */}
                        <div className="flex items-center justify-center gap-2 mb-8 text-secondary-600">
                            <MapPin size={16} />
                            {editing ? (
                                <input
                                    type="text"
                                    value={profile.location || ''}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="bg-transparent border-b border-secondary-300 focus:border-primary-500 outline-none px-2 py-1"
                                />
                            ) : (
                                <span>{profile.location || 'Los Angeles, California'}</span>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-center gap-4 mb-8">
                            {editing ? (
                                <>
                                    <button
                                        onClick={handleUpdate}
                                        disabled={saving}
                                        className="btn-primary flex items-center gap-2"
                                    >
                                        {saving ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={16} /> Save Profile
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        className="btn-secondary flex items-center gap-2"
                                    >
                                        <X size={16} /> Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={handleEditProfile}
                                        className="bg-secondary-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-secondary-900 transition-all flex items-center gap-2"
                                    >
                                        <Edit3 size={16} /> Edit Profile
                                    </button>
                                    <Link
                                        to="/settings"
                                        className="border-2 border-secondary-300 text-secondary-700 px-6 py-3 rounded-xl font-semibold hover:bg-secondary-50 transition-all flex items-center gap-2"
                                    >
                                        <Settings size={16} /> Settings
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Current Role */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Current role</h3>
                            {editing ? (
                                <input
                                    type="text"
                                    value={formData.role || ''}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full bg-secondary-50 border border-secondary-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            ) : (
                                <p className="text-secondary-700 bg-secondary-50 rounded-xl px-4 py-3">{profile.role || 'Software Engineer'}</p>
                            )}
                        </div>

                        {/* Skills */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Skills</h3>
                            <div className="flex flex-wrap gap-3">
                                {(editing ? formData.skills : profile.skills).map((skill, index) => (
                                    <span
                                        key={index}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                            editing 
                                                ? 'bg-primary-100 text-primary-700 hover:bg-primary-200 cursor-pointer' 
                                                : 'bg-secondary-100 text-secondary-700'
                                        }`}
                                        onClick={() => editing && removeSkill(skill)}
                                    >
                                        {skill}
                                        {editing && (
                                            <X size={14} className="ml-2" />
                                        )}
                                    </span>
                                ))}
                                
                                {editing && (
                                    <div className="flex items-center gap-2 mt-3">
                                        <input
                                            type="text"
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            className="flex-1 bg-secondary-50 border border-secondary-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            placeholder="Add new skill"
                                        />
                                        <button
                                            onClick={addSkill}
                                            className="px-4 py-2 rounded-full text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 transition-all flex items-center gap-1"
                                        >
                                            <Plus size={14} /> Add Skill
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-secondary-900 mb-4">About</h3>
                            {editing ? (
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="w-full bg-secondary-50 border border-secondary-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                                    rows={4}
                                    placeholder="Tell us about yourself, your experience, and why you're here..."
                                />
                            ) : (
                                <p className="text-secondary-600 bg-secondary-50 rounded-xl px-4 py-3">{profile.bio || 'Passionate software engineer with 5+ years of experience in web development and mobile applications.'}</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;
