import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, TrendingUp, Users, Star, ArrowRight, Plus, Activity, Award } from 'lucide-react';
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-secondary-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div className="space-y-2 animate-fade-in">
            <h1 className="text-3xl lg:text-4xl font-black text-secondary-900">
              Welcome back, <span className="text-gradient">{user?.name || "User"}</span>
            </h1>
            <p className="text-secondary-600">Manage your time credits and tasks from your personal dashboard</p>
          </div>
          
          <Link 
            to="/post-task" 
            className="btn-primary flex items-center gap-2 animate-slide-up"
          >
            <Plus className="w-5 h-5" />
            Post a New Task
          </Link>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card group hover:scale-105 animate-scale-in" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center justify-between mb-4">
              <div className="bg-primary-100 p-3 rounded-xl group-hover:bg-primary-200 transition-colors">
                <Clock className="w-6 h-6 text-primary-600" />
              </div>
              <span className="text-sm text-primary-600 font-medium">+12%</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-secondary-600 font-medium">Time Credits</p>
              <p className="text-3xl font-black text-secondary-900">{user?.credits ?? 0} <span className="text-lg font-normal">hours</span></p>
            </div>
          </div>

          <div className="card group hover:scale-105 animate-scale-in" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center justify-between mb-4">
              <div className="bg-accent-100 p-3 rounded-xl group-hover:bg-accent-200 transition-colors">
                <Award className="w-6 h-6 text-accent-600" />
              </div>
              <span className="text-sm text-accent-600 font-medium">Level 3</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-secondary-600 font-medium">Account Role</p>
              <p className="text-2xl font-bold text-secondary-800">{user?.role || "Seeker"}</p>
            </div>
          </div>

          <div className="card group hover:scale-105 animate-scale-in" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-xl group-hover:bg-blue-200 transition-colors">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-blue-600 font-medium">Active</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-secondary-600 font-medium">Tasks This Month</p>
              <p className="text-2xl font-bold text-secondary-800">8</p>
            </div>
          </div>

          <div className="card group hover:scale-105 animate-scale-in" style={{animationDelay: '0.4s'}}>
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-xl group-hover:bg-purple-200 transition-colors">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-purple-600 font-medium">4.9</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-secondary-600 font-medium">Your Rating</p>
              <p className="text-2xl font-bold text-secondary-800">Excellent</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Tasks */}
          <div className="card animate-slide-up" style={{animationDelay: '0.5s'}}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-secondary-800">Your Recent Tasks</h2>
              <Link to="/my-tasks" className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="space-y-4">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-secondary-400" />
                </div>
                <p className="text-secondary-500 italic mb-4">You haven't posted any tasks yet</p>
                <p className="text-secondary-600 text-sm mb-6">Need help with Python, SQL, or other skills? Click the button above to get started!</p>
                <Link 
                  to="/post-task" 
                  className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Task
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="card animate-slide-up" style={{animationDelay: '0.6s'}}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-secondary-800">Quick Tips</h2>
              <TrendingUp className="w-5 h-5 text-primary-500" />
            </div>
            
            <div className="space-y-4">
              {[
                { icon: Users, title: "Build Your Network", desc: "Connect with community members", color: "blue" },
                { icon: Star, title: "Earn Reviews", desc: "Complete tasks to build reputation", color: "yellow" },
                { icon: Clock, title: "Maximize Credits", desc: "Share skills to earn more time credits", color: "green" },
              ].map((tip, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-xl hover:bg-secondary-50 transition-colors">
                  <div className={`bg-${tip.color}-100 p-2 rounded-lg mt-1`}>
                    <tip.icon className="w-4 h-4 text-${tip.color}-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-secondary-800 text-sm">{tip.title}</h3>
                    <p className="text-secondary-600 text-xs">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Overview */}
        <div className="card animate-slide-up" style={{animationDelay: '0.7s'}}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-secondary-800">Activity Overview</h2>
            <select className="text-sm border border-secondary-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 mb-1">24</div>
              <p className="text-sm text-secondary-600">Tasks Completed</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-600 mb-1">156</div>
              <p className="text-sm text-secondary-600">Hours Earned</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">12</div>
              <p className="text-sm text-secondary-600">People Helped</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;