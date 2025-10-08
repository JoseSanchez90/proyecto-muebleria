import { Home, Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="p-8 md:p-16 text-center">
          {/* Número 404 animado */}
          <div className="mb-12 relative">
            <h1 className="text-9xl 2xl:text-[14rem] font-black text-black leading-none select-none tracking-tighter">
              404
            </h1>
          </div>

          {/* Mensaje principal */}
          <div className="space-y-4 mb-12">
            <h2 className="text-3xl 2xl:text-4xl font-bold text-black tracking-tight">
              Página no encontrada
            </h2>
            <p className="text-base 2xl:text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
              La página que buscas no existe o ha sido movida a otra ubicación.
            </p>
          </div>

          {/* Ilustración decorativa */}
          <div className="mb-6 2xl:mb-12 flex justify-center">
            <div className="relative">
              <Search className="w-16 h-16 text-black animate-bounce" strokeWidth={1.5} />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              onClick={handleGoBack}
              variant="outline"
              size="lg"
              className="cursor-pointer border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300 w-full sm:w-auto font-medium"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Volver atrás
            </Button>
            <Button
              onClick={handleGoHome}
              size="lg"
              className="cursor-pointer bg-black text-white hover:bg-gray-800 transition-all duration-300 w-full sm:w-auto font-medium"
            >
              <Home className="mr-2 h-5 w-5" />
              Ir al inicio
            </Button>
          </div>
        </div>
    </div>
  );
}