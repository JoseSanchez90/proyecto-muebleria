// pages/payment-success.tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Home, ShoppingBag } from "lucide-react";

function PaymentSuccess() {
  return (
    <div className="h-full md:min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4 lg:max-w-3xl 2xl:max-w-5xl">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center lg:py-6 2xl:py-36">
          {/* Icono de éxito */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-orange-600" />
            </div>
          </div>

          {/* Mensaje */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Pago Exitoso!
          </h1>
          <p className="text-gray-600 mb-2">
            Tu pedido ha sido procesado correctamente.
          </p>
          <p className="text-gray-500 text-sm lg:mb-4 2xl:mb-8">
            Número de orden: <span className="font-mono">#MF{Date.now().toString().slice(-6)}</span>
          </p>

          {/* Información del pedido */}
          <div className="bg-orange-50 rounded-lg p-6 lg:mb-4 2xl:mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Package className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold">Tu pedido está siendo preparado</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Recibirás un correo electrónico con los detalles de tu compra y el número de seguimiento.
            </p>
            <div className="text-xs text-gray-500">
              Tiempo estimado de entrega: 2-5 días hábiles
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-row gap-4 justify-center">
            <Link to="/">
              <Button variant="outline" className="flex items-center gap-2 cursor-pointer border-gray-500">
                <Home className="w-4 h-4" />
                Volver al inicio
              </Button>
            </Link>
            <Link to="/productos">
              <Button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 cursor-pointer">
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