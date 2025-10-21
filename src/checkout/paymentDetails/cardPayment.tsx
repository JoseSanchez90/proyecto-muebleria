// components/payments/CardPaymentForm.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import { formatPrice } from "@/utils/formatters";

interface CardPaymentProps {
  total: number;
  onPayment: () => Promise<void>;
  isProcessing?: boolean;
}

export default function CardPayment({
  total,
  onPayment,
  isProcessing = false,
}: CardPaymentProps) {
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;

    // Formatear número de tarjeta con espacios cada 4 dígitos
    if (field === "number") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19);
    }

    // Formatear fecha de expiración (MM/YY)
    if (field === "expiry") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2")
        .slice(0, 5);
    }

    // Limitar CVV a 3-4 dígitos
    if (field === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 3);
    }

    setCardData((prev) => ({
      ...prev,
      [field]: formattedValue,
    }));
  };

  // Validaciones para habilitar/deshabilitar el botón (igual que Yape/Plin)
  const isFormValid =
    cardData.number.replace(/\s/g, "").length === 16 &&
    cardData.expiry.length === 5 &&
    cardData.cvv.length >= 3 &&
    cardData.name.trim().length > 0;

  const getCardType = (number: string) => {
    const cleanNumber = number.replace(/\s/g, "");
    if (/^4/.test(cleanNumber)) return "visa";
    if (/^5[1-5]/.test(cleanNumber)) return "mastercard";
    if (/^3[47]/.test(cleanNumber)) return "amex";
    return "credit";
  };

  const cardType = getCardType(cardData.number);

  return (
    <div className="max-w-xs mx-auto space-y-4 px-4">
      <h4 className="font-semibold text-lg text-center">Pago con Tarjeta</h4>

      {/* Tarjeta de demostración */}
      <div
        className={`px-4 py-6 rounded-xl border-2 ${
          focusedField ? "border-orange-500" : "border-gray-300"
        } bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-lg transition-all duration-300`}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-md"></div>
          <div className="text-xs opacity-80">
            {cardType === "visa" && "VISA"}
            {cardType === "mastercard" && "MasterCard"}
            {cardType === "amex" && "American Express"}
            {cardType === "credit" && "Tarjeta de Crédito"}
          </div>
        </div>

        <div className="mb-4">
          <div className="text-lg font-mono tracking-wider mb-4">
            {cardData.number || "•••• •••• •••• ••••"}
          </div>
          <div className="flex justify-between text-xs opacity-80">
            <div className="text-xs">
              {cardData.name || "NOMBRE EN LA TARJETA"}
            </div>
            <div>{cardData.expiry || "MM/AA"}</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Número de tarjeta */}
        <div className="space-y-2">
          <Label htmlFor="cardNumber" className="text-sm font-medium">
            Número de tarjeta
          </Label>
          <Input
            id="cardNumber"
            type="text"
            placeholder="•••• •••• •••• ••••"
            value={cardData.number}
            onChange={(e) => handleInputChange("number", e.target.value)}
            onFocus={() => setFocusedField("number")}
            onBlur={() => setFocusedField(null)}
            className="font-mono text-lg bg-white"
            maxLength={19}
            required
            disabled={isProcessing}
          />
        </div>

        {/* Nombre en la tarjeta */}
        <div className="space-y-2">
          <Label htmlFor="cardName" className="text-sm font-medium">
            Nombre en la tarjeta
          </Label>
          <Input
            id="cardName"
            type="text"
            placeholder="Como aparece en la tarjeta"
            value={cardData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            onFocus={() => setFocusedField("name")}
            onBlur={() => setFocusedField(null)}
            className="bg-white"
            required
            disabled={isProcessing}
          />
        </div>

        {/* Fecha y CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiry" className="text-sm font-medium">
              Fecha expiración
            </Label>
            <Input
              id="expiry"
              type="text"
              placeholder="MM/AA"
              value={cardData.expiry}
              onChange={(e) => handleInputChange("expiry", e.target.value)}
              onFocus={() => setFocusedField("expiry")}
              onBlur={() => setFocusedField(null)}
              className="bg-white"
              maxLength={5}
              required
              disabled={isProcessing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cvv" className="text-sm font-medium">
              cvv
            </Label>
            <Input
              id="cvv"
              type="text"
              placeholder="•••"
              value={cardData.cvv}
              onChange={(e) => handleInputChange("cvv", e.target.value)}
              onFocus={() => setFocusedField("cvv")}
              onBlur={() => setFocusedField(null)}
              className="bg-white"
              maxLength={4}
              required
              disabled={isProcessing}
            />
          </div>
        </div>

        {/* Información de seguridad */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Lock className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-blue-700">
              <p className="text-xs font-medium">Pago seguro</p>
              <p className="text-xs mt-1">
                Datos protegidos con encriptación SSL.
              </p>
            </div>
          </div>
        </div>

        {/* Botón de pago - IGUAL QUE YAPE/PLIN */}
        <Button
          onClick={onPayment}
          disabled={!isFormValid || isProcessing}
          className="w-full bg-orange-600 hover:bg-orange-700 cursor-pointer"
        >
          {isProcessing ? "Procesando..." : `Pagar S/ ${formatPrice(total)}`}
        </Button>
      </div>
      {/* Logos de tarjetas aceptadas */}
      <div className="text-center">
        <p className="text-xs text-gray-500 mb-4">Aceptamos</p>
        <div className="flex justify-center gap-6">
          <img src="/visa-logo.png" alt="Visa" className="h-6" />
          <img src="/mastercard-logo.png" alt="MasterCard" className="h-6" />
        </div>
      </div>
    </div>
  );
}
