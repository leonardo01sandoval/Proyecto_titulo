/**
 * Utilidades de análisis para chats
 * Agrupa, analiza y genera métricas avanzadas
 */
import { format, startOfDay, startOfWeek, startOfMonth, isWithinInterval } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Agrupa chats por período (día, semana, mes)
 * @param {Array} chats - Array de chats transformados
 * @param {string} period - 'day', 'week', 'month'
 * @returns {Array} - Array de objetos con fecha y métricas
 */
export const groupChatsByPeriod = (chats, period = 'day') => {
  if (!Array.isArray(chats) || chats.length === 0) return [];

  const groupedData = {};

  chats.forEach((chat) => {
    let periodKey;
    const chatDate = new Date(chat.date);

    switch (period) {
      case 'week':
        periodKey = format(startOfWeek(chatDate, { locale: es }), 'yyyy-MM-dd');
        break;
      case 'month':
        periodKey = format(startOfMonth(chatDate), 'yyyy-MM');
        break;
      case 'day':
      default:
        periodKey = format(startOfDay(chatDate), 'yyyy-MM-dd');
        break;
    }

    if (!groupedData[periodKey]) {
      groupedData[periodKey] = {
        date: periodKey,
        count: 0,
        open: 0,
        won: 0,
        lost: 0,
        pending: 0,
      };
    }

    groupedData[periodKey].count += 1;
    groupedData[periodKey][chat.status.toLowerCase()] =
      (groupedData[periodKey][chat.status.toLowerCase()] || 0) + 1;
  });

  // Convertir a array y ordenar por fecha
  return Object.values(groupedData).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
};

/**
 * Analiza las menciones de productos en los chats
 * @param {Array} chats - Array de chats transformados
 * @returns {Array} - Array de productos con estadísticas
 */
export const analyzeProductMentions = (chats) => {
  if (!Array.isArray(chats) || chats.length === 0) return [];

  const productStats = {};

  chats.forEach((chat) => {
    chat.products.forEach((product) => {
      if (!productStats[product]) {
        productStats[product] = {
          name: product,
          mentions: 0,
          conversations: 0,
          won: 0,
          lost: 0,
          open: 0,
          pending: 0,
        };
      }

      productStats[product].mentions += 1;
      productStats[product].conversations += 1;
      productStats[product][chat.status.toLowerCase()] =
        (productStats[product][chat.status.toLowerCase()] || 0) + 1;
    });
  });

  // Convertir a array, calcular tasa de conversión y ordenar
  return Object.values(productStats)
    .map((product) => ({
      ...product,
      conversionRate:
        product.conversations > 0
          ? Math.round((product.won / product.conversations) * 100 * 10) / 10
          : 0,
    }))
    .sort((a, b) => b.mentions - a.mentions);
};

/**
 * Analiza los horarios de las conversaciones
 * @param {Array} chats - Array de chats transformados
 * @returns {Array} - Array de horarios con cantidad de chats
 */
export const analyzeConversationHours = (chats) => {
  if (!Array.isArray(chats) || chats.length === 0) return [];

  const hourCounts = Array(24).fill(0).map((_, hour) => ({
    hour: `${hour.toString().padStart(2, '0')}:00`,
    count: 0,
  }));

  chats.forEach((chat) => {
    const hour = new Date(chat.date).getHours();
    hourCounts[hour].count += 1;
  });

  return hourCounts;
};

/**
 * Obtiene los horarios pico (con más conversaciones)
 * @param {Array} chats - Array de chats transformados
 * @param {number} topN - Cantidad de horarios a retornar
 * @returns {Array} - Array de horarios pico
 */
export const getPeakHours = (chats, topN = 5) => {
  const hourCounts = analyzeConversationHours(chats);

  return hourCounts
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
};

/**
 * Analiza el rendimiento por día de la semana
 * @param {Array} chats - Array de chats transformados
 * @returns {Array} - Array con métricas por día de la semana
 */
