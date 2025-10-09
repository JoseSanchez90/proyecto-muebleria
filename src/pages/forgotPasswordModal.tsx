import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
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
    setEmail('');
    setIsSent(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-2xl font-bold text-center text-black">
            ¿Olvidaste tu contraseña?
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 text-sm px-4">
            Introduce tu correo electrónico para recibir las instrucciones de restablecimiento.
          </DialogDescription>
        </DialogHeader>

        {!isSent ? (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
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
              {isLoading ? 'Enviando...' : 'Enviar instrucciones'}
            </Button>

            <button
              type="button"
              onClick={handleClose}
              className="w-full text-sm text-gray-600 hover:text-black transition-colors underline cursor-pointer"
            >
              Volver a iniciar sesión
            </button>
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
                Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
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
      </DialogContent>
    </Dialog>
  );
}