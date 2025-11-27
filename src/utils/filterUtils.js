/**
 * Utilidades de filtrado para chats
 * Aplica diferentes filtros a los datos
 */
import { isWithinInterval, subDays, startOfDay, endOfDay } from 'date-fns';

/**
 * Aplica múltiples filtros a un array de chats
 * @param {Array} chats - Array de chats transformados
 * @param {Object} filters - Objeto con filtros a aplicar
 * @returns {Array} - Array de chats filtrados
 */
export const applyFilters = (chats, filters = {}) => {
  if (!Array.isArray(chats)) return [];

  let filteredChats = [...chats];

  // Filtro por rango de fechas
  if (filters.startDate || filters.endDate) {
    filteredChats = filterByDateRange(
      filteredChats,
      filters.startDate,
      filters.endDate
    );
  }

  // Filtro por preset de fecha (hoy, ayer, 7 días, etc.)
  if (filters.datePreset) {
    filteredChats = filterByDatePreset(filteredChats, filters.datePreset);
  }

  // Filtro por estado
  if (filters.status && filters.status !== 'TODAS') {
    filteredChats = filterByStatus(filteredChats, filters.status);
  }

  // Filtro por producto
  if (filters.product) {
    filteredChats = filterByProduct(filteredChats, filters.product);
  }

  // Filtro por cliente (nombre o teléfono)
  if (filters.client) {
    filteredChats = filterByClient(filteredChats, filters.client);
  }

  // Búsqueda por texto en mensajes
  if (filters.searchText) {
    filteredChats = filterBySearchText(filteredChats, filters.searchText);
  }

  return filteredChats;
};

/**
 * Filtra chats por rango de fechas
 */
export const filterByDateRange = (chats, startDate, endDate) => {
  if (!startDate && !endDate) return chats;

  const start = startDate ? startOfDay(new Date(startDate)) : null;
  const end = endDate ? endOfDay(new Date(endDate)) : null;

  return chats.filter((chat) => {
    const chatDate = new Date(chat.date);

    if (start && end) {
      return isWithinInterval(chatDate, { start, end });
    } else if (start) {
      return chatDate >= start;
    } else if (end) {
      return chatDate <= end;
    }

    return true;
  });
};

/**
 * Filtra chats por preset de fecha
 */
export const filterByDatePreset = (chats, preset) => {
  const now = new Date();
  let startDate;

  switch (preset) {
    case 'today':
      startDate = startOfDay(now);
      break;
    case 'yesterday':
      startDate = startOfDay(subDays(now, 1));
      return filterByDateRange(chats, startDate, endOfDay(subDays(now, 1)));
    case '7days':
      startDate = startOfDay(subDays(now, 7));
      break;
    case '30days':
      startDate = startOfDay(subDays(now, 30));
      break;
    case '90days':
      startDate = startOfDay(subDays(now, 90));
      break;
    default:
      return chats;
  }

  return filterByDateRange(chats, startDate, endOfDay(now));
};

/**
 * Filtra chats por estado
 */
export const filterByStatus = (chats, status) => {
  if (!status || status === 'TODAS') return chats;

  return chats.filter((chat) => chat.status === status);
};

/**
 * Filtra chats por producto mencionado
 */
export const filterByProduct = (chats, product) => {
  if (!product) return chats;

  const productLower = product.toLowerCase();

  return chats.filter((chat) => {
    return chat.products.some((p) => p.toLowerCase().includes(productLower));
  });
};

/**
 * Filtra chats por cliente (nombre o teléfono)
 */
export const filterByClient = (chats, client) => {
  if (!client) return chats;

  const clientLower = client.toLowerCase();

  return chats.filter((chat) => {
    const nameLower = (chat.clientName || '').toLowerCase();
    const phoneLower = (chat.clientPhone || '').toLowerCase();

    return nameLower.includes(clientLower) || phoneLower.includes(clientLower);
  });
};

/**
 * Filtra chats por texto en los mensajes
 */
export const filterBySearchText = (chats, searchText) => {
  if (!searchText) return chats;

  const searchLower = searchText.toLowerCase();

  return chats.filter((chat) => {
    // Buscar en nombre del cliente
    if ((chat.clientName || '').toLowerCase().includes(searchLower)) {
      return true;
    }

    // Buscar en teléfono
    if ((chat.clientPhone || '').toLowerCase().includes(searchLower)) {
      return true;
    }

    // Buscar en mensaje inicial
    if ((chat.initialMessage || '').toLowerCase().includes(searchLower)) {
      return true;
    }

    // Buscar en productos
    if (chat.products.some((p) => p.toLowerCase().includes(searchLower))) {
      return true;
    }

    // Buscar en todos los mensajes
    if (chat.messages) {
      return chat.messages.some((message) => {
        const content = (message.data?.content || '').toLowerCase();
        return content.includes(searchLower);
      });
    }

    return false;
  });
};

/**
 * Obtiene filtros activos en formato legible
 */
export const getActiveFiltersDescription = (filters) => {
  const active = [];

  if (filters.datePreset) {
    const presetNames = {
      today: 'Hoy',
      yesterday: 'Ayer',
      '7days': 'Últimos 7 días',
      '30days': 'Últimos 30 días',
      '90days': 'Últimos 90 días',
    };
    active.push(presetNames[filters.datePreset] || filters.datePreset);
  }

  if (filters.startDate && filters.endDate) {
    active.push(`Rango: ${filters.startDate} - ${filters.endDate}`);
  } else if (filters.startDate) {
    active.push(`Desde: ${filters.startDate}`);
  } else if (filters.endDate) {
    active.push(`Hasta: ${filters.endDate}`);
  }

  if (filters.status && filters.status !== 'TODAS') {
    active.push(`Estado: ${filters.status}`);
  }

  if (filters.product) {
    active.push(`Producto: ${filters.product}`);
  }

  if (filters.client) {
    active.push(`Cliente: ${filters.client}`);
  }

  if (filters.searchText) {
    active.push(`Búsqueda: "${filters.searchText}"`);
  }

  return active;
};

/**
 * Verifica si hay filtros activos
 */
export const hasActiveFilters = (filters) => {
  if (!filters) return false;

  return !!(
    filters.datePreset ||
    filters.startDate ||
    filters.endDate ||
    (filters.status && filters.status !== 'TODAS') ||
    filters.product ||
    filters.client ||
    filters.searchText
  );
};

/**
 * Limpia todos los filtros
 */
export const clearFilters = () => {
  return {
    datePreset: '',
    startDate: null,
    endDate: null,
    status: 'TODAS',
    product: '',
    client: '',
    searchText: '',
  };
};
