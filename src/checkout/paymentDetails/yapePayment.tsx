import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/utils/formatters";
import { X } from "lucide-react";

interface YapePaymentProps {
  total: number;
  onPayment: () => Promise<void>;
  isProcessing?: boolean;
}

export default function YapePayment({
  total,
  onPayment,
  isProcessing = false,
}: YapePaymentProps) {

  const [confirmationCode, setConfirmationCode] = useState("");
  const [showYapeHelp, setShowYapeHelp] = useState(false);

  return (
    <div className="space-y-4 text-center">
      <h4 className="font-semibold text-lg">Pago con Yape</h4>

      {/* Código de confirmación CON TOOLTIP */}
      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2 relative">
          <Label htmlFor="confirmationCode" className="text-sm font-medium">
            Ingresa tu código de aprobación (6 dígitos)
          </Label>

          {/* Botón de ayuda con tooltip */}
          <div className="relative">
            <button
              onClick={() => setShowYapeHelp(!showYapeHelp)}
              className="w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600 cursor-pointer transition-colors"
            >
              ?
            </button>

            {/* Tooltip que se abre arriba del botón */}
            {showYapeHelp && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-50 mb-2 z-50">
                {/* Flecha indicadora hacia abajo */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-white"></div>

                {/* Contenido del tooltip */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 w-64 relative">
                  {/* Botón cerrar */}
                  <button
                    onClick={() => setShowYapeHelp(false)}
                    className="absolute top-2 right-2 w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <X className="text-orange-600" />
                  </button>

                  <h3 className="text-sm text-start font-bold mb-2 text-gray-900 pr-4">
                    ¿Dónde encuentro mi código?
                  </h3>
                  <div className="space-y-1.5 text-start text-xs text-gray-600">
                    <div className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">1.</span>
                      <span>Abre tu app de Yape</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">2.</span>
                      <span>Ve a "Aprobar compras"</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">3.</span>
                      <span>Dirigete a "Código de aprobación"</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">4.</span>
                      <span>
                        Copia el <strong>código de 6 dígitos</strong>
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">5.</span>
                      <span>Ingresa ese código aquí</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <Input
          id="confirmationCode"
          placeholder="xxxxxx"
          maxLength={6}
          value={confirmationCode}
          onChange={(e) =>
            setConfirmationCode(e.target.value.replace(/\D/g, ""))
          }
          className="text-center font-mono text-lg bg-white text-orange-600 font-bold"
        />
        <p className="text-xs text-gray-500">
          Ingresa los 6 dígitos que aparecen en tu Yape
        </p>
      </div>

      <Button
        onClick={onPayment}
        disabled={confirmationCode.length !== 6 || isProcessing}
        className="w-full bg-orange-600 hover:bg-orange-700 cursor-pointer"
      >
        { isProcessing ? "Procesando..." : `Pagar S/ ${formatPrice(total)}`}
      </Button>
    </div>
  );
}
