import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Shield, CheckCircle } from 'lucide-react';

const ResetPasswordQuestions = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [answers, setAnswers] = useState({
    petName: '',
    birthCity: '',
    firstSchool: ''
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Mock user database (in real app, this would be in backend)
  const users = {
    'john@example.com': {
      securityAnswers: {
        petName: 'buddy',
        birthCity: 'new york',
        firstSchool: 'lincoln high'
      }
    },
    'sarah@example.com': {
      securityAnswers: {
        petName: 'max',
        birthCity: 'los angeles',
        firstSchool: 'washington elementary'
      }
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!users[email]) {
      setError('Email not found in our system');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSecuritySubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate verification
    setTimeout(() => {
      const userAnswers = users[email]?.securityAnswers;
      const isCorrect = 
        answers.petName.toLowerCase() === userAnswers.petName &&
        answers.birthCity.toLowerCase() === userAnswers.birthCity &&
        answers.firstSchool.toLowerCase() === userAnswers.firstSchool;
      
      if (isCorrect) {
        setStep(3);
        setError('');
      } else {
        setError('One or more answers are incorrect');
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
    
    // Simulate password update
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
        <Shield className="w-12 h-12 text-primary-600 mx-auto" />
        <h2 className="text-2xl font-bold text-secondary-900">Reset Password</h2>
        <p className="text-secondary-600">Enter your email to start the password reset process</p>
      </div>

      <form onSubmit={handleEmailSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter your email"
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
          Continue
        </button>
      </form>

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
        <Shield className="w-12 h-12 text-primary-600 mx-auto" />
        <h2 className="text-2xl font-bold text-secondary-900">Security Questions</h2>
        <p className="text-secondary-600">Answer these questions to verify your identity</p>
      </div>

      <form onSubmit={handleSecuritySubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">What was your first pet's name?</label>
          <input
            type="text"
            value={answers.petName}
            onChange={(e) => setAnswers({...answers, petName: e.target.value})}
            className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter pet name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">What city were you born in?</label>
          <input
            type="text"
            value={answers.birthCity}
            onChange={(e) => setAnswers({...answers, birthCity: e.target.value})}
            className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter city name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">What was your first school's name?</label>
          <input
            type="text"
            value={answers.firstSchool}
            onChange={(e) => setAnswers({...answers, firstSchool: e.target.value})}
            className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter school name"
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
            {isLoading ? 'Verifying...' : 'Verify Answers'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Shield className="w-12 h-12 text-primary-600 mx-auto" />
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

export default ResetPasswordQuestions;
