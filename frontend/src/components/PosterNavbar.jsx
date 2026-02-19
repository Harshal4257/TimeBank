import React, { useState, useContext } from 'react'; // Added useContext
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Ensure this path is correct
import { 
  BarChart3, 
  Briefcase, 
  Users, 
  MessageSquare, 
  CreditCard, 
  LogOut, 
  User,
  Menu,
  X
} from 'lucide-react';

const PosterNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useContext(AuthContext); // Get logout function
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/poster/dashboard', icon: BarChart3 },
    { name: 'My Jobs', path: '/poster/jobs', icon: Briefcase },
    { name: 'Applicants', path: '/poster/applicants', icon: Users },
    { name: 'Messages', path: '/poster/messages', icon: MessageSquare },
    { name: 'Payments', path: '/poster/payments', icon: CreditCard },
    { name: 'Reports', path: '/poster/reports', icon: BarChart3 }
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
        </div>
        
        {/* Right Section / Profile & Logout */}
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
             </div>
             <span className="hidden lg:block text-sm font-semibold text-slate-700">Account</span>
           </div>

           {/* ADDED LOGOUT BUTTON */}
           <button 
             onClick={handleLogout}
             className="flex items-center gap-2 text-slate-500 hover:text-red-600 font-bold text-sm transition-all border-l pl-6 ml-2"
           >
             <LogOut size={18} />
             <span>Sign Out</span>
           </button>
        </div>
      </div>
    </nav>
  );
};

export default PosterNavbar;