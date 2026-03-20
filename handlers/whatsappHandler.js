import { generateAgentReply } from "../services/aiAgentService.js";
import { sendWhatsappTextMessage } from "../services/whatsappService.js";

function extractWhatsappMessage(body) {
  const value = body?.entry?.[0]?.changes?.[0]?.value;
  const message = value?.messages?.[0];

  if (!message) {
    return null;
  }

  const from = message.from;
  const text = message?.text?.body ?? "";

  return { from, text };
}

async function processIncomingText(from, text) {
  const reply = generateAgentReply(text);

  if (from) {
    await sendWhatsappTextMessage(from, reply);
  }

  return reply;
}

function verifyWebhook(req, res) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
}

async function receiveMessage(req, res) {
  try {
    const extracted = extractWhatsappMessage(req.body);

    if (!extracted) {
      return res.status(200).json({ ok: true, ignored: true });
    }

    const { from, text } = extracted;
    const reply = await processIncomingText(from, text);

    return res.status(200).json({ ok: true, from, text, reply });
  } catch (error) {
    console.error("Error handling WhatsApp webhook:", error.message);
    return res.status(500).json({ ok: false, error: error.message });
  }
}

export default {
  verifyWebhook,
  receiveMessage,
  processIncomingText
};
