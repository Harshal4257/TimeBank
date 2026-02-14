import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login.jsx';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  // This is a temporary variable. 
  // Later, we will get this from our Backend/Context.
const isAuthenticated = false; 
console.log("User logged in:", isAuthenticated); // This clears the warning

  return (
    <Router>
      <div className="App font-sans bg-slate-50 min-h-screen">
        {/* Navbar stays at the top of every page */}
        <Navbar /> 
        
        <Routes>
          {/* Main Landing Page */}
          <Route path="/" element={<Home />} />
          
          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* User Dashboard - Protected Route (Logic coming soon) */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Fallback: Redirect any unknown URL back to Home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;