import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role'); // Simplified to 'role'
    const email = localStorage.getItem('email');

    if (token) {
      setUser({ token, role, email });
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    // Standardize your keys!
    localStorage.setItem('token', userData.token);
    localStorage.setItem('role', userData.role);
    localStorage.setItem('email', userData.email);
    setUser({
      token: userData.token,
      role: userData.role,
      email: userData.email
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    setUser(null);
    // Optional: window.location.href = "/login"; // Force a clean slate
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};