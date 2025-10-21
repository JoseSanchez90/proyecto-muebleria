import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function CardPayment({
  total,
}: {
  total: number;
  onPayment: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {

    try {
      setLoading(true);

      const items = [
        { title: "Pedido Mueblería Munfort", quantity: 1, unit_price: total },
      ];

      const res = await fetch(
        "https://munfort.vercel.app/api/create_preferences",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        }
      );

      const data = await res.json();

      if (!data.init_point) {
        alert("Error creando preferencia en Mercado Pago");
        return;
      }

      window.location.href = data.init_point;
    } catch (err) {
      console.error(err);
      alert("Error al iniciar el pago con Mercado Pago.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-lg text-center">Pago con Tarjeta</h4>

      <Button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white cursor-pointer"
      >
        {loading ? "Procesando..." : `Pagar S/ ${total.toFixed(2)}`}
      </Button>
    </div>
  );
}
