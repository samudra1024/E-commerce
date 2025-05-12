import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../config/axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from sessionStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // Set default axios authorization header
        axiosInstance.defaults.headers.common['Authorization'] = parsedUser.token;
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.post('/api/users/', userData);
      
      if (res.data) {
        localStorage.setItem('user', JSON.stringify(res.data));
        setUser(res.data);
        // Set default axios authorization header
        axiosInstance.defaults.headers.common['Authorization'] = res.data.token;
      }
      return res.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.post('/api/users/login', { email, password });
      
      if (res.data) {
        localStorage.setItem('user', JSON.stringify(res.data));
        setUser(res.data);
        // Set default axios authorization header
        axiosInstance.defaults.headers.common['Authorization'] = res.data.token;
      }
      return res.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    // Remove axios authorization header
    delete axiosInstance.defaults.headers.common['Authorization'];
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return user !== null && user.token !== undefined;
  };

  // Check if user is admin
  const isAdmin = () => {
    return user && user.isAdmin;
  };

  // Get auth token
  const getToken = () => {
    return user?.token;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        isAuthenticated,
        isAdmin,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;