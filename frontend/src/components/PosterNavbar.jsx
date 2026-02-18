import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Briefcase, 
  Users, 
  MessageSquare, 
  CreditCard, 
  Bell, 
  Settings, 
  LogOut, 
  User,
  Menu,
  X
} from 'lucide-react';

const PosterNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      name: 'Dashboard',
      path: '/poster/dashboard',
      icon: BarChart3
    },
    {
      name: 'My Jobs',
      path: '/poster/jobs',
      icon: Briefcase
    },
    {
      name: 'Applicants',
      path: '/poster/applicants',
      icon: Users
    },
    {
      name: 'Messages',
      path: '/poster/messages',
      icon: MessageSquare
    },
    {
      name: 'Payments',
      path: '/poster/payments',
      icon: CreditCard
    },
    {
      name: 'Reports',
      path: '/poster/reports',
      icon: BarChart3
    }
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="text-2xl font-black tracking-tight">
            <span className="text-slate-900">Time</span>
            <span className="text-emerald-600">Bank</span>
          </div>
          <span className="text-sm text-slate-500 font-medium">Poster</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-medium"
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors">
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <Link
                to="/poster/profile"
                className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Settings size={16} />
                Profile Settings
              </Link>
              <hr className="border-slate-200" />
              <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors text-left">
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-slate-600 hover:text-slate-800"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200">
          <div className="px-6 py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-slate-600 hover:bg-slate-50"
              >
                <item.icon size={20} />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default PosterNavbar;
