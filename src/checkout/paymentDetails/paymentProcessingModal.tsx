import { useEffect, useState } from "react";

export default function PaymentProcessingModal() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    // Animación de la barra de progreso
    const duration = 5000; // 5 segundos
    const interval = 50; // Actualizar cada 50ms
    const steps = duration / interval;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + increment;
      });
    }, interval);

    // Cleanup function
    return () => {
      document.body.style.overflow = "";
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300 overflow-hidden">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 animate-in slide-in-from-bottom duration-500 text-center space-y-6">
        {/* Puntos de carga animados */}
        <div className="flex justify-center items-center space-x-3 h-8">
          <div
            className="w-4 h-4 bg-orange-500 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-4 h-4 bg-orange-500 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-4 h-4 bg-orange-500 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>

        {/* Texto */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-900">
            Procesando pago...
          </h3>
          <p className="text-gray-600 text-sm">
            Estamos verificando tu información de pago de forma segura
          </p>
        </div>

        {/* Barra de progreso moderna */}
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Puntos animados debajo de la barra */}
          <div className="flex justify-center space-x-1">
            <div
              className="w-1 h-1 bg-orange-500 rounded-full animate-pulse"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-1 h-1 bg-orange-500 rounded-full animate-pulse"
              style={{ animationDelay: "200ms" }}
            ></div>
            <div
              className="w-1 h-1 bg-orange-500 rounded-full animate-pulse"
              style={{ animationDelay: "400ms" }}
            ></div>
          </div>
        </div>

        {/* Indicadores de seguridad */}
        <div className="flex justify-center items-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Conexión segura</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Datos encriptados</span>
          </div>
        </div>
      </div>
    </div>
  );
}
