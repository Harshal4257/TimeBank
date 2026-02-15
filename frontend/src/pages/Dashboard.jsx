import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get('/users/profile');
        setUser(response.data.user || response.data); 
      } catch (error) {
        console.error("Dashboard Error:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="p-10 text-center font-medium text-slate-500">Loading your profile...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen bg-slate-50">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-800">
          Welcome, {user?.name || "User"}
        </h1>
        <Link 
          to="/post-task" 
          className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all transform hover:scale-105"
        >
          + Post a New Task
        </Link>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-emerald-500 text-white p-8 rounded-3xl shadow-xl">
          <p className="text-sm uppercase tracking-widest opacity-80 mb-2">Total Time Credits</p>
          <p className="text-6xl font-black">{user?.credits ?? 0} Hours</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-md border border-slate-100 flex flex-col justify-center">
          <p className="text-slate-500 font-semibold mb-1">Account Role</p>
          <p className="text-2xl font-bold text-slate-800">{user?.role || "Seeker"}</p>
        </div>
      </div>

      {/* Task Preview Section */}
      <div className="bg-white p-8 rounded-3xl shadow-md border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Your Recent Tasks</h2>
        <p className="text-slate-500 italic">You haven't posted any tasks yet. Need help with Python or SQL? Click the button above!</p>
      </div>
    </div>
  );
};

export default Dashboard;