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
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import SeekerHomePage from './pages/SeekerHomePage';
import PosterDashboard from './pages/PosterDashboard';
import PosterJobDetail from './pages/PosterJobDetail';
import SeekerJobDetail from './pages/SeekerJobDetail';
import PosterApplicants from './pages/PosterApplicants';
import Profile from './pages/Profile';
import SeekerProfile from './pages/SeekerProfile';
import PosterProfile from './pages/PosterProfile';
import PostJob from './pages/PostJob';
import PostTask from './pages/PostTask';
import SeekerApplications from './pages/SeekerApplications';
import Messages from './pages/Messages';
import SavedJobs from './pages/SavedJobs';
import MyReviews from './pages/MyReviews';
import Settings from './pages/Settings';
import Help from './pages/Help';
import Privacy from './pages/Privacy';
import PosterPayments from './pages/PosterPayments';
import PosterReports from './pages/PosterReports';
import PosterPostJob from './pages/PosterPostJob';
import SeekerNavbar from './components/SeekerNavbar';

function AppContent() {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('token');

  // Determine user context based on URL path
  const isPosterRoute = location.pathname.startsWith('/poster');
  const isSeekerRoute = location.pathname.startsWith('/seeker') ||
    location.pathname.startsWith('/seekerdashboard') ||
    location.pathname.startsWith('/my-applications') ||
    location.pathname.startsWith('/jobs/') ||
    location.pathname.startsWith('/profile');

  // This function ensures only ONE Navbar (or none) is rendered
  const renderNavbar = () => {
    // Pages that shouldn't have any navigation (like landing/auth might have the main Navbar)
    const noNavbarPaths = ['/login', '/register', '/register-choice'];
    if (noNavbarPaths.includes(location.pathname)) return null;

    if (isAuthenticated) {
      const role = localStorage.getItem('role');
      if (role === 'Poster' || isPosterRoute) {
        return <PosterNavbar />;
      }
      return <SeekerNavbar />;
    }
    // Default Navbar for Home
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
        <Route path="/forgot-password" element={<ForgotPassword />} />

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
        <Route
          path="/my-applications"
          element={isAuthenticated ? <SeekerApplications /> : <Navigate to="/login" />}
        />
        <Route
          path="/seeker/profile/:userId?"
          element={isAuthenticated ? <SeekerProfile /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile/:userId?"
          element={isAuthenticated ? <SeekerProfile /> : <Navigate to="/login" />}
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
          element={isAuthenticated ? <PosterApplicants /> : <Navigate to="/login" />}
        />
        <Route
          path="/poster/messages"
          element={isAuthenticated ? <Messages /> : <Navigate to="/login" />}
        />
        <Route
          path="/poster/payments"
          element={isAuthenticated ? <PosterPayments /> : <Navigate to="/login" />}
        />
        <Route
          path="/poster/reports"
          element={isAuthenticated ? <PosterReports /> : <Navigate to="/login" />}
        />
        <Route
          path="/poster/post-job"
          element={isAuthenticated ? <PosterPostJob /> : <Navigate to="/login" />}
        />
        <Route
          path="/poster/job/:jobId"
          element={isAuthenticated ? <PosterJobDetail /> : <Navigate to="/login" />}
        />
        <Route
          path="/poster/job/:id/edit"
          element={isAuthenticated ? <PosterPostJob /> : <Navigate to="/login" />}
        />
        <Route
          path="/poster/profile/:userId?"
          element={isAuthenticated ? <PosterProfile /> : <Navigate to="/login" />}
        />

        <Route path="/post-task" element={<PostTask />} />
        <Route path="/marketplace" element={<Marketplace />} />

        {/* Seeker Job Detail */}
        <Route
          path="/seeker/job/:jobId"
          element={isAuthenticated ? <SeekerJobDetail /> : <Navigate to="/login" />}
        />
        <Route
          path="/jobs/:jobId"
          element={isAuthenticated ? <SeekerJobDetail /> : <Navigate to="/login" />}
        />

        {/* Common Authenticated Routes */}
        <Route path="/messages" element={isAuthenticated ? <Messages /> : <Navigate to="/login" />} />
        <Route path="/saved-jobs" element={isAuthenticated ? <SavedJobs /> : <Navigate to="/login" />} />
        <Route path="/my-reviews" element={isAuthenticated ? <MyReviews /> : <Navigate to="/login" />} />
        <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />
        <Route path="/help" element={isAuthenticated ? <Help /> : <Navigate to="/login" />} />
        <Route path="/privacy" element={isAuthenticated ? <Privacy /> : <Navigate to="/login" />} />

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