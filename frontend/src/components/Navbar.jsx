import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Home, Menu, X, User, Settings, Bell } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import logoImg from './logo.jpeg';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-secondary-200 sticky top-0 z-50 backdrop-blur-xs bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 lg:h-20 flex justify-between items-center">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src={logoImg} 
            alt="TimeBank Logo" 
            className="w-12 h-12 lg:w-20 lg:h-20 object-contain transition-transform duration-500 group-hover:rotate-3 group-hover:scale-110" 
          />
          <div className="text-xl lg:text-2xl font-black tracking-tight hidden sm:block">
            <span className="text-secondary-900">Time</span>
            <span className="text-primary-600">Bank</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-8">
          {user ? (
            <>
              <Link to="/" className="text-secondary-600 hover:text-primary-600 font-medium flex items-center gap-2 transition-colors">
                <Home size={18} /> Home
              </Link>
              
              <div className="h-8 w-px bg-secondary-200"></div>
              
              {/* User Actions */}
              <div className="flex items-center gap-4">
                <button className="relative p-2 text-secondary-600 hover:text-primary-600 transition-colors">
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-secondary-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User size={16} className="text-primary-600" />
                  </div>
                  <span className="text-secondary-700 font-medium">{user?.name || 'User'}</span>
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-secondary-600 hover:text-red-600 font-medium transition-colors p-2 rounded-xl hover:bg-red-50"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/" className="text-secondary-600 hover:text-secondary-900 font-medium transition-colors">Home</Link>
              <Link to="/login" className="text-secondary-600 hover:text-secondary-900 font-medium transition-colors">Log In</Link>
              <Link 
                to="/register-choice" 
                className="gradient-primary text-white px-6 py-2.5 rounded-xl font-bold hover:shadow-glow transition-all transform hover:-translate-y-0.5"
              >
                Register
              </Link>
            </>
          )}
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
          <div className="px-4 py-4 space-y-3">
            {user ? (
              <>
                <Link 
                  to="/" 
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary-50 transition-colors text-secondary-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Home size={20} /> Home
                </Link>
                
                <Link 
                  to="/profile" 
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary-50 transition-colors text-secondary-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User size={20} /> Profile
                </Link>
                
                <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary-50 transition-colors text-secondary-700 w-full text-left">
                  <Bell size={20} /> Notifications
                  <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                
                <div className="border-t border-secondary-200 pt-3">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-colors text-red-600 w-full text-left"
                  >
                    <LogOut size={20} /> Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/" 
                  className="block p-3 rounded-xl hover:bg-secondary-50 transition-colors text-secondary-700 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/login" 
                  className="block p-3 rounded-xl hover:bg-secondary-50 transition-colors text-secondary-700 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link 
                  to="/register-choice" 
                  className="block gradient-primary text-white p-3 rounded-xl font-bold text-center mt-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;