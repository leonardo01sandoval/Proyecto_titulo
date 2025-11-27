/**
 * Servicio de autenticación
 * Maneja login, logout y estado de autenticación
 */
import apiClient from './apiClient';

const authService = {
  /**
   * Realiza login del usuario
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   * @returns {Promise} - Promesa con el token
   */
  async login(username, password) {
    try {
      const response = await apiClient.post('/api-token-auth/', {
        username,
        password,
      });

      const { token } = response.data;

      if (token) {
        // Guardar token en localStorage
        localStorage.setItem('authToken', token);
        return { success: true, token };
      }

      return { success: false, message: 'No se recibió token' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.non_field_errors?.[0] || 'Error al iniciar sesión',
      };
    }
  },

  /**
   * Cierra sesión del usuario
   */
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  /**
   * Obtiene el token del usuario actual
   * @returns {string|null} - Token de autenticación
   */
  getToken() {
    return localStorage.getItem('authToken');
  },

  /**
   * Verifica si el usuario está autenticado
   * @returns {boolean} - True si está autenticado
   */
  isAuthenticated() {
    const token = this.getToken();
    return !!token;
  },

  /**
   * Obtiene el usuario almacenado en localStorage
   * @returns {object|null} - Datos del usuario
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        return null;
      }
    }
    return null;
  },

  /**
   * Guarda los datos del usuario en localStorage
   * @param {object} user - Datos del usuario
   */
  setCurrentUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  },
};

export default authService;
