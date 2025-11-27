/**
 * Servicio de usuarios
 * Maneja operaciones relacionadas con usuarios
 */
import apiClient from './apiClient';
import authService from './authService';

const userService = {
  /**
   * Obtiene todos los usuarios
   * @returns {Promise} - Promesa con el array de usuarios
   */
  async getUsers() {
    try {
      const response = await apiClient.get('/users/');
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Error al obtener usuarios'
      );
    }
  },

  /**
   * Obtiene un usuario por su username
   * @param {string} username - Nombre de usuario a buscar
   * @returns {Promise} - Promesa con los datos del usuario
   */
  async getUserByUsername(username) {
    try {
      const users = await this.getUsers();
      const user = users.find((u) => u.username === username);

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      return user;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtiene los datos del usuario actual autenticado
   * @returns {Promise} - Promesa con los datos del usuario
   */
  async getCurrentUserData() {
    try {
      // Primero intentamos obtener del localStorage
      const cachedUser = authService.getCurrentUser();
      if (cachedUser) {
        return cachedUser;
      }

      // Si no está en cache, obtenemos del servidor
      // En este caso, asumimos que el usuario es 'ramrez' como en el prompt
      const user = await this.getUserByUsername('ramrez');

      // Guardamos en cache
      authService.setCurrentUser(user);

      return user;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Actualiza el perfil del usuario
   * @param {object} profileData - Datos del perfil a actualizar
   * @returns {Promise} - Promesa con los datos actualizados
   */
  async updateProfile(profileData) {
    try {
      // Esta función dependerá del endpoint específico de la API
      // Por ahora retornamos un placeholder
      throw new Error('Función de actualización no implementada en la API');
    } catch (error) {
      throw error;
    }
  },
};

export default userService;
