import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Settings, LogOut, Bell, ChevronDown,
  Briefcase, MessageSquare, Home, FileText, Bookmark, HelpCircle
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import logoImg from './logo.jpeg';

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const base = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
  return `${base}${path}`;
};

const SeekerNavbar = () => {
  const navigate = useNavigate();
  const { user, logout } = React.useContext(AuthContext);
  const userEmail = user?.email || localStorage.getItem('email') || 'User';
  const userName = user?.name || localStorage.getItem('name') || userEmail;

  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // ✅ Fetch avatar once on mount
  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const res = await API.get('/users/profile');
        if (res.data?.avatarUrl) setAvatarUrl(res.data.avatarUrl);
      } catch (err) {
        // silently fail — letter avatar will show instead
      }
    };
    fetchAvatar();
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isNotificationsOpen && !event.target.closest('.notification-dropdown')) {
        setIsNotificationsOpen(false);
      }
      if (isProfileDropdownOpen && !event.target.closest('.profile-dropdown')) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotificationsOpen, isProfileDropdownOpen]);

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const handleNotificationClick = (notification) => {
    setNotifications(notifications.map(n => n._id === notification._id ? { ...n, read: true } : n));
    switch (notification.type) {
      case 'application_accepted': navigate('/my-applications'); break;
      case 'job_match': navigate(`/jobs/${notification.jobId}`); break;
      default: break;
    }
    setIsNotificationsOpen(false);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n._id !== notification._id));
    }, 500);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // ── Avatar component used in both the button and dropdown header ──
  const Avatar = ({ size = 'sm' }) => {
    const dim = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
    const imgUrl = getImageUrl(avatarUrl);
    if (imgUrl) {
      return (
        <img
          src={imgUrl}
          alt="Profile"
          className={`${dim} rounded-full object-cover border-2 border-white`}
        />
      );
    }
    return (
      <div className={`${dim} bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
        {userName.charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <nav className="bg-white border-b border-secondary-200 sticky top-0 z-50 backdrop-blur-xs bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 lg:h-20 flex justify-between items-center">

        {/* Logo */}
        <Link to="/seeker-home" className="flex items-center gap-3 group">
          <img src={logoImg} alt="TimeBank Logo"
            className="w-12 h-12 lg:w-16 lg:h-16 object-contain transition-transform duration-500 group-hover:rotate-3 group-hover:scale-110" />
          <div className="flex flex-col">
            <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded-full uppercase tracking-wider">Seeker</span>
          </div>
        </Link>

        {/* Nav Links */}
        <div className="hidden lg:flex items-center gap-6">
          <Link to="/seeker-home" className="flex items-center gap-2 px-3 py-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl font-medium transition-all text-sm">
            <Home size={16} /> Home
          </Link>
          <Link to="/my-applications" className="flex items-center gap-2 px-3 py-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl font-medium transition-all text-sm">
            <Briefcase size={16} /> Applications
          </Link>
          <Link to="/messages" className="flex items-center gap-2 px-3 py-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl font-medium transition-all text-sm">
            <MessageSquare size={16} /> Messages
          </Link>

          <div className="h-6 w-px bg-secondary-200"></div>

          {/* Notifications */}
          <div className="relative notification-dropdown">
            <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 text-secondary-600 hover:text-primary-600 rounded-xl hover:bg-primary-50 transition-all">
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-strong border border-secondary-100 py-4 overflow-hidden z-[70] animate-slide-down">
                <div className="px-6 pb-4 border-b border-secondary-100 flex justify-between items-center">
                  <h3 className="font-semibold text-secondary-900 text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <div className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-lg">NEW</div>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center"><p className="text-sm text-secondary-500">No notifications yet</p></div>
                  ) : notifications.map(n => (
                    <div key={n._id}
                      className={`px-6 py-4 border-b border-secondary-50 hover:bg-secondary-50 transition-colors ${!n.read ? 'bg-primary-50/30' : ''}`}>
                      <div className="flex-1 cursor-pointer p-3 rounded-lg" onClick={() => handleNotificationClick(n)}>
                        <p className={`text-sm font-semibold ${!n.read ? 'text-secondary-900' : 'text-secondary-600'}`}>{n.title}</p>
                        <p className="text-xs text-secondary-500 mt-1">{n.message}</p>
                        <p className="text-xs text-secondary-400 mt-2">{new Date(n.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative profile-dropdown">
            {/* ✅ Shows real profile photo or letter initial */}
            <button
              onClick={() => { setIsProfileDropdownOpen(!isProfileDropdownOpen); setIsNotificationsOpen(false); }}
              className="rounded-full hover:ring-2 hover:ring-primary-400 transition-all"
            >
              <Avatar size="sm" />
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-strong border border-secondary-100 py-4 overflow-hidden z-[60]">
                {/* ✅ Shows real profile photo in dropdown header too */}
                <div className="px-6 pb-4 border-b border-secondary-100 flex items-center gap-3">
                  <Avatar size="md" />
                  <div>
                    <p className="font-semibold text-secondary-900 truncate">{userName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-lg">Seeker</div>
                    </div>
                  </div>
                </div>

                <div className="py-3 px-2">
                  <Link to="/profile" className="flex items-center gap-3 px-3 py-2 text-secondary-600 hover:bg-secondary-50 rounded-xl transition-all" onClick={() => setIsProfileDropdownOpen(false)}>
                    <User size={16} /><p className="text-sm font-medium">My Profile</p>
                  </Link>
                  <Link to="/my-applications" className="flex items-center gap-3 px-3 py-2 text-secondary-600 hover:bg-secondary-50 rounded-xl transition-all" onClick={() => setIsProfileDropdownOpen(false)}>
                    <FileText size={16} /><p className="text-sm font-medium">Applications</p>
                  </Link>
                  <Link to="/saved-jobs" className="flex items-center gap-3 px-3 py-2 text-secondary-600 hover:bg-secondary-50 rounded-xl transition-all" onClick={() => setIsProfileDropdownOpen(false)}>
                    <Bookmark size={16} /><p className="text-sm font-medium">Bookmarked</p>
                  </Link>
                  <div className="border-t border-secondary-100 my-2"></div>
                  <Link to="/settings" className="flex items-center gap-3 px-3 py-2 text-secondary-600 hover:bg-secondary-50 rounded-xl transition-all" onClick={() => setIsProfileDropdownOpen(false)}>
                    <Settings size={16} /><p className="text-sm font-medium">Settings</p>
                  </Link>
                  <Link to="/help" className="flex items-center gap-3 px-3 py-2 text-secondary-600 hover:bg-secondary-50 rounded-xl transition-all" onClick={() => setIsProfileDropdownOpen(false)}>
                    <HelpCircle size={16} /><p className="text-sm font-medium">Help Center</p>
                  </Link>
                </div>

                <div className="px-4 mt-2 pt-2 border-t border-secondary-100">
                  <button onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 rounded-xl font-medium text-sm hover:bg-red-100 transition-all">
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile */}
        <button onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
          className="lg:hidden p-2 rounded-xl hover:bg-secondary-50 transition-colors">
          <Avatar size="sm" />
        </button>
      </div>
    </nav>
  );
};

export default SeekerNavbar;
