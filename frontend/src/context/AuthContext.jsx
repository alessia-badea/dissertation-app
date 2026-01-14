import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authAPI from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const currentUser = await authAPI.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.error('Auth check failed:', err);
      // Don't block the app if auth check fails
      setUser(null);
    } finally {
      // Always set loading to false to prevent grey screen
      setLoading(false);
    }
  };

  const loginUser = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.login(email, password);
      setUser(response.user);
      return { success: true, user: response.user };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const registerUser = async (email, password, name, role) => {
    try {
      setError(null);
      const response = await authAPI.register(email, password, name, role);
      // After registration, log the user in
      const loginResponse = await authAPI.login(email, password);
      setUser(loginResponse.user);
      return { success: true, user: loginResponse.user };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const logoutUser = async () => {
    try {
      setError(null);
      await authAPI.logout();
      setUser(null);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      setError(null);
      const response = await authAPI.updateProfile(profileData);
      setUser(response.user);
      return { success: true, user: response.user };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const changeUserPassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      await authAPI.changePassword(currentPassword, newPassword);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const value = {
    user,
    loading,
    error,
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
    updateProfile: updateUserProfile,
    changePassword: changeUserPassword,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
