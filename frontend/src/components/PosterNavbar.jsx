import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import {
  BarChart3,
  Briefcase,
  Users,
  MessageSquare,
  LogOut,
  User,
  CreditCard,
  PieChart,
  Bell,
  Check
} from 'lucide-react';

const PosterNavbar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
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

  const navItems = [
    { name: 'Dashboard', path: '/poster/dashboard', icon: BarChart3 },
    { name: 'My Jobs', path: '/poster/jobs', icon: Briefcase },
    { name: 'Applicants', path: '/poster/applicants', icon: Users },
    { name: 'Post Job', path: '/poster/post-job', icon: Briefcase },
    { name: 'Messages', path: '/poster/messages', icon: MessageSquare },
    { name: 'Payments', path: '/poster/payments', icon: CreditCard },
    { name: 'Reports', path: '/poster/reports', icon: PieChart },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold">
            <span className="text-slate-900">Time</span>
            <span className="text-emerald-600">Bank</span>
          </div>
          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">
            Poster
          </span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-medium transition-colors"
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="text-slate-400 hover:text-slate-600 relative p-2"
            >
              <Bell size={20} className={unreadCount > 0 ? 'text-emerald-600 animate-swing' : ''} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-semibold rounded-full border-2 border-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-4 w-96 bg-white rounded-[32px] shadow-2xl border border-slate-100 py-6 overflow-hidden z-[70] animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="px-8 pb-4 border-b border-slate-50 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-900 uppercase text-xs">Notifications</h3>
                  {unreadCount > 0 && <div className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-semibold rounded-lg">NEW</div>}
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
              className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <User size={20} />
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute right-0 top-full mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 py-6 overflow-hidden z-[60] animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="px-6 pb-6 border-b border-slate-50 flex items-center gap-4">
                  <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-xl font-semibold">
                    P
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">TimeBank Poster</p>
                    <p className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-lg font-medium uppercase text-slate-500 w-max mt-1">
                      Premium Poster
                    </p>
                  </div>
                </div>

                <div className="py-4 px-2 grid grid-cols-1 gap-1">
                  <Link
                    to="/profile"
                    className="flex items-center gap-4 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-2xl group transition-all"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                      <User size={18} />
                    </div>
                    <p className="font-semibold text-sm text-slate-900">Public Profile</p>
                  </Link>
                  <Link
                    to="/poster/reports"
                    className="flex items-center gap-4 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-2xl group transition-all"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                      <BarChart3 size={18} />
                    </div>
                    <p className="font-semibold text-sm text-slate-900">Analytics</p>
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center gap-4 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-2xl group transition-all"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                      <LogOut size={18} className="rotate-180" />
                    </div>
                    <p className="font-semibold text-sm text-slate-900">Settings</p>
                  </Link>
                </div>

                <div className="px-4 mt-4 pt-4 border-t border-slate-50">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-red-50 text-red-600 rounded-2xl font-semibold text-sm uppercase hover:bg-red-100 transition-all"
                  >
                    <LogOut size={18} /> Sign Out
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

export default PosterNavbar;