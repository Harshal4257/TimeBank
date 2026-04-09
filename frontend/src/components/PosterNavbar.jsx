import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import logoImg from './logo.jpeg';
import {
  Briefcase, Users, MessageSquare, LogOut, User,
  CreditCard, Bell, Menu, X, Settings
} from 'lucide-react';

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const base = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
  return `${base}${path}`;
};

const PosterNavbar = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const userName = user?.name || localStorage.getItem('name') || 'Poster';

  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // ✅ Fetch avatar on mount
  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const res = await API.get('/users/profile');
        if (res.data?.avatarUrl) setAvatarUrl(res.data.avatarUrl);
      } catch (err) {
        // silently fail
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
      if (isNotificationsOpen && !event.target.closest('.notification-dropdown')) setIsNotificationsOpen(false);
      if (isProfileDropdownOpen && !event.target.closest('.profile-dropdown')) setIsProfileDropdownOpen(false);
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
    navigate('/poster/messages', {
      state: {
        notificationUser: notification.applicantId || notification.senderId,
        notificationMessage: notification.message,
        notificationTitle: notification.title,
        notificationId: notification._id
      }
    });
    setIsNotificationsOpen(false);
    setTimeout(() => setNotifications(prev => prev.filter(n => n._id !== notification._id)), 500);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Jobs', path: '/poster/jobs', icon: Briefcase },
    { name: 'Applicants', path: '/poster/applicants', icon: Users },
    { name: 'Messages', path: '/poster/messages', icon: MessageSquare },
    { name: 'Payments', path: '/poster/payments', icon: CreditCard },
  ];

  // ✅ Reusable avatar — shows photo or letter initial
  const Avatar = ({ size = 'sm' }) => {
    const dim = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
    const imgUrl = getImageUrl(avatarUrl);
    if (imgUrl) {
      return <img src={imgUrl} alt="Profile" className={`${dim} rounded-full object-cover border-2 border-white`} />;
    }
    return (
      <div className={`${dim} bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
        {userName.charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <nav className="bg-white border-b border-secondary-200 sticky top-0 z-50 bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 lg:h-20 flex justify-between items-center">

        {/* Logo */}
        <Link to="/poster/jobs" className="flex items-center gap-3 group">
          <img src={logoImg} alt="TimeBank Logo"
            className="w-10 h-10 lg:w-16 lg:h-16 object-contain transition-transform duration-500 group-hover:rotate-3 group-hover:scale-110" />
          <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded-full uppercase tracking-wider">Poster</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}
                className="flex items-center gap-2 px-3 py-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl font-medium transition-all text-sm">
                <item.icon size={16} />
                <span className="hidden xl:inline">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Notifications */}
          <div className="relative notification-dropdown">
            <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 text-secondary-600 hover:text-primary-600 rounded-xl hover:bg-primary-50 transition-all">
              <Bell size={18} />
              {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-strong border border-secondary-100 py-4 overflow-hidden z-[70]">
                <div className="px-6 pb-4 border-b border-secondary-100 flex justify-between items-center">
                  <h3 className="font-semibold text-secondary-900 text-sm">Notifications</h3>
                  {unreadCount > 0 && <div className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-lg">NEW</div>}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center"><p className="text-sm text-secondary-500">No notifications yet</p></div>
                  ) : notifications.map(n => (
                    <div key={n._id}
                      className={`px-6 py-4 border-b border-secondary-50 hover:bg-secondary-50 cursor-pointer ${!n.read ? 'bg-primary-50/30' : ''}`}
                      onClick={() => handleNotificationClick(n)}>
                      <p className={`text-sm font-semibold ${!n.read ? 'text-secondary-900' : 'text-secondary-600'}`}>{n.title}</p>
                      <p className="text-xs text-secondary-500 mt-1">{n.message}</p>
                      <p className="text-xs text-secondary-400 mt-2">{new Date(n.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative profile-dropdown">
            {/* ✅ Real photo or letter */}
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="rounded-full hover:ring-2 hover:ring-primary-400 transition-all">
              <Avatar size="sm" />
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-strong border border-secondary-100 py-4 overflow-hidden z-[60]">
                {/* ✅ Real photo in dropdown header */}
                <div className="px-6 pb-4 border-b border-secondary-100 flex items-center gap-3">
                  <Avatar size="md" />
                  <div>
                    <p className="font-semibold text-secondary-900">{userName}</p>
                    <p className="text-xs bg-secondary-100 px-2 py-1 rounded-lg font-medium text-secondary-600 mt-1">
                      {user?.email || ''}
                    </p>
                  </div>
                </div>

                <div className="py-2 px-2">
                  <Link to="/poster/profile" onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-secondary-600 hover:bg-secondary-50 rounded-xl transition-all">
                    <User size={16} /><p className="text-sm font-medium">My Profile</p>
                  </Link>
                  <Link to="/settings" onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-secondary-600 hover:bg-secondary-50 rounded-xl transition-all">
                    <Settings size={16} /><p className="text-sm font-medium">Settings</p>
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
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl hover:bg-secondary-50 transition-colors">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-secondary-200 bg-white">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary-50 transition-colors text-secondary-700"
                onClick={() => setIsMobileMenuOpen(false)}>
                <item.icon size={20} /><span className="font-medium">{item.name}</span>
              </Link>
            ))}
            <div className="border-t border-secondary-200 pt-2 mt-2">
              <Link to="/poster/profile"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary-50 transition-colors text-secondary-700"
                onClick={() => setIsMobileMenuOpen(false)}>
                <User size={20} /><span className="font-medium">Profile</span>
              </Link>
              <button onClick={handleLogout}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-colors text-red-600 w-full text-left">
                <LogOut size={20} /><span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default PosterNavbar;