export const analyzeByDayOfWeek = (chats) => {
  if (!Array.isArray(chats) || chats.length === 0) return [];

  const dayNames = [
    'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
  ];

  const dayCounts = dayNames.map((name, index) => ({
    day: name,
    dayIndex: index,
    count: 0,
    won: 0,
    lost: 0,
  }));

  chats.forEach((chat) => {
    const dayIndex = new Date(chat.date).getDay();
    dayCounts[dayIndex].count += 1;

    if (chat.status === 'GANADA') dayCounts[dayIndex].won += 1;
    if (chat.status === 'PERDIDA') dayCounts[dayIndex].lost += 1;
  });

  return dayCounts;
};

/**
 * Calcula el crecimiento comparando dos períodos
 * @param {Array} currentPeriodChats - Chats del período actual
 * @param {Array} previousPeriodChats - Chats del período anterior
 * @returns {Object} - Objeto con métricas de crecimiento
 */
export const calculateGrowth = (currentPeriodChats, previousPeriodChats) => {
  const current = currentPeriodChats.length;
  const previous = previousPeriodChats.length;

  const growth = previous > 0 ? ((current - previous) / previous) * 100 : 0;

  return {
    current,
    previous,
    growth: Math.round(growth * 10) / 10,
    isPositive: growth >= 0,
  };
};

/**
 * Filtra chats por rango de fechas
 * @param {Array} chats - Array de chats transformados
 * @param {Date} startDate - Fecha de inicio
 * @param {Date} endDate - Fecha de fin
 * @returns {Array} - Chats filtrados
 */
export const filterChatsByDateRange = (chats, startDate, endDate) => {
  if (!Array.isArray(chats) || !startDate || !endDate) return chats;

  return chats.filter((chat) => {
    return isWithinInterval(chat.date, { start: startDate, end: endDate });
  });
};

/**
 * Obtiene estadísticas de clientes
 * @param {Array} chats - Array de chats transformados
 * @returns {Array} - Array de clientes con estadísticas
 */
export const analyzeClients = (chats) => {
  if (!Array.isArray(chats) || chats.length === 0) return [];

  const clientStats = {};

  chats.forEach((chat) => {
    const key = chat.clientPhone || chat.clientName;

    if (!clientStats[key]) {
      clientStats[key] = {
        phone: chat.clientPhone,
        name: chat.clientName,
        conversationCount: 0,
        lastInteraction: chat.date,
        products: new Set(),
        won: 0,
        lost: 0,
        open: 0,
        pending: 0,
      };
    }

    clientStats[key].conversationCount += 1;
    clientStats[key][chat.status.toLowerCase()] += 1;

    // Actualizar última interacción si es más reciente
    if (chat.date > clientStats[key].lastInteraction) {
      clientStats[key].lastInteraction = chat.date;
    }

    // Agregar productos consultados
    chat.products.forEach((product) => {
      clientStats[key].products.add(product);
    });
  });

  // Convertir a array y transformar productos Set a Array
  return Object.values(clientStats)
    .map((client) => ({
      ...client,
      products: Array.from(client.products),
    }))
    .sort((a, b) => b.conversationCount - a.conversationCount);
};

/**
 * Obtiene métricas de comparación entre períodos
 * @param {Array} currentChats - Chats actuales
 * @param {Array} previousChats - Chats anteriores
 * @returns {Object} - Objeto con comparaciones
 */
export const comparePeriodsKPIs = (currentChats, previousChats) => {
  const calculateChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100 * 10) / 10;
  };

  const currentTotal = currentChats.length;
  const previousTotal = previousChats.length;

  const currentWon = currentChats.filter((c) => c.status === 'GANADA').length;
  const previousWon = previousChats.filter((c) => c.status === 'GANADA').length;

  const currentOpen = currentChats.filter((c) => c.status === 'ABIERTA').length;
  const previousOpen = previousChats.filter((c) => c.status === 'ABIERTA').length;

  return {
    totalChange: calculateChange(currentTotal, previousTotal),
    wonChange: calculateChange(currentWon, previousWon),
    openChange: calculateChange(currentOpen, previousOpen),
  };
};
