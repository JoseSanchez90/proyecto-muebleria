import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import handler from "./api/create_preferences.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL }));

app.post("/api/create_preferences", async (req, res) => {
  try {
    const accessToken = process.env.MP_ACCESS_TOKEN_TEST;

    if (!accessToken) {
      console.error("No se encontró el access token de Mercado Pago.");
      return res.status(500).json({ error: "Missing Mercado Pago Access Token" });
    }

    // 👇 Aseguramos que FRONTEND_URL exista
    const frontendUrl = process.env.FRONTEND_URL;

    const preference = {
      items: req.body.items,
      back_urls: {
        success: `${frontendUrl}/checkout/success`,
        failure: `${frontendUrl}/checkout/failure`,
        pending: `${frontendUrl}/checkout/pending`,
      },
      auto_return: "approved",
    };

    console.log("Enviando a Mercado Pago:", preference);

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(preference),
    });

    const data = await response.json();
    console.log("Respuesta de Mercado Pago:", data);

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json({ init_point: data.init_point });
  } catch (error) {
    console.error("Error en /api/create_preferences:", error);
    return res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log("Servidor corriendo en http://localhost:3001");
});
