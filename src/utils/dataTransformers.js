/**
 * Utilidades para transformar datos de chats
 * Extrae y procesa información de los mensajes
 */

/**
 * Parsea el contenido de un mensaje humano
 * Formato: "Fono: XXX | Nombre: XXX | Mensaje: XXX"
 */
export const parseHumanMessage = (content) => {
  const phoneMatch = content.match(/Fono:\s*(\d+)/);
  const nameMatch = content.match(/Nombre:\s*([^|]+)/);
  const messageMatch = content.match(/Mensaje:\s*(.+)/);

  return {
    phone: phoneMatch ? phoneMatch[1].trim() : '',
    name: nameMatch ? nameMatch[1].trim() : '',
    message: messageMatch ? messageMatch[1].trim() : content,
  };
};

/**
 * Extrae herramientas usadas de un mensaje AI
 * Busca el patrón [Used tools: ...]
 */
export const extractToolsUsed = (content) => {
  const toolsMatch = content.match(/\[Used tools:\s*([^\]]+)\]/);

  if (toolsMatch) {
    const toolsText = toolsMatch[1];
    const tools = [];

    // Extraer herramientas del formato "Tool: Knowledge-base, Input: ..."
    const toolMatches = toolsText.matchAll(/Tool:\s*([^,]+)/g);

    for (const match of toolMatches) {
      tools.push(match[1].trim());
    }

    return tools;
  }

  return [];
};

/**
 * Extrae productos mencionados de un mensaje AI
 * Busca nombres de marcas y productos comunes
 */
export const extractProductsMentioned = (content) => {
  const products = [];

  // Lista de marcas y productos comunes (puede expandirse)
  const commonBrands = [
    'Leviton', 'Schneider', 'ABB', 'Siemens', 'General Electric', 'GE',
    'Legrand', 'Eaton', 'Philips', 'Osram', 'Sylvania', 'Hubbell',
  ];

  commonBrands.forEach((brand) => {
    const regex = new RegExp(brand, 'gi');
    if (regex.test(content)) {
      if (!products.includes(brand)) {
        products.push(brand);
      }
    }
  });

  return products;
};

/**
 * Clasifica el estado de una conversación basándose en el contenido
 */
export const classifyConversationStatus = (messages) => {
  if (!messages || messages.length === 0) return 'PENDIENTE';

  // Obtener el último mensaje
  const lastMessage = messages[messages.length - 1];
  const lastMessageContent = lastMessage.data?.content?.toLowerCase() || '';

  // Si solo hay mensaje del usuario sin respuesta
  if (messages.length === 1 && lastMessage.type === 'human') {
    return 'ABIERTA';
  }

  // Palabras clave para GANADA
  const winKeywords = [
    'comprar', 'compra', 'acepto', 'proceder', 'cotización', 'cotizacion',
    'precio', 'cuánto cuesta', 'cuanto cuesta', 'enviar', 'pedido',
    'confirmar', 'si', 'gracias', 'perfecto', 'ok', 'vale', 'orden'
  ];

  // Palabras clave para PERDIDA
  const lostKeywords = [
    'no gracias', 'no me interesa', 'muy caro', 'caro', 'no necesito',
    'no quiero', 'cancelar', 'después', 'otro día', 'no ahora'
  ];

  // Verificar palabras clave en el último mensaje
  const hasWinKeyword = winKeywords.some(keyword => lastMessageContent.includes(keyword));
  const hasLostKeyword = lostKeywords.some(keyword => lastMessageContent.includes(keyword));

  if (hasWinKeyword) return 'GANADA';
  if (hasLostKeyword) return 'PERDIDA';

  // Si hay intercambio activo pero no conclusión clara
  if (messages.length > 2) return 'ABIERTA';

  return 'PENDIENTE';
};

/**
 * Transforma un chat individual con toda su información procesada
 */
