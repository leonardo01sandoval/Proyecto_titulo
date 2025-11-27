/**
 * Servicio de chats
 * Maneja operaciones relacionadas con chats y conversaciones
 */
import apiClient from './apiClient';

const chatService = {
  /**
   * Obtiene todos los chats
   * @returns {Promise} - Promesa con el array de chats
   */
  async getAllChats() {
    try {
      const response = await apiClient.get('/chats/');
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Error al obtener chats'
      );
    }
  },

  /**
   * Obtiene un chat por ID
   * @param {string} chatId - ID del chat
   * @returns {Promise} - Promesa con los datos del chat
   */
  async getChatById(chatId) {
    try {
      const response = await apiClient.get(`/chats/${chatId}/`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Error al obtener el chat'
      );
    }
  },

  /**
   * Obtiene chats con filtros aplicados
   * @param {object} filters - Objeto con filtros a aplicar
   * @returns {Promise} - Promesa con el array de chats filtrados
   */
  async getChatsWithFilters(filters = {}) {
    try {
      const allChats = await this.getAllChats();

      // Aplicar filtros localmente
      let filteredChats = allChats;

      // Filtro por fecha
      if (filters.startDate || filters.endDate) {
        filteredChats = filteredChats.filter((chat) => {
          // Asumimos que el chat tiene mensajes con timestamps
          if (!chat.messages || chat.messages.length === 0) return false;

          const firstMessage = chat.messages[0];
          const timestamp = firstMessage.data?.timestamp;

          if (!timestamp) return false;

          const chatDate = new Date(timestamp * 1000); // Convertir de Unix a Date

          if (filters.startDate && chatDate < new Date(filters.startDate)) {
            return false;
          }

          if (filters.endDate && chatDate > new Date(filters.endDate)) {
            return false;
          }

          return true;
        });
      }

      // Filtro por estado
      if (filters.status) {
        // Este filtro se aplicará después de transformar los datos
        // Por ahora lo dejamos como placeholder
      }

      // Filtro por producto
      if (filters.product) {
        // Este filtro se aplicará después de transformar los datos
      }

      // Búsqueda por texto
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        filteredChats = filteredChats.filter((chat) => {
          const messagesText = chat.messages
            .map((m) => m.data?.content || '')
            .join(' ')
            .toLowerCase();

          return messagesText.includes(searchLower);
        });
      }

      return filteredChats;
    } catch (error) {
      throw error;
    }
  },
};

export default chatService;
