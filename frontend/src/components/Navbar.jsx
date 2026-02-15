import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, PlusCircle, ShoppingBag, Home, User } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
          <Layout className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-black text-slate-800 uppercase tracking-tighter">TimeBank</span>
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-1 text-slate-600 hover:text-emerald-600 font-semibold transition-colors">
          <Home className="w-4 h-4" /> Home
        </Link>
        
        {token && (
          <>
            <Link to="/marketplace" className="flex items-center gap-1 text-slate-600 hover:text-emerald-600 font-semibold transition-colors">
              <ShoppingBag className="w-4 h-4" /> Marketplace
            </Link>
            <Link to="/post-task" className="flex items-center gap-1 text-slate-600 hover:text-emerald-600 font-semibold transition-colors">
              <PlusCircle className="w-4 h-4" /> Post Task
            </Link>
            <Link to="/dashboard" className="flex items-center gap-1 text-slate-600 hover:text-emerald-600 font-semibold transition-colors">
              <User className="w-4 h-4" /> Dashboard
            </Link>
          </>
        )}

        {/* Auth Button */}
        {token ? (
          <button 
            onClick={handleLogout}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-2xl font-bold hover:bg-black transition-all shadow-md shadow-slate-200"
          >
            Logout
          </button>
        ) : (
          <Link 
            to="/login" 
            className="bg-emerald-500 text-white px-6 py-2.5 rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;