import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const email = localStorage.getItem('email');
    const name = localStorage.getItem('name');
    const credits = localStorage.getItem('credits');
    const userId = localStorage.getItem('userId');

    if (token) {
      setUser({ token, role, email, name, credits: Number(credits) || 0, userId });
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('role', userData.role);
    localStorage.setItem('email', userData.email);
    localStorage.setItem('name', userData.name || userData.firstName || userData.username || '');
    localStorage.setItem('credits', userData.credits || 0);
    localStorage.setItem('userId', userData._id || userData.userId || '');
    setUser({
      token: userData.token,
      role: userData.role,
      email: userData.email,
      name: userData.name || userData.firstName || userData.username || '',
      credits: userData.credits || 0,
      userId: userData._id || userData.userId || ''
    });
  };

  // ✅ Call this after profile save to keep navbar name in sync
  const updateUser = (updates) => {
    if (updates.name !== undefined) localStorage.setItem('name', updates.name);
    if (updates.email !== undefined) localStorage.setItem('email', updates.email);
    if (updates.credits !== undefined) localStorage.setItem('credits', updates.credits);
    setUser(prev => ({ ...prev, ...updates }));
  };

  const updateCredits = (newCredits) => {
    localStorage.setItem('credits', newCredits);
    setUser(prev => ({ ...prev, credits: newCredits }));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    localStorage.removeItem('credits');
    localStorage.removeItem('userId');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user, updateCredits, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};