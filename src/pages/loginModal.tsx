// src/components/LoginModal.tsx
import { useState, useEffect } from "react";
import { useAuthActions } from "@/hooks/auth/useAuthActions";
import { X, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onSwitchToForgotPassword: () => void;
}

function LoginModal({
  isOpen,
  onClose,
  onSwitchToRegister,
  onSwitchToForgotPassword,
}: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const { signIn, isSigningIn } = useAuthActions();

  // Cargar credenciales guardadas cuando abre el modal
  useEffect(() => {
    if (isOpen) {
      const savedEmail = localStorage.getItem("rememberedEmail");
      const savedPassword = localStorage.getItem("rememberedPassword");

      console.log("Credenciales guardadas encontradas:", {
        email: savedEmail,
        password: savedPassword ? "***" : null,
      });

      if (savedEmail && savedPassword) {
        setEmail(savedEmail);
        setPassword(savedPassword);
        setRememberMe(true);
        console.log("✅ Credenciales cargadas automáticamente");
      }
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // ❌ ELIMINAR: setLoading(true);

    console.log("Intentando login con:", {
      email,
      password: "***",
      rememberMe,
    });

    // ✅ LLAMAR signIn y manejar en los callbacks
    signIn(
      { email, password },
      {
        onSuccess: () => {
          console.log("✅ Login exitoso");

          // 👇 GUARDAR credenciales SI el login fue exitoso
          if (rememberMe) {
            localStorage.setItem("rememberedEmail", email);
            localStorage.setItem("rememberedPassword", password);
            console.log("Credenciales guardadas en localStorage");
          } else {
            localStorage.removeItem("rememberedEmail");
            localStorage.removeItem("rememberedPassword");
            console.log("Credenciales eliminadas de localStorage");
          }

          // Reset form y cerrar modal
          setEmail("");
          setPassword("");
          onClose();
        },
        onError: (error) => {
          console.log("❌ Login fallido:", error);
          setError("Correo o contraseña incorrectos");
          // ❌ NO llamar setLoading(false) - React Query lo hace automáticamente
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-8 animate-in fade-in zoom-in duration-200">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Contenido */}
        <div>
          <h2 className="text-2xl font-bold mb-1 text-center">
            Iniciar Sesión
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            Ingresa tus credenciales para continuar
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Checkbox Recordar sesión - NUEVO */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="data-[state=checked]:bg-black data-[state=checked]:text-white"
              />
              <label
                htmlFor="rememberMe"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Recordar mis datos
              </label>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                {/* El checkbox ya está arriba, puedes eliminar este espacio si quieres */}
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSwitchToForgotPassword();
                }}
                className="text-sm text-gray-600 hover:text-black transition-colors underline cursor-pointer"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <Button
              type="submit"
              disabled={isSigningIn}
              className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-semibold cursor-pointer disabled:opacity-70"
            >
              {isSigningIn ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>

          {/* Separador */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">o</span>
            </div>
          </div>

          {/* Registro */}
          <Button
            type="button"
            onClick={() => {
              onClose();
              onSwitchToRegister();
            }}
            className="w-full border bg-white border-black hover:bg-gray-100 text-black rounded-lg font-semibold transition cursor-pointer"
          >
            Crear cuenta nueva
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
