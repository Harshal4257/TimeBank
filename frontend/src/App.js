import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Layout Components (eager loaded - needed immediately)
import Navbar from './components/Navbar';
import PosterNavbar from './components/PosterNavbar';
import SeekerNavbar from './components/SeekerNavbar';
import RegisterChoice from './pages/RegisterChoice';

// Lazy load all pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const SeekerHomePage = lazy(() => import('./pages/SeekerHomePage'));
const PosterDashboard = lazy(() => import('./pages/PosterDashboard'));
const PosterJobDetail = lazy(() => import('./pages/PosterJobDetail'));
const EditJob = lazy(() => import('./pages/EditJob'));
const SeekerJobDetail = lazy(() => import('./pages/SeekerJobDetail'));
const PosterApplicants = lazy(() => import('./pages/PosterApplicants'));
const Profile = lazy(() => import('./pages/Profile'));
const SeekerProfile = lazy(() => import('./pages/SeekerProfile'));
const PosterProfile = lazy(() => import('./pages/PosterProfile'));
const PostJob = lazy(() => import('./pages/PostJob'));
const PostTask = lazy(() => import('./pages/PostTask'));
const SeekerApplications = lazy(() => import('./pages/SeekerApplications'));
const Messages = lazy(() => import('./pages/Messages'));
const SavedJobs = lazy(() => import('./pages/SavedJobs'));
const MyReviews = lazy(() => import('./pages/MyReviews'));
const Settings = lazy(() => import('./pages/Settings'));
const Help = lazy(() => import('./pages/Help'));
const Privacy = lazy(() => import('./pages/Privacy'));
const PosterPayments = lazy(() => import('./pages/PosterPayments'));
const PosterReports = lazy(() => import('./pages/PosterReports'));
const PosterPostJob = lazy(() => import('./pages/PosterPostJob'));

// Page loader
const PageLoader = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      <p className="text-slate-500 font-medium">Loading...</p>
    </div>
  </div>
);

function AppContent() {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('token');

  const isPosterRoute = location.pathname.startsWith('/poster');
  const isSeekerRoute = location.pathname.startsWith('/seeker') ||
    location.pathname.startsWith('/seekerdashboard') ||
    location.pathname.startsWith('/my-applications') ||
    location.pathname.startsWith('/jobs/') ||
    location.pathname.startsWith('/profile');

  const renderNavbar = () => {
    const noNavbarPaths = ['/login', '/register', '/register-choice'];
    if (noNavbarPaths.includes(location.pathname)) return null;

    if (isAuthenticated) {
      const role = localStorage.getItem('role');
      if (role === 'Poster' || isPosterRoute) {
        return <PosterNavbar />;
      }
      return <SeekerNavbar />;
    }
    return <Navbar />;
  };

  return (
    <div className="App font-sans bg-slate-50 min-h-screen">
      {renderNavbar()}
      <Suspense fallback={<PageLoader />}>
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
          <Route
            path="/poster/applicants"
            element={isAuthenticated ? <PosterApplicants /> : <Navigate to="/login" />}
          />
          <Route
            path="/poster/applicants/:applicantId"
            element={isAuthenticated ? <PosterApplicants /> : <Navigate to="/login" />}
          />
          <Route
            path="/poster/applicants/:applicantId/:jobId"
            element={isAuthenticated ? <PosterApplicants /> : <Navigate to="/login" />}
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
            path="/poster/job/:jobId/edit"
            element={isAuthenticated ? <EditJob /> : <Navigate to="/login" />}
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
      </Suspense>
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