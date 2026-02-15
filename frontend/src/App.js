import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
// ADD THESE IMPORTS TO FIX THE WHITE SCREEN:
import PostTask from './pages/PostTask'; 
import Marketplace from './pages/Marketplace'; 

function App() {
  // Check if token exists in localStorage to determine authentication
  const isAuthenticated = !!localStorage.getItem('token'); 
  console.log("User logged in:", isAuthenticated);

  return (
    <Router>
      <div className="App font-sans bg-slate-50 min-h-screen">
        <Navbar /> 
        
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/post-task" element={<PostTask />} />
          <Route path="/marketplace" element={<Marketplace />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;