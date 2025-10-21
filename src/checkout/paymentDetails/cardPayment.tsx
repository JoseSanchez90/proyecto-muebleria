import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CardPayment({
  total,
}: {
  total: number;
  onPayment: () => Promise<void>;
}) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [loading, setLoading] = useState(false);

  const formatCardNumber = (v: string) =>
    v
      .replace(/\s+/g, "")
      .replace(/[^\d]/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim();

  const handlePayment = async () => {
    if (!cardNumber || !expiryDate || !cvv || !cardName) {
      alert("Completa todos los campos antes de continuar.");
      return;
    }

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

      <Input
        value={cardNumber}
        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
        placeholder="1234 5678 9012 3456"
        maxLength={19}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          placeholder="MM/AA"
          maxLength={5}
        />
        <Input
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          placeholder="CVV"
          type="password"
          maxLength={3}
        />
      </div>
      <Input
        value={cardName}
        onChange={(e) => setCardName(e.target.value.toUpperCase())}
        placeholder="JUAN PEREZ GARCIA"
      />

      <Button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white"
      >
        {loading ? "Procesando..." : `Pagar S/ ${total.toFixed(2)}`}
      </Button>
    </div>
  );
}
