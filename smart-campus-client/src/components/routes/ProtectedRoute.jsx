import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { initializing, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (initializing) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/"
        replace
        state={{
          authMessage: 'Please log in first',
          scrollToLogin: true,
          from: location.pathname,
        }}
      />
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return (
      <Navigate
        to="/"
        replace
        state={{
          authMessage: 'You do not have permission to access this page',
          from: location.pathname,
        }}
      />
    );
  }

  return children;
};

export default ProtectedRoute;
