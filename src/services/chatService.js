/**
 * Servicio de chats
 * Maneja operaciones relacionadas con chats y conversaciones
 */
import apiClient from './apiClient';

const chatService = {
  /**
   * Obtiene todas las conversaciones de chat
   * @returns {Promise<Array>} Array de conversaciones
   */
  async getAllChats() {
    try {
      const response = await apiClient.get('/chats/');
      return response.data; // Ya es un array de conversaciones
    } catch (error) {
      console.error('Error fetching chats:', error);
      throw error;
    }
  },
};

export default chatService;
