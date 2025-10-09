import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function ForgotPasswordModal({
  isOpen,
  onClose,
  onSwitchToLogin,
}: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular envío de correo
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1500);
  };

  const handleClose = () => {
    setEmail("");
    setIsSent(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal - Con scroll */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in duration-200">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="sticky top-4 right-4 ml-auto p-2 hover:bg-gray-100 rounded-full transition cursor-pointer z-10 float-right"
        >
          <X className="w-5 h-5" />
        </button>
        {/* Contenido */}
        <div className="p-8">
          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="text-center mb-6 space-y-2">
                <h2 className="text-2xl font-bold text-center text-black">
                  ¿Olvidaste tu contraseña?
                </h2>
                <p className="text-center text-gray-600 text-sm px-4">
                  Introduce tu correo electrónico para recibir las instrucciones
                  de restablecimiento.
                </p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm text-gray-700">
                    Correo electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Introduce tu correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full cursor-pointer"
                >
                  {isLoading ? "Enviando..." : "Enviar instrucciones"}
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSwitchToLogin();
                  }}
                  className="w-full text-sm text-gray-600 hover:text-black transition-colors underline cursor-pointer"
                >
                  Volver a iniciar sesión
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6 pt-4 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-black">
                  ¡Correo enviado!
                </h3>
                <p className="text-sm text-gray-600 px-4">
                  Revisa tu bandeja de entrada y sigue las instrucciones para
                  restablecer tu contraseña.
                </p>
              </div>

              <Button
                onClick={handleClose}
                className="w-full h-12 bg-gray-800 hover:bg-gray-900 text-white font-medium"
              >
                Entendido
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
