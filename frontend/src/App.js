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
  
  // Routes that should NOT show the main Navbar
  const noNavbarRoutes = ['/seeker-home', '/seekerdashboard'];
  const posterRoutes = ['/poster/dashboard', '/poster/job', '/poster/jobs', '/poster/applicants', '/poster/messages', '/poster/payments', '/poster/reports'];
  
  // Show navbar only on routes that are NOT seeker or poster routes
  const shouldShowNavbar = !noNavbarRoutes.includes(location.pathname) && !posterRoutes.includes(location.pathname);
  
  return (
    <div className="App font-sans bg-slate-50 min-h-screen">
      {/* Show appropriate navbar based on route */}
      {shouldShowNavbar && <Navbar />}
      {posterRoutes.includes(location.pathname) && <PosterNavbar />}
      
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
              <Dashboard /> 
            ) : (
              <Navigate to="/login" />
            )
          } 
        />

        {/* Specialized Seeker Route - redirect to seeker home page */}
        <Route 
          path="/seekerdashboard" 
          element={
            isAuthenticated ? (
              <SeekerHomePage />
            ) : (
              <Navigate to="/login" />
            )
          } 
        /> 
        
        {/* Seeker Home Page with Matching Jobs */}
        <Route 
          path="/seeker-home" 
          element={
            isAuthenticated ? (
              <SeekerHomePage />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        
        {/* Poster Routes */}
        <Route 
          path="/poster/dashboard" 
          element={
            isAuthenticated ? (
              <PosterDashboard />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        <Route 
          path="/poster/job/:jobId" 
          element={
            isAuthenticated ? (
              <PosterJobDetail />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        
        <Route path="/post-task" element={<PostTask />} />
        <Route path="/marketplace" element={<Marketplace />} />
        
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