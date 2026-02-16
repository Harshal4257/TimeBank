import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout Components
import Navbar from './components/Navbar';
import RegisterChoice from './pages/RegisterChoice';
// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PostTask from './pages/PostTask'; 
import Marketplace from './pages/Marketplace'; 
import SeekerDashboard from './pages/SeekerDashboard';

function App() {
  const isAuthenticated = !!localStorage.getItem('token'); 
  
  return (
    <Router>
      <div className="App font-sans bg-slate-50 min-h-screen">
        {/* Navbar will now show on every page and can access localStorage for the profile menu */}
        <Navbar /> 
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-choice" element={<RegisterChoice />} /> 

          {/* Unified Dashboard Route */}
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? (
                // This will use the combined logic we wrote earlier to show Seeker or Poster view
                <Dashboard /> 
              ) : (
                <Navigate to="/login" />
              )
            } 
          />

          {/* Specialized Seeker Route (if you prefer a direct path) */}
          <Route path="/seekerdashboard" element={<SeekerDashboard />} /> 
          
          <Route path="/post-task" element={<PostTask />} />
          <Route path="/marketplace" element={<Marketplace />} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;