import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, Bell } from 'lucide-react';
import logoImg from './logo.jpeg';

const Navbar = () => {
  const navigate = useNavigate();

  // Switch this to false to see the Log In / Register buttons
  const isLoggedIn = false; 

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
     {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 group">
          {/* 1. INCREASED IMAGE SIZE (w-12 h-12 = 48px) */}
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

        {/* Links */}
        <div className="flex items-center gap-8">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="text-slate-600 hover:text-emerald-600 font-medium flex items-center gap-2">
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <button className="text-slate-400 hover:text-slate-600 relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="h-8 w-[1px] bg-slate-200"></div>
              <button 
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 text-slate-600 hover:text-red-600 font-medium"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              {/* Added Log In and Register with your color style */}
              <Link to="/login" className="text-slate-600 hover:text-slate-900 font-medium">Log In</Link>
              <Link 
                to="/register-choice" 
                className="bg-[#2D3339] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-black transition-all"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;