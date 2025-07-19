import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './UserContext';

export function PrivateRoute({ children }) {
  const { user } = useContext(UserContext);
  if (!user) {
    // User NOT logged in → redirect to login
    return <Navigate to="/login" replace />;
  }
  return children;
}

export function PublicRoute({ children }) {
  const { user } = useContext(UserContext);
  if (user) {
    // User logged in → redirect to homepage (or account)
    return <Navigate to="/" replace />;
  }
  return children;
}
