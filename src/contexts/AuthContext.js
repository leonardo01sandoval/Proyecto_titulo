// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un token y usuario guardados
    const initAuth = async () => {
      const token = authService.getToken();

      if (token) {
        try {
          // Obtener usuario desde localStorage
          const userData = authService.getCurrentUser();
          if (userData) {
            setCurrentUser(userData);
          }
        } catch (error) {
          // Si hay error, limpiar token inválido
          authService.logout();
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const result = await authService.login(username, password);

      if (result.success) {
        // Obtener datos del usuario desde localStorage (guardados por authService)
        const userData = authService.getCurrentUser();
        setCurrentUser(userData);
        return { success: true };
      }

      return result;
    } catch (error) {
      return { success: false, error: 'Error al iniciar sesión' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    authService.logout();
  };

  const updatePassword = async (currentPassword, newPassword) => {
    // Esta función dependerá de si la API tiene un endpoint para cambiar contraseña
    return { success: false, error: 'Función no implementada en la API' };
  };

  const resetPassword = async (email, newPassword) => {
    // Esta función dependerá de si la API tiene un endpoint para resetear contraseña
    return { success: false, error: 'Función no implementada en la API' };
  };

  const value = {
    currentUser,
    login,
    logout,
    updatePassword,
    resetPassword,
    isAuthenticated: authService.isAuthenticated(),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
