import express from "express";
import dotenv from "dotenv";
import whatsappHandler from "./handlers/whatsappHandler.js";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Redes Balcony Bot activo ✅");
});

app.get("/webhook", whatsappHandler.verifyWebhook);
app.post("/webhook", whatsappHandler.receiveMessage);

// Endpoint opcional para probar en navegador o Postman sin WhatsApp real
app.post("/test-message", async (req, res) => {
  try {
    const { from = "test-user", text = "" } = req.body;
    const response = await whatsappHandler.processIncomingText(from, text);
    res.json({ ok: true, response });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});