// pages/payment-success.tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Package,
  Home,
  ShoppingBag,
  Clock,
  Mail,
} from "lucide-react";
import { useState, useEffect } from "react";

function PaymentSuccess() {
  // En una implementación real, esto vendría de los parámetros de la URL o del estado
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  // Simulando la obtención del método de pago (en tu caso real vendría de la URL o estado)
  useEffect(() => {
    // Ejemplo: obtener de query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const method = urlParams.get("payment_method") || "card"; // default a card
    setPaymentMethod(method);
  }, []);

  const getPaymentInfo = () => {
    switch (paymentMethod) {
      case "yape":
        return {
          showCustomMessage: true,
          title: "Pago con Yape",
          verificationTime: "12 horas",
          description:
            "Estamos verificando tu pago a través de Yape. Una vez confirmado, procederemos con el envío de tu pedido.",
          icon: (
            <img src="/public/yape.webp" alt="Yape-Logo" className="w-12" />
          ),
        };
      case "plin":
        return {
          showCustomMessage: true,
          title: "Pago con Plin",
          verificationTime: "24 horas",
          description:
            "Estamos validando tu voucher de pago. Este proceso puede tomar hasta 24 horas para garantizar la seguridad de tu transacción.",
          icon: (
            <img src="/public/plin.webp" alt="Plin-Logo" className="w-12" />
          ),
        };
      case "card":
      default:
        return {
          showCustomMessage: false,
          title: "Pago Procesado",
          verificationTime: "",
          description: "",
          icon: (
            <img src="/public/visa-logo.png" alt="Visa-Logo" className="w-12" />
          ),
        };
    }
  };

  const paymentInfo = getPaymentInfo();

  return (
    <div className="h-full md:min-h-screen bg-gray-100 py-8 sm:py-12">
      <div className="container mx-auto px-4 lg:max-w-3xl 2xl:max-w-5xl">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-8 text-center py-8 lg:py-6 2xl:py-24">
          {/* Icono de éxito */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 2xl:w-20 2xl:h-20 bg-orange-200 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 2xl:w-12 2xl:h-12 text-orange-600" />
            </div>
          </div>

          {/* Mensaje principal */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            ¡Pago Exitoso!
          </h1>
          <p className="text-gray-600 mb-2 text-sm sm:text-base">
            Tu pedido ha sido procesado correctamente.
          </p>
          <p className="text-gray-500 text-sm mb-4 sm:mb-6">
            Número de orden:{" "}
            <span className="font-mono">
              #MF{Date.now().toString().slice(-6)}
            </span>
          </p>

          {/* Información específica del método de pago - Solo para Yape y Plin */}
          {paymentInfo.showCustomMessage && (
            <div className="bg-orange-200 rounded-lg p-4 sm:p-6 mb-6">
              <div className="flex flex-col items-center justify-center gap-2 mb-3">
                <span className="text-xl">{paymentInfo.icon}</span>
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                  {paymentInfo.title}
                </h3>
              </div>
              <div className="flex items-center justify-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-orange-600" />
                <p className="text-sm font-medium text-gray-800">
                  Tiempo de verificación: {paymentInfo.verificationTime}
                </p>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mb-6">
                {paymentInfo.description}
              </p>
              {/* Recordatorio de correo para todos los métodos */}
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-600">
                <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" />
                <span>
                  Recibirás toda la información y actualizaciones por correo
                  electrónico
                </span>
              </div>
            </div>
          )}

          {/* Información del pedido - SOLO para tarjeta */}
          {paymentMethod === "card" && (
            <div className="bg-orange-100 rounded-lg p-4 sm:p-6 mb-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                <h3 className="font-semibold text-sm sm:text-base">
                  Tu pedido está en proceso
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mb-3">
                Tu pago ha sido confirmado automáticamente. Estamos preparando
                tu pedido para el envío.
              </p>
              <div className="text-xs text-gray-500 mb-6">
                Tiempo estimado de envio: 2-5 días hábiles
              </div>
              {/* Recordatorio de correo para todos los métodos */}
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-600">
                <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" />
                <span>
                  Recibirás toda la información y actualizaciones por correo
                  electrónico
                </span>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-6 sm:mt-8">
            <Link to="/" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="flex items-center gap-2 cursor-pointer border-gray-500 w-full sm:w-auto"
              >
                <Home className="w-4 h-4" />
                Volver al inicio
              </Button>
            </Link>
            <Link to="/productos" className="w-full sm:w-auto">
              <Button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 cursor-pointer w-full sm:w-auto">
                <ShoppingBag className="w-4 h-4" />
                Seguir comprando
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
