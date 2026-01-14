import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute component that requires authentication
 * Optionally can require a specific role
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check role if required
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate homepage based on actual role
    const redirectPath = user.role === 'student' ? '/student' : '/prof';
    return <Navigate to={redirectPath} replace />;
  }

  // Authenticated and authorized
  return children;
}
