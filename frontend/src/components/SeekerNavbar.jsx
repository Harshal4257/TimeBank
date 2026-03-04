import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Search, Briefcase, MessageSquare, Bell, User, Settings, HelpCircle, Shield, Bookmark, FileText, Star, ChevronDown, LogOut, Clock, Check } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import logoImg from './logo.jpeg';

const SeekerNavbar = () => {
  const navigate = useNavigate();
  const { user, logout } = React.useContext(AuthContext);
  const userEmail = user?.email || localStorage.getItem('email') || 'User';
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const markRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
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

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="text-slate-400 hover:text-slate-600 relative p-2"
            >
              <Bell size={22} className={unreadCount > 0 ? 'text-emerald-600' : ''} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full border-2 border-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-4 w-96 bg-white rounded-[32px] shadow-2xl border border-slate-100 py-6 overflow-hidden z-[70] animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="px-8 pb-4 border-b border-slate-50 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-900 uppercase text-xs">Notifications</h3>
                  {unreadCount > 0 && <div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-semibold rounded-lg">NEW</div>}
                </div>

                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-10 text-center">
                      <p className="text-sm font-bold text-slate-400 italic">No notifications yet</p>
                    </div>
                  ) : notifications.map(n => (
                    <div
                      key={n._id}
                      className={`px-8 py-5 border-b border-slate-50 hover:bg-slate-50 transition-colors relative group ${!n.read ? 'bg-emerald-50/30' : ''}`}
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div>
                          <p className={`text-sm font-semibold ${!n.read ? 'text-slate-900' : 'text-slate-600'}`}>{n.title}</p>
                          <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">{n.message}</p>
                          <p className="text-[9px] font-semibold text-slate-400 mt-2 uppercase">
                            {new Date(n.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {!n.read && (
                          <button
                            onClick={() => markRead(n._id)}
                            className="p-1.5 bg-white rounded-lg border border-slate-100 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                          >
                            <Check size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-medium"
            >
              <User size={18} /> Profile <ChevronDown size={16} className={`transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 py-6 overflow-hidden z-[60] animate-in fade-in slide-in-from-top-4 duration-300">
                {/* User Header Section */}
                <div className="px-6 pb-6 border-b border-slate-50 flex items-center gap-4">
                  <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-emerald-100">
                    {userEmail.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-semibold text-slate-900 truncate">{userEmail}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-medium rounded-lg uppercase border border-emerald-100">
                        Seeker
                      </div>
                    </div>
                  </div>
                </div>

                {/* Credits Quick View */}
                <div className="px-6 py-4 bg-slate-50/50 flex justify-between items-center border-b border-slate-50">
                  <div className="flex items-center gap-2 text-slate-500 font-medium text-xs uppercase">
                    <Clock size={14} /> Balance
                  </div>
                  <div className="text-emerald-600 font-semibold text-lg">
                    30.0 <span className="text-[10px] uppercase">Credits</span>
                  </div>
                </div>

                {/* Navigation Options */}
                <div className="py-4 px-2 grid grid-cols-1 gap-1">
                  <Link
                    to="/profile"
                    className="flex items-center gap-4 px-4 py-3 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-2xl transition-all group"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-900">My Profile</p>
                      <p className="text-[10px] text-slate-400 font-medium italic">View and edit your bio</p>
                    </div>
                  </Link>

                  <Link
                    to="/my-applications"
                    className="flex items-center gap-4 px-4 py-3 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-2xl transition-all group"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-900">Applications</p>
                      <p className="text-[10px] text-slate-400 font-medium italic">Track your job status</p>
                    </div>
                  </Link>

                  <Link
                    to="/saved-jobs"
                    className="flex items-center gap-4 px-4 py-3 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-2xl transition-all group"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                      <Bookmark size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-900">Bookmarked</p>
                      <p className="text-[10px] text-slate-400 font-medium italic">Jobs you've saved</p>
                    </div>
                  </Link>

                  <div className="h-[1px] bg-slate-50 my-2 mx-4"></div>

                  <Link
                    to="/settings"
                    className="flex items-center gap-4 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-2xl transition-all group"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                      <Settings size={18} />
                    </div>
                    <p className="font-semibold text-sm">Account Settings</p>
                  </Link>

                  <Link
                    to="/help"
                    className="flex items-center gap-4 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-2xl transition-all group"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                      <HelpCircle size={18} />
                    </div>
                    <p className="font-semibold text-sm">Help Center</p>
                  </Link>
                </div>

                {/* Sign Out */}
                <div className="px-4 mt-4 pt-4 border-t border-slate-50">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-red-50 text-red-600 rounded-2xl font-semibold text-sm uppercase hover:bg-red-100 transition-all"
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
