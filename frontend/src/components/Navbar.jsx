import React, { useContext } from 'react'; // Added useContext
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Home } from 'lucide-react';
import { AuthContext } from '../context/AuthContext'; // Ensure this path is correct
import logoImg from './logo.jpeg';

const Navbar = () => {
  const navigate = useNavigate();
  // Pull user and logout directly from your AuthContext
  const { user, logout } = useContext(AuthContext); 

  const handleLogout = () => {
    logout(); // This calls the function in AuthContext which clears storage and state
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 group">
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

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          {/* Use the 'user' object from context to decide what to show */}
          {user ? (
            <>
              <Link to="/" className="text-slate-600 hover:text-emerald-600 font-medium flex items-center gap-2">
                <Home size={18} /> Home
              </Link>
              
              <div className="h-8 w-[1px] bg-slate-200"></div>
              
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-slate-600 hover:text-red-600 font-medium transition-colors"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="text-slate-600 hover:text-slate-900 font-medium">Home</Link>
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