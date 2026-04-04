import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import logoImg from './logo.jpeg';
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
  Check,
  Menu,
  X,
  Settings
} from 'lucide-react';

const PosterNavbar = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notifications, setNotifications] = useState([
    {
      _id: '1',
      title: 'New Application',
      message: 'John Doe applied for your "Web Developer" job',
      read: false,
      createdAt: new Date().toISOString(),
      type: 'application',
      jobId: 'job123',
      applicantId: 'user456'
    },
    {
      _id: '2',
      title: 'Job Posted Successfully',
      message: 'Your job "React Developer" has been posted',
      read: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      type: 'job_posted',
      jobId: 'job789'
    },
    {
      _id: '3',
      title: 'Payment Received',
      message: 'You received ₹5000 from Jane Smith',
      read: false,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      type: 'payment',
      paymentId: 'pay123'
    }
  ]);

  // Close dropdowns when clicking outside
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

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    
    // Listen for notification removal events
    const handleRemoveNotification = (event) => {
      const { id } = event.detail;
      console.log('Removing notification:', id);
      setNotifications(prev => prev.filter(n => n._id !== id));
    };
    
    window.addEventListener('removeNotification', handleRemoveNotification);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('removeNotification', handleRemoveNotification);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark as read
    setNotifications(notifications.map(n => n._id === notification._id ? { ...n, read: true } : n));
    
    // Navigate to messages page with specific chat info
    navigate('/poster/messages', { 
      state: { 
        notificationUser: notification.applicantId || notification.senderId,
        notificationMessage: notification.message,
        notificationTitle: notification.title,
        notificationId: notification._id
      } 
    });
    
    // Close dropdown
    setIsNotificationsOpen(false);
    
    // Store notification info to remove after viewing messages
    sessionStorage.setItem('pendingNotificationId', notification._id);
    sessionStorage.setItem('pendingNotificationMessage', notification.message);
    sessionStorage.setItem('notificationUserId', notification.applicantId || notification.senderId);
  };

const removeNotification = (id) => {
  setNotifications(notifications.filter(n => n._id !== id));
};

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { name: 'Jobs', path: '/poster/jobs', icon: Briefcase },
    { name: 'Applicants', path: '/poster/applicants', icon: Users },
    { name: 'Messages', path: '/poster/messages', icon: MessageSquare },
    { name: 'Payments', path: '/poster/payments', icon: CreditCard },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-secondary-200 sticky top-0 z-50 backdrop-blur-xs bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 lg:h-20 flex justify-between items-center">
        
        {/* Logo Section */}
        <Link to="/poster/jobs" className="flex items-center gap-3 group">
          <img 
            src={logoImg} 
            alt="TimeBank Logo" 
            className="w-10 h-10 lg:w-16 lg:h-16 object-contain transition-transform duration-500 group-hover:rotate-3 group-hover:scale-110" 
          />
          <div className="flex flex-col">
            <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded-full uppercase tracking-wider">
              Poster
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Main Nav Items */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-2 px-3 py-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl font-medium transition-all text-sm"
              >
                <item.icon size={16} />
                <span className="hidden xl:inline">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Notifications */}
          <div className="relative notification-dropdown">
            <button
              onClick={() => {
                console.log('Notification button clicked!');
                setIsNotificationsOpen(!isNotificationsOpen);
              }}
              className="relative p-2 text-secondary-600 hover:text-primary-600 rounded-xl hover:bg-primary-50 transition-all"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-strong border border-secondary-100 py-4 overflow-hidden z-[70] animate-slide-down">
                <div className="px-6 pb-4 border-b border-secondary-100 flex justify-between items-center">
                  <h3 className="font-semibold text-secondary-900 text-sm">Notifications</h3>
                  {unreadCount > 0 && <div className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-lg">NEW</div>}
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-sm text-secondary-500">No notifications yet</p>
                    </div>
                  ) : notifications.map(n => (
                    <div
                      key={n._id}
                      className={`px-6 py-4 border-b border-secondary-50 hover:bg-secondary-50 transition-colors ${!n.read ? 'bg-primary-50/30' : ''}`}
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div 
                          className="flex-1 cursor-pointer hover:bg-secondary-50 p-3 rounded-lg transition-colors"
                          onClick={() => handleNotificationClick(n)}
                        >
                          <p className={`text-sm font-semibold ${!n.read ? 'text-secondary-900' : 'text-secondary-600'}`}>{n.title}</p>
                          <p className="text-xs text-secondary-500 mt-1">{n.message}</p>
                          <p className="text-xs text-secondary-400 mt-2">
                            {new Date(n.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative profile-dropdown">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 hover:bg-primary-200 transition-all"
            >
              <User size={16} />
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-strong border border-secondary-100 py-4 overflow-hidden z-[60] animate-slide-down">
                <div className="px-6 pb-4 border-b border-secondary-100 flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white text-lg font-semibold">
                    {user?.name?.charAt(0).toUpperCase() || 'P'}
                  </div>
                  <div>
                    <p className="font-semibold text-secondary-900">{user?.name || 'Poster'}</p>
                    <p className="text-xs bg-secondary-100 px-2 py-1 rounded-lg font-medium text-secondary-600 mt-1">
                      {user?.email || ''}
                    </p>
                  </div>
                </div>

                <div className="py-2 px-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-3 py-2 text-secondary-600 hover:bg-secondary-50 rounded-xl transition-all"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <User size={16} />
                    <p className="text-sm font-medium">Public Profile</p>
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center gap-3 px-3 py-2 text-secondary-600 hover:bg-secondary-50 rounded-xl transition-all"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <Settings size={16} />
                    <p className="text-sm font-medium">Settings</p>
                  </Link>
                </div>

                <div className="px-4 mt-2 pt-2 border-t border-secondary-100">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 rounded-xl font-medium text-sm hover:bg-red-100 transition-all"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl hover:bg-secondary-50 transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-secondary-200 bg-white animate-slide-down">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary-50 transition-colors text-secondary-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
            
            <div className="border-t border-secondary-200 pt-2 mt-2">
              <Link
                to="/profile"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary-50 transition-colors text-secondary-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User size={20} />
                <span className="font-medium">Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-colors text-red-600 w-full text-left"
              >
                <LogOut size={20} />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default PosterNavbar;