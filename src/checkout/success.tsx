import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, ShoppingBag, Package, Mail } from "lucide-react";

export default function Success() {
  return (
    <div className="h-full min-h-screen bg-gray-100 py-12 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-lg w-full">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">¡Pago exitoso!</h1>
        <p className="text-gray-600 mb-6">
          Tu pago con tarjeta ha sido confirmado. Estamos preparando tu pedido.
        </p>
        <div className="bg-green-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Package className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-800">
              Tu pedido está en proceso
            </h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Recibirás actualizaciones por correo electrónico.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4 text-green-600" />
            <span>Gracias por confiar en nosotros 🧡</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="outline" className="border-gray-500">
              <Home className="w-4 h-4 mr-2" /> Inicio
            </Button>
          </Link>
          <Link to="/productos">
            <Button className="bg-green-600 hover:bg-green-700">
              <ShoppingBag className="w-4 h-4 mr-2" /> Seguir comprando
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
