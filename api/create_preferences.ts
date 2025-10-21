// /api/create_preferences.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método no permitido" });
    return;
  }

  try {
    const { items, payer } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: "No se proporcionaron ítems válidos" });
      return;
    }

    // ⚠️ Usa tus variables REALES de entorno
    const accessToken = process.env.VITE_MERCADOPAGO_ACCESS_TOKEN;
    const frontendUrl =
      process.env.FRONTEND_URL || "https://munfort.vercel.app";

    if (!accessToken) {
      res.status(500).json({ error: "Falta token de acceso" });
      return;
    }

    // Estructura esperada por Mercado Pago
    const preference = {
      items,
      payer,
      back_urls: {
        success: `${frontendUrl}/checkout/success`,
        failure: `${frontendUrl}/checkout/failure`,
        pending: `${frontendUrl}/checkout/pending`,
      },
      auto_return: "approved",
    };

    console.log("Enviando a Mercado Pago:", preference);

    const mpResponse = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(preference),
      }
    );

    const data = await mpResponse.json();
    console.log("Respuesta de Mercado Pago:", data);

    if (!data.init_point) {
      res.status(500).json({
        error: "Error al crear preferencia en Mercado Pago",
        detalle: data,
      });
      return;
    }

    res.status(200).json({
      init_point: data.init_point,
      preference_id: data.id,
    });
  } catch (error) {
    console.error("Error general en endpoint:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
