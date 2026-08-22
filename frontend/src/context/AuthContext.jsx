import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      setUser({ token });
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const login = (userData, jwtToken, refreshToken) => {
    localStorage.setItem('token', jwtToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    setToken(jwtToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
