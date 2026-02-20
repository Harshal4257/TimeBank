import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Layout Components
import Navbar from './components/Navbar';
import PosterNavbar from './components/PosterNavbar';
import RegisterChoice from './pages/RegisterChoice';
// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PostTask from './pages/PostTask'; 
import Marketplace from './pages/Marketplace'; 
import SeekerHomePage from './pages/SeekerHomePage';
import PosterDashboard from './pages/PosterDashboard';
import PosterJobDetail from './pages/PosterJobDetail';

function AppContent() {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('token');
  
  // Determine user context based on URL path
  const isPosterRoute = location.pathname.startsWith('/poster');
  const isSeekerRoute = location.pathname.startsWith('/seeker') || location.pathname.startsWith('/seekerdashboard');

  // This function ensures only ONE Navbar (or none) is rendered
  const renderNavbar = () => {
    if (isPosterRoute && isAuthenticated) {
      return <PosterNavbar />;
    }
    // If you have a specific SeekerNavbar, return it here. 
    // Otherwise, this prevents the main Navbar from showing on seeker pages if they have their own.
    if (isSeekerRoute) {
      return null; 
    }
    // Default Navbar for Home, Login, Register, etc.
    return <Navbar />;
  };

  return (
    <div className="App font-sans bg-slate-50 min-h-screen">
      {renderNavbar()}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-choice" element={<RegisterChoice />} /> 

        {/* Unified Dashboard Route */}
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
        />

        {/* Specialized Seeker Routes */}
        <Route 
          path="/seekerdashboard" 
          element={isAuthenticated ? <SeekerHomePage /> : <Navigate to="/login" />} 
        /> 
        <Route 
          path="/seeker-home" 
          element={isAuthenticated ? <SeekerHomePage /> : <Navigate to="/login" />} 
        />
        
        {/* POSTER ROUTES */}
        <Route 
          path="/poster/dashboard" 
          element={isAuthenticated ? <PosterDashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/poster/jobs" 
          element={isAuthenticated ? <PosterDashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/poster/applicants" 
          element={isAuthenticated ? <PosterDashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/poster/messages" 
          element={isAuthenticated ? <PosterDashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/poster/payments" 
          element={isAuthenticated ? <PosterDashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/poster/reports" 
          element={isAuthenticated ? <PosterDashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/poster/post-job" 
          element={isAuthenticated ? <PostTask /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/poster/job/:jobId" 
          element={isAuthenticated ? <PosterJobDetail /> : <Navigate to="/login" />} 
        />
        
        <Route path="/post-task" element={<PostTask />} />
        <Route path="/marketplace" element={<Marketplace />} />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;