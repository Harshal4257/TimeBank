import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MessageSquare, CheckCircle } from 'lucide-react';

const ResetPasswordAdmin = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedMethod) {
      setError('Please select a contact method');
      return;
    }
    
    if (message.trim().length < 10) {
      setError('Please provide more details in your message');
      return;
    }
    
    setError('');
    setIsSubmitted(true);
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
              <h2 className="text-3xl font-black text-secondary-900">Request Submitted!</h2>
              <p className="text-secondary-600">
                Your password reset request has been sent to our admin team.<br />
                We'll contact you within 24 hours.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-600">
                <strong>What happens next?</strong><br />
                • Admin will review your request<br />
                • You'll be contacted via {selectedMethod}<br />
                • Password will be reset manually<br />
                • You'll receive new login details
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/login')}
                className="w-full gradient-primary text-white p-4 rounded-xl font-bold hover:shadow-glow transition-all"
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
            
            <h1 className="text-4xl font-black text-secondary-900">Reset Password</h1>
            <p className="text-secondary-600">
              Contact our admin team to reset your password. We'll help you get back into your account quickly.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary-900">Choose Contact Method</h3>
            
            <div className="space-y-3">
              <label className="flex items-center p-4 border-2 border-secondary-200 rounded-xl cursor-pointer hover:border-primary-500 transition-colors">
                <input
                  type="radio"
                  name="contactMethod"
                  value="email"
                  checked={selectedMethod === 'email'}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="mr-3"
                />
                <Mail className="w-5 h-5 text-primary-600 mr-3" />
                <div>
                  <div className="font-medium text-secondary-900">Email</div>
                  <div className="text-sm text-secondary-600">admin@timebank.com</div>
                </div>
              </label>

              <label className="flex items-center p-4 border-2 border-secondary-200 rounded-xl cursor-pointer hover:border-primary-500 transition-colors">
                <input
                  type="radio"
                  name="contactMethod"
                  value="phone"
                  checked={selectedMethod === 'phone'}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="mr-3"
                />
                <Phone className="w-5 h-5 text-primary-600 mr-3" />
                <div>
                  <div className="font-medium text-secondary-900">Phone</div>
                  <div className="text-sm text-secondary-600">+1 (555) 123-4567</div>
                </div>
              </label>

              <label className="flex items-center p-4 border-2 border-secondary-200 rounded-xl cursor-pointer hover:border-primary-500 transition-colors">
                <input
                  type="radio"
                  name="contactMethod"
                  value="chat"
                  checked={selectedMethod === 'chat'}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="mr-3"
                />
                <MessageSquare className="w-5 h-5 text-primary-600 mr-3" />
                <div>
                  <div className="font-medium text-secondary-900">Live Chat</div>
                  <div className="text-sm text-secondary-600">Available 9 AM - 6 PM</div>
                </div>
              </label>
            </div>
          </div>

          {/* Message Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">Your Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={4}
                placeholder="Please describe your issue and provide your registered email address or username..."
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full gradient-primary text-white p-4 rounded-xl font-bold hover:shadow-glow transition-all"
            >
              Submit Request
            </button>
          </form>

          {/* Info Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h4 className="font-medium text-amber-800 mb-2">Important Information:</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Response time: Within 24 hours</li>
              <li>• We'll verify your identity before resetting</li>
              <li>• You may need to provide additional verification</li>
              <li>• This is a manual process for security reasons</li>
            </ul>
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

export default ResetPasswordAdmin;
