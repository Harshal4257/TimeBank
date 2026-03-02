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
    Package
} from 'lucide-react';
import API from '../services/api';
import SeekerNavbar from '../components/SeekerNavbar';
import PosterNavbar from '../components/PosterNavbar';

const Profile = () => {
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
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await API.get('/users/profile');
            setProfile(response.data);
            setFormData({
                name: response.data.name,
                bio: response.data.bio || '',
                skills: response.data.skills || []
            });
        } catch (err) {
            console.error('Error fetching profile:', err);
        } finally {
            setLoading(false);
        }
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
            <div className="min-h-screen bg-[#E6EEF2] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    const isPoster = profile?.role === 'Poster';

    return (
        <div className="min-h-screen bg-[#E6EEF2]">
            {isPoster ? <PosterNavbar /> : <SeekerNavbar />}

            <div className="max-w-4xl mx-auto px-6 py-10">

                {/* Header Section */}
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm mb-8 relative overflow-hidden">
                    {/* Background Decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -mr-20 -mt-20 opacity-50"></div>

                    <div className="relative flex flex-col md:flex-row items-center gap-8">
                        <div className="relative">
                            <div className="w-32 h-32 bg-emerald-600 rounded-3xl flex items-center justify-center text-white text-5xl font-black shadow-lg shadow-emerald-100 border-4 border-white">
                                {profile.name.charAt(0)}
                            </div>
                            {!editing && (
                                <button
                                    onClick={() => setEditing(true)}
                                    className="absolute -bottom-2 -right-2 p-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors shadow-lg"
                                >
                                    <Edit3 size={18} />
                                </button>
                            )}
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-black text-slate-900 mb-1">{profile.name}</h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-500 font-medium mb-4">
                                <span className="flex items-center gap-1.5"><Mail size={16} /> {profile.email}</span>
                                <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-100 rounded-full text-xs font-bold uppercase tracking-wider text-slate-600 border border-slate-200">
                                    {profile.role}
                                </span>
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 flex items-center gap-2">
                                    <Clock size={18} />
                                    <span className="font-bold">{profile.credits} Time Credits</span>
                                </div>
                                <div className="px-4 py-2 bg-amber-50 text-amber-700 rounded-2xl border border-amber-100 flex items-center gap-2">
                                    <Star size={18} className="fill-amber-500" />
                                    <span className="font-bold">{profile.rating || 0} ({profile.numReviews || 0} reviews)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Info Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* About Section */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm transition-all">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <User className="text-emerald-600" size={24} />
                                    Professional Bio
                                </h2>
                            </div>

                            {editing ? (
                                <textarea
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl h-40 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                                    placeholder="Tell the community about yourself, your experience, and why you're here..."
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                />
                            ) : (
                                <p className="text-slate-600 leading-relaxed italic">
                                    {profile.bio || "No bio added yet. Add a bio to help others get to know you!"}
                                </p>
                            )}
                        </div>

                        {/* Skills Section */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <Award className="text-emerald-600" size={24} />
                                    Skills & Expertise
                                </h2>
                            </div>

                            {editing ? (
                                <div className="space-y-4">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                            placeholder="Add a new skill (e.g. Graphic Design)"
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                                        />
                                        <button
                                            type="button"
                                            onClick={addSkill}
                                            className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
                                        >
                                            <Plus size={24} />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {formData.skills.map(skill => (
                                            <span key={skill} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 font-bold rounded-lg border border-emerald-100 flex items-center gap-2">
                                                {skill}
                                                <button onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors">
                                                    <Trash2 size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills?.length > 0 ? profile.skills.map(skill => (
                                        <span key={skill} className="px-4 py-2 bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 shadow-sm">
                                            {skill}
                                        </span>
                                    )) : (
                                        <p className="text-slate-400 italic">No skills listed. Add some to get better matches!</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {editing && (
                            <div className="flex gap-4">
                                <button
                                    onClick={handleUpdate}
                                    disabled={saving}
                                    className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-700 shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 transition-all"
                                >
                                    {saving ? "Saving..." : <><Save size={20} /> Save Profile Changes</>}
                                </button>
                                <button
                                    onClick={() => {
                                        setEditing(false);
                                        setFormData({
                                            name: profile.name,
                                            bio: profile.bio || '',
                                            skills: profile.skills || []
                                        });
                                    }}
                                    className="px-8 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
                                >
                                    <X size={20} /> Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Stats Column */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group">
                            <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-700"></div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-6 inline-block border-b border-emerald-900 pb-1">Account Verifier</h3>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                                        <ShieldCheck size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Status</p>
                                        <p className="font-bold text-sm">Community Verified</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                                        <Package size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Impact</p>
                                        <p className="font-bold text-sm">Help 12 Community Members</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                                <p className="text-xs text-slate-400 leading-relaxed italic">
                                    "TimeBank is more than skills; it's about building lasting connections through helpfulness."
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                            <h3 className="font-black text-slate-900 mb-4 uppercase text-xs tracking-widest">Community Badge</h3>
                            <div className="flex flex-col items-center py-6 text-center">
                                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center border-4 border-amber-100 mb-3">
                                    <Award className="text-amber-500" size={40} />
                                </div>
                                <p className="font-bold text-slate-900">Rising Star</p>
                                <p className="text-xs text-slate-500 mt-1">Complete 5 tasks to reach the next level</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;
