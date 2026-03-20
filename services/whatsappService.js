import axios from "axios";

const API_VERSION = "v21.0";

function hasWhatsappCredentials() {
  return Boolean(process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);
}

export async function sendWhatsappTextMessage(to, text) {
  if (!hasWhatsappCredentials()) {
    return {
      skipped: true,
      reason: "Missing WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID"
    };
  }

  const url = `https://graph.facebook.com/${API_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "text",
    text: { body: text }
  };

  const headers = {
    Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
    "Content-Type": "application/json"
  };

  const { data } = await axios.post(url, payload, { headers, timeout: 15000 });
  return data;
}
