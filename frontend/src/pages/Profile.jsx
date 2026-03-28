import React, { useState, useEffect, useContext } from 'react';
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
import { AuthContext } from '../context/AuthContext'; // Import your AuthContext
import { Link, useParams } from 'react-router-dom';

const Profile = () => {
    const { userId } = useParams();
    const { user, loading: authLoading } = useContext(AuthContext); // Use AuthContext to track loading state
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
            // Wait until AuthContext is finished loading before fetching profile data
            if (authLoading) return;

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
    }, [userId, authLoading]); // Re-run effect when authLoading changes

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

    // Show a loading spinner while either Auth or Profile data is loading
    if (authLoading || loading) {
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
                <div className="bg-white rounded-3xl shadow-strong overflow-hidden animate-scale-in">
                    
                    {/* Banner */}
                    <div className="relative h-48 bg-gradient-to-r from-primary-500 to-accent-500">
                        <div className="absolute inset-0 bg-black/20"></div>
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
                        <div className="text-center mb-6">
                            {editing ? (
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="text-3xl font-black text-center bg-transparent border-b-2 border-secondary-300 focus:border-primary-500 outline-none px-2 py-1 mb-2"
                                />
                            ) : (
                                <h1 className="text-3xl font-black text-secondary-900">{profile?.name}</h1>
                            )}
                            
                            <p className="text-lg text-secondary-600">{profile?.title || 'Software Engineer'}</p>
                        </div>

                        <div className="flex items-center justify-center gap-2 mb-8 text-secondary-600">
                            <MapPin size={16} />
                            <span>{profile?.location || 'Pune, India'}</span>
                        </div>

                        <div className="flex justify-center gap-4 mb-8">
                            {editing ? (
                                <>
                                    <button onClick={handleUpdate} disabled={saving} className="btn-primary flex items-center gap-2">
                                        {saving ? 'Saving...' : <><Save size={16} /> Save Profile</>}
                                    </button>
                                    <button onClick={handleCancelEdit} className="btn-secondary flex items-center gap-2">
                                        <X size={16} /> Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={handleEditProfile} className="bg-secondary-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-secondary-900 transition-all flex items-center gap-2">
                                        <Edit3 size={16} /> Edit Profile
                                    </button>
                                    <Link to="/settings" className="border-2 border-secondary-300 text-secondary-700 px-6 py-3 rounded-xl font-semibold hover:bg-secondary-50 transition-all flex items-center gap-2">
                                        <Settings size={16} /> Settings
                                    </Link>
                                </>
                            )}
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Current role</h3>
                            <p className="text-secondary-700 bg-secondary-50 rounded-xl px-4 py-3">{profile?.role}</p>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Skills</h3>
                            <div className="flex flex-wrap gap-3">
                                {(editing ? formData.skills : profile?.skills || []).map((skill, index) => (
                                    <span
                                        key={index}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                            editing ? 'bg-primary-100 text-primary-700 hover:bg-primary-200 cursor-pointer' : 'bg-secondary-100 text-secondary-700'
                                        }`}
                                        onClick={() => editing && removeSkill(skill)}
                                    >
                                        {skill}
                                        {editing && <X size={14} className="ml-2 inline" />}
                                    </span>
                                ))}
                                
                                {editing && (
                                    <div className="flex items-center gap-2 mt-3 w-full">
                                        <input
                                            type="text"
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            className="flex-1 bg-secondary-50 border border-secondary-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            placeholder="Add new skill"
                                        />
                                        <button onClick={addSkill} className="px-4 py-2 rounded-full text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 transition-all flex items-center gap-1">
                                            <Plus size={14} /> Add
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-secondary-900 mb-4">About</h3>
                            {editing ? (
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="w-full bg-secondary-50 border border-secondary-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                                    rows={4}
                                />
                            ) : (
                                <p className="text-secondary-600 bg-secondary-50 rounded-xl px-4 py-3">{profile?.bio || 'No bio provided.'}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;