// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';

export default function ProtectedRoute({ children }) {
  const isAuthenticated = authService.isAuthenticated();

  // Si no hay token, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
