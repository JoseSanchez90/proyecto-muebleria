import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, Home } from "lucide-react";

export default function Pending() {
  return (
    <div className="h-full min-h-screen bg-gray-100 py-12 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-lg w-full">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-yellow-200 rounded-full flex items-center justify-center">
            <Clock className="w-10 h-10 text-yellow-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2 text-yellow-600">
          Pago pendiente
        </h1>
        <p className="text-gray-600 mb-6">
          Estamos esperando la confirmación del medio de pago.
        </p>
        <Link to="/">
          <Button variant="outline" className="border-gray-500">
            <Home className="w-4 h-4 mr-2" /> Volver al inicio
          </Button>
        </Link>
      </div>
    </div>
  );
}
