const BUSINESS_CONTEXT = `
Eres el asistente virtual de Redes Balcony, empresa que fabrica e instala redes de seguridad para balcones, ventanas y escaleras.
Tu objetivo es:
1) Saludar y entender la necesidad del cliente.
2) Pedir datos mínimos para cotizar: ciudad/zona, tipo de abertura, medidas aproximadas y cuándo lo necesita.
3) Responder de forma breve, amable y clara en español.
4) Si falta información, pedirla de forma ordenada.
`;

function detectIntent(text) {
  const normalized = text.toLowerCase();

  if (/hola|buenas|buen día|buenos días|buenas tardes|buenas noches/.test(normalized)) {
    return "greeting";
  }

  if (/precio|cotiz|valor|cu[aá]nto sale|presupuesto/.test(normalized)) {
    return "quote_request";
  }

  if (/gracias|muchas gracias/.test(normalized)) {
    return "thanks";
  }

  if (/urgente|ya|hoy|mañana/.test(normalized)) {
    return "urgency";
  }

  return "general";
}

function buildReply(intent, text) {
  switch (intent) {
    case "greeting":
      return "¡Hola! 👋 Soy el asistente de Redes Balcony. Te ayudo con tu cotización. ¿Para qué espacio necesitás red (balcón, ventana o escalera)?";
    case "quote_request":
      return "¡Perfecto! Para cotizarte rápido necesito 3 datos: 1) zona o ciudad, 2) tipo de abertura (balcón/ventana/escalera), 3) medidas aproximadas (ancho x alto).";
    case "urgency":
      return "Entiendo que lo necesitás pronto ✅. Pasame zona, tipo de abertura y medidas aproximadas para priorizar tu cotización.";
    case "thanks":
      return "¡De nada! 😊 Cuando quieras, te ayudo a avanzar con la cotización.";
    default:
      return `Gracias por escribirnos. Para ayudarte mejor con "${text}", contame por favor: zona, tipo de abertura y medidas aproximadas.`;
  }
}

export function generateAgentReply(text) {
  const cleanText = (text ?? "").trim();

  if (!cleanText) {
    return "¡Hola! Soy el asistente de Redes Balcony. Contame qué necesitás proteger y te ayudo a cotizar.";
  }

  const intent = detectIntent(cleanText);
  const reply = buildReply(intent, cleanText);

  return `${reply}\n\n—\n${BUSINESS_CONTEXT.trim().split("\n")[0]}`;
}
