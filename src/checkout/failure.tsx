import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function Failure() {
  return (
    <div className="h-full min-h-screen bg-gray-100 py-12 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-lg w-full">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2 text-red-600">
          Pago rechazado
        </h1>
        <p className="text-gray-600 mb-6">
          No pudimos procesar tu pago. Intenta nuevamente o usa otro método.
        </p>
        <Link to="/checkout">
          <Button className="bg-red-600 hover:bg-red-700">
            Volver al pago
          </Button>
        </Link>
      </div>
    </div>
  );
}
