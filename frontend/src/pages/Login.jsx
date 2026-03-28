import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
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
            <img
              src="https://illustrations.popsy.co/gray/manager.svg"
              alt="Login Illustration"
              className="w-80 lg:w-96 animate-float"
            />
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
              <h1 className="text-4xl font-black text-secondary-900">Log In</h1>
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