import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simple demo - just show success
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4 font-sans">
        <div className="bg-white rounded-3xl shadow-strong p-12 max-w-md w-full">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-secondary-900">Request Received!</h2>
              <p className="text-secondary-600">
                We've received your password reset request.<br />
                Contact support for assistance.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/login')}
                className="w-full gradient-primary text-white p-4 rounded-xl font-bold hover:shadow-glow transition-all duration-300"
              >
                Back to Login
              </button>
              
              <Link
                to="/register-choice"
                className="block text-center text-primary-600 font-medium hover:text-primary-700 transition-colors"
              >
                Don't have an account? Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4 font-sans">
      <div className="bg-white rounded-3xl shadow-strong p-12 max-w-md w-full">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-secondary-600 hover:text-secondary-800 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
            
            <h1 className="text-4xl font-black text-secondary-900">Forgot Password?</h1>
            <p className="text-secondary-600">
              Contact support for password reset assistance.
            </p>
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

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full gradient-primary text-white p-4 rounded-xl font-bold hover:shadow-glow transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </button>
          </form>

          {/* Info Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-600">
              <strong>Note:</strong> Password reset functionality is not currently available. Please contact our support team for assistance.
            </p>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-secondary-600">
              Don't have an account?
              <Link
                to="/register-choice"
                className="text-primary-600 font-bold ml-2 hover:text-primary-700 transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
