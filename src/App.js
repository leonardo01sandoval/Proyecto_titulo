// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import Layout from './components/Layout';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import ExecutiveDashboard from './components/dashboards/ExecutiveDashboard';
import { Chats } from './components/Chats';
import { ListadoCliente } from './components/ListadoCliente';
import UserProfile from './components/UserProfile';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<ExecutiveDashboard />} />
            <Route path="chats" element={<Chats />} />
            <Route path="clientes" element={<ListadoCliente />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  );
}