export const transformSingleChat = (chat, index) => {
  const { sessionID, messages } = chat;

  if (!messages || messages.length === 0) {
    return null;
  }

  // Obtener primer mensaje (humano) y extraer información
  const firstHumanMessage = messages.find((m) => m.type === 'human');
  const humanInfo = firstHumanMessage
    ? parseHumanMessage(firstHumanMessage.data?.content || '')
    : { phone: '', name: '', message: '' };

  // Obtener timestamp del primer mensaje
  const timestamp = messages[0].data?.timestamp || Date.now() / 1000;
  const date = new Date(timestamp * 1000);

  // Obtener último mensaje
  const lastMessage = messages[messages.length - 1];
  const lastTimestamp = lastMessage.data?.timestamp || timestamp;

  // Calcular duración de la conversación
  const duration = lastTimestamp - timestamp; // en segundos

  // Extraer productos mencionados de mensajes AI
  const allProducts = [];
  const allTools = [];

  messages
    .filter((m) => m.type === 'ai')
    .forEach((m) => {
      const content = m.data?.content || '';
      const products = extractProductsMentioned(content);
      const tools = extractToolsUsed(content);

      products.forEach((p) => {
        if (!allProducts.includes(p)) allProducts.push(p);
      });

      tools.forEach((t) => {
        if (!allTools.includes(t)) allTools.push(t);
      });
    });

  // Clasificar estado
  const status = classifyConversationStatus(messages);

  return {
    id: sessionID || `chat-${index}`,
    sessionID,
    clientName: humanInfo.name || 'Desconocido',
    clientPhone: humanInfo.phone || 'Sin teléfono',
    initialMessage: humanInfo.message,
    date,
    timestamp,
    lastTimestamp,
    duration,
    messageCount: messages.length,
    status,
    products: allProducts,
    tools: allTools,
    messages, // Mantener mensajes originales para vista detallada
  };
};

/**
 * Transforma un array de chats
 */
export const transformChatData = (chats) => {
  if (!Array.isArray(chats)) return [];

  return chats
    .map((chat, index) => transformSingleChat(chat, index))
    .filter((chat) => chat !== null);
};

/**
 * Calcula KPIs generales de los chats
 */
export const calculateKPIs = (transformedChats) => {
  if (!Array.isArray(transformedChats) || transformedChats.length === 0) {
    return {
      totalConversations: 0,
      openConversations: 0,
      wonConversations: 0,
      lostConversations: 0,
      pendingConversations: 0,
      averageResponseTime: 0,
      conversionRate: 0,
      topProducts: [],
      totalUniqueClients: 0,
    };
  }

  const statusCounts = {
    ABIERTA: 0,
    GANADA: 0,
    PERDIDA: 0,
    PENDIENTE: 0,
  };

  let totalDuration = 0;
  const productCounts = {};
  const uniquePhones = new Set();

  transformedChats.forEach((chat) => {
    statusCounts[chat.status] = (statusCounts[chat.status] || 0) + 1;
    totalDuration += chat.duration;

    // Contar productos
    chat.products.forEach((product) => {
      productCounts[product] = (productCounts[product] || 0) + 1;
    });

    // Clientes únicos
    if (chat.clientPhone) {
      uniquePhones.add(chat.clientPhone);
    }
  });

  // Calcular productos más mencionados
  const topProducts = Object.entries(productCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([product, count]) => ({ product, count }));

  // Tiempo promedio de respuesta (en minutos)
  const averageResponseTime = totalDuration / transformedChats.length / 60;

  // Tasa de conversión
  const conversionRate = transformedChats.length > 0
    ? (statusCounts.GANADA / transformedChats.length) * 100
    : 0;

  return {
    totalConversations: transformedChats.length,
    openConversations: statusCounts.ABIERTA,
    wonConversations: statusCounts.GANADA,
    lostConversations: statusCounts.PERDIDA,
    pendingConversations: statusCounts.PENDIENTE,
    averageResponseTime: Math.round(averageResponseTime * 10) / 10,
    conversionRate: Math.round(conversionRate * 10) / 10,
    topProducts,
    totalUniqueClients: uniquePhones.size,
  };
};

/**
 * Obtiene métricas de conversación
 */
export const getConversationMetrics = (transformedChats) => {
  if (!Array.isArray(transformedChats) || transformedChats.length === 0) {
    return {
      averageMessagesPerConversation: 0,
      averageDuration: 0,
      abandonmentRate: 0,
      topTopics: [],
    };
  }

  const totalMessages = transformedChats.reduce(
    (sum, chat) => sum + chat.messageCount,
    0
  );
  const totalDuration = transformedChats.reduce(
    (sum, chat) => sum + chat.duration,
    0
  );

  const pendingCount = transformedChats.filter(
    (c) => c.status === 'PENDIENTE'
  ).length;

  return {
    averageMessagesPerConversation: Math.round(
      (totalMessages / transformedChats.length) * 10
    ) / 10,
    averageDuration: Math.round((totalDuration / transformedChats.length / 60) * 10) / 10,
    abandonmentRate: Math.round((pendingCount / transformedChats.length) * 100 * 10) / 10,
  };
};
