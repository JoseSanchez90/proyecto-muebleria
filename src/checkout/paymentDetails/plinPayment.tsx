import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, CheckCircle } from "lucide-react";
import { formatPrice } from "@/utils/formatters";

interface PlinPaymentProps {
  total: number;
  onPayment: () => Promise<void>;
  isProcessing?: boolean;
}

export default function PlinPayment({ total, onPayment, isProcessing }: PlinPaymentProps) {
  const [plinVoucher, setPlinVoucher] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleVoucherUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setPlinVoucher(file);
      setIsUploading(true);
      setTimeout(() => setIsUploading(false), 2000);
    }
  };

  return (
        <div className="space-y-4 text-center">
          <h4 className="font-semibold text-lg">Pago con Plin</h4>

          {/* QR Code */}
          <div className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center">
            <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
              <img
                src="/qr.png"
                alt="QR Plin"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Escanea el código QR con Plin
            </p>

            {/* Número de teléfono */}
            <div className="bg-gray-50 p-3 rounded-lg w-full">
              <p className="text-xs text-gray-500 mb-1">O Plinea al número:</p>
              <p className="font-mono font-bold text-lg">999 888 777</p>
            </div>
          </div>

          {/* Subida de voucher */}
          <div className="space-y-3">
            <Label className="text-sm font-medium block">
              Sube una imagen de tu voucher de Plin
            </Label>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-orange-400 transition-colors">
              <input
                type="file"
                id="plinVoucher"
                accept="image/*"
                onChange={handleVoucherUpload}
                className="hidden"
              />
              <label
                htmlFor="plinVoucher"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <div className="w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-sm text-gray-600">Subiendo voucher...</p>
                  </>
                ) : plinVoucher ? (
                  <>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-sm text-green-600 font-medium">
                      Voucher subido
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {plinVoucher.name}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                      <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">
                      Haz clic para subir tu voucher
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Formatos: JPG, PNG (Max. 5MB)
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

          <Button
            onClick={onPayment}
            disabled={!plinVoucher || isUploading}
            className="w-full bg-orange-600 hover:bg-orange-700 cursor-pointer"
          >
            { isProcessing ? "Procesando..." : `Pagar S/ ${formatPrice(total)}`}
          </Button>
        </div>
  );
}
