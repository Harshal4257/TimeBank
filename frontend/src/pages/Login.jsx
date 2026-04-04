import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Home } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // ✅ Fixed — uses AuthContext, saves credits & _id
const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data } = await API.post('/users/login', { email, password });
      
      // Use AuthContext login to save everything properly
      login(data.user ? { ...data.user, token: data.token } : data);

      const userRole = data.user?.role || 'Seeker';
      if (userRole === 'Seeker') {
        navigate('/seeker-home');
      } else {
        navigate('/poster/dashboard');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed. Check your connection or credentials.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4 font-sans">
      <div className="bg-white rounded-3xl shadow-strong flex flex-col lg:flex-row max-w-6xl w-full overflow-hidden min-h-[700px] animate-scale-in">

        {/* Left Side: Enhanced Illustration */}
        <div className="lg:w-1/2 bg-gradient-to-br from-primary-100 to-secondary-100 p-12 flex flex-col justify-center items-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-primary-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-secondary-500 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10 text-center space-y-8">
            <svg className="w-80 lg:w-96" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Person */}
              <circle cx="200" cy="80" r="40" fill="#059669" opacity="0.9"/>
              <rect x="160" y="130" width="80" height="90" rx="20" fill="#059669" opacity="0.9"/>
              {/* Arms */}
              <rect x="110" y="135" width="55" height="20" rx="10" fill="#059669" opacity="0.7"/>
              <rect x="235" y="135" width="55" height="20" rx="10" fill="#059669" opacity="0.7"/>
              {/* Legs */}
              <rect x="165" y="210" width="25" height="60" rx="10" fill="#047857"/>
              <rect x="210" y="210" width="25" height="60" rx="10" fill="#047857"/>
              {/* Briefcase */}
              <rect x="255" y="145" width="50" height="40" rx="8" fill="#34d399"/>
              <rect x="265" y="138" width="30" height="12" rx="4" fill="#34d399"/>
              <line x1="280" y1="145" x2="280" y2="185" stroke="#059669" strokeWidth="2"/>
              {/* Background circles */}
              <circle cx="80" cy="200" r="40" fill="#d1fae5" opacity="0.5"/>
              <circle cx="320" cy="100" r="30" fill="#d1fae5" opacity="0.5"/>
              <circle cx="350" cy="250" r="20" fill="#a7f3d0" opacity="0.4"/>
              {/* Clock icon - TimeBank theme */}
              <circle cx="80" cy="80" r="35" fill="#ecfdf5" stroke="#059669" strokeWidth="3"/>
              <line x1="80" y1="80" x2="80" y2="58" stroke="#059669" strokeWidth="3" strokeLinecap="round"/>
              <line x1="80" y1="80" x2="95" y2="88" stroke="#059669" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="80" cy="80" r="4" fill="#059669"/>
            </svg>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-secondary-800">Welcome Back!</h2>
              <p className="text-lg text-secondary-600 max-w-sm mx-auto">
                Collaborative work just got easier for community members!
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-secondary-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span>Secure Login</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span>Quick Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Enhanced Form */}
        <div className="lg:w-1/2 p-12 lg:p-16 flex flex-col justify-center">
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h1 className="text-4xl font-black text-secondary-900">Log In</h1>
                <Link
                  to="/"
                  className="flex items-center gap-2 px-4 py-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium"
                >
                  <Home size={18} />
                  Home
                </Link>
              </div>
              <p className="text-secondary-600">Enter your credentials to access your account</p>
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="input-field pl-12"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="input-field pl-12 pr-12"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full gradient-primary text-white p-4 rounded-xl font-bold hover:shadow-glow transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="text-center space-y-2">
              <p className="text-secondary-600">
                Don't have an account?
                <Link
                  to="/register-choice"
                  className="text-primary-600 font-bold ml-2 hover:text-primary-700 transition-colors"
                >
                  Get Started Free
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;