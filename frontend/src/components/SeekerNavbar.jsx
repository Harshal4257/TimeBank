import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Search, Briefcase, MessageSquare, Bell, User, Settings, HelpCircle, Shield, Bookmark, FileText, Star, ChevronDown, LogOut } from 'lucide-react';
import logoImg from './logo.jpeg';

const SeekerNavbar = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail') || 'User';
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        
        {/* Logo Section */}
        <Link to="/seeker-home" className="flex items-center gap-3 group">
          <img 
            src={logoImg} 
            alt="TimeBank Logo" 
            className="w-20 h-20 object-contain transition-transform duration-500 group-hover:rotate-3 group-hover:scale-110" 
          />
          <div className="text-2xl font-black tracking-tight">
            <span className="text-slate-900">Time</span>
            <span className="text-emerald-600">Bank</span>
          </div>
        </Link>

        {/* Seeker Navigation Links */}
        <div className="flex items-center gap-8">
          {/* Main Navigation */}
          <Link to="/seeker-home" className="text-slate-600 hover:text-emerald-600 font-medium flex items-center gap-2">
            <Home size={18} /> Home
          </Link>

          <Link to="/my-applications" className="text-slate-600 hover:text-emerald-600 font-medium flex items-center gap-2">
            <Briefcase size={18} /> My Applications
          </Link>

          <Link to="/messages" className="text-slate-600 hover:text-emerald-600 font-medium flex items-center gap-2">
            <MessageSquare size={18} /> Messages
          </Link>
          
          <button className="text-slate-400 hover:text-slate-600 relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          {/* Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-medium"
            >
              <User size={18} /> Profile <ChevronDown size={16} className={`transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 py-2">
                {/* User Email Section */}
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="font-semibold text-slate-900">{userEmail}</p>
                </div>
                
                {/* Middle Options */}
                <div className="py-2">
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-emerald-600 flex items-center gap-3"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <User size={16} /> Profile
                  </Link>
                  
                  <Link 
                    to="/my-applications" 
                    className="block px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-emerald-600 flex items-center gap-3"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <FileText size={16} /> My Applications
                  </Link>
                  
                  <Link 
                    to="/saved-jobs" 
                    className="block px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-emerald-600 flex items-center gap-3"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <Bookmark size={16} /> Saved Jobs
                  </Link>
                  
                  <Link 
                    to="/my-reviews" 
                    className="block px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-emerald-600 flex items-center gap-3"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <Star size={16} /> My Reviews
                  </Link>
                  
                  <Link 
                    to="/settings" 
                    className="block px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-emerald-600 flex items-center gap-3"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <Settings size={16} /> Settings
                  </Link>
                  
                  <Link 
                    to="/help" 
                    className="block px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-emerald-600 flex items-center gap-3"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <HelpCircle size={16} /> Help
                  </Link>
                  
                  <Link 
                    to="/privacy" 
                    className="block px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-emerald-600 flex items-center gap-3"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <Shield size={16} /> Privacy
                  </Link>
                </div>
                
                {/* Sign Out */}
                <div className="border-t border-slate-100 pt-2">
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-medium flex items-center gap-3"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SeekerNavbar;
