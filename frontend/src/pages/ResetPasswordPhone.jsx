import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Phone, CheckCircle } from 'lucide-react';

const ResetPasswordPhone = () => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Mock verification code (in real app, this would be sent via SMS)
  const mockCode = '123456';

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleVerificationSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      if (verificationCode === mockCode) {
        setStep(3);
        setError('');
      } else {
        setError('Invalid verification code');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setStep(4);
      setError('');
      setIsLoading(false);
    }, 1000);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Phone className="w-12 h-12 text-primary-600 mx-auto" />
        <h2 className="text-2xl font-bold text-secondary-900">Reset Password</h2>
        <p className="text-secondary-600">Enter your phone number to receive a verification code</p>
      </div>

      <form onSubmit={handlePhoneSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Phone Number</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="+1 (555) 123-4567"
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
          Send Verification Code
        </button>
      </form>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
        <p className="text-xs text-blue-600">
          <strong>Demo:</strong> Enter any phone number, then use code <strong>123456</strong> to verify.
        </p>
      </div>

      <div className="text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-secondary-600 hover:text-secondary-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Phone className="w-12 h-12 text-primary-600 mx-auto" />
        <h2 className="text-2xl font-bold text-secondary-900">Enter Verification Code</h2>
        <p className="text-secondary-600">We've sent a 6-digit code to {phoneNumber}</p>
      </div>

      <form onSubmit={handleVerificationSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Verification Code</label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-2xl tracking-widest"
            placeholder="000000"
            maxLength={6}
            required
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex-1 border border-secondary-300 text-secondary-700 p-4 rounded-xl font-bold hover:bg-secondary-50 transition-all"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 gradient-primary text-white p-4 rounded-xl font-bold hover:shadow-glow transition-all disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </button>
        </div>
      </form>

      <div className="text-center">
        <button
          onClick={() => alert('Code resent! (Demo)')}
          className="text-primary-600 font-medium hover:text-primary-700 transition-colors"
        >
          Resend Code
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Phone className="w-12 h-12 text-primary-600 mx-auto" />
        <h2 className="text-2xl font-bold text-secondary-900">Set New Password</h2>
        <p className="text-secondary-600">Enter your new password</p>
      </div>

      <form onSubmit={handlePasswordReset} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter new password"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Confirm new password"
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
          disabled={isLoading}
          className="w-full gradient-primary text-white p-4 rounded-xl font-bold hover:shadow-glow transition-all disabled:opacity-50"
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );

  const renderStep4 = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-secondary-900">Password Reset!</h2>
        <p className="text-secondary-600">
          Your password has been successfully reset.<br />
          You can now login with your new password.
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => navigate('/login')}
          className="w-full gradient-primary text-white p-4 rounded-xl font-bold hover:shadow-glow transition-all"
        >
          Go to Login
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4 font-sans">
      <div className="bg-white rounded-3xl shadow-strong p-12 max-w-md w-full">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </div>
    </div>
  );
};

export default ResetPasswordPhone;
