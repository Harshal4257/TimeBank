import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// Import the AuthProvider you just created
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Wrap App with AuthProvider to share login state globally */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);