import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";
import { useAuthActions } from "@/hooks/auth/useAuthActions";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

function RegisterModal({
  isOpen,
  onClose,
  onSwitchToLogin,
}: RegisterModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    dni: "",
    phone: "",
    birthdate: "",
    address: "",
    reference: "",
    department: "",
    province: "",
    district: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp, isSigningUp, signUpError, resetSignUp } = useAuthActions();

  // ✅ RESET ERROR CUANDO SE ABRE EL MODAL
  useEffect(() => {
    if (isOpen) {
      resetSignUp();
      setError("");
    }
  }, [isOpen, resetSignUp]);

  // ✅ ACTUALIZAR ERROR DESDE LA MUTATION
  useEffect(() => {
    if (signUpError) {
      setError(signUpError.message || "Error al crear la cuenta");
    }
  }, [signUpError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ ENVIO DE FORMULARIO SIMPLIFICADO
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    resetSignUp();

    console.log("📝 Datos del formulario a enviar:", formData);

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (!formData.acceptTerms) {
      toast.error("Debes aceptar los términos y condiciones");
      return;
    }

    console.log("✅ Validaciones pasadas, iniciando registro...");

    // ✅ LLAMAR LA MUTATION
    signUp(formData, {
      onSuccess: () => {
        toast.success("Cuenta creada exitosamente");
        onClose();
        // Resetear formulario
        setFormData({
          name: "",
          lastName: "",
          email: "",
          dni: "",
          phone: "",
          birthdate: "",
          address: "",
          reference: "",
          department: "",
          province: "",
          district: "",
          password: "",
          confirmPassword: "",
          acceptTerms: false,
        });
      },
      // onError ya se maneja en el hook
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal - Más compacto */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] animate-in fade-in zoom-in duration-200">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Contenido */}
        <div className="p-6">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Encabezado */}
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold mb-2">Crear cuenta</h2>
              <p className="text-gray-600 text-sm">
                Regístrate en segundos y comienza a comprar.
              </p>
            </div>

            {/* Nombre y Apellido */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido *
                </label>
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Teléfono (opcional pero útil) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono (opcional)
                </label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="text-sm"
                  placeholder="Para notificaciones importantes"
                />
              </div>
              {/* DNI */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  DNI *
                </label>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  name="dni"
                  value={formData.dni}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 8) {
                      setFormData((prev) => ({ ...prev, dni: value }));
                    }
                  }}
                  required
                  className="text-sm"
                  placeholder="8 dígitos"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico *
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="text-sm"
              />
            </div>

            {/* Contraseñas */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña *
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar *
                </label>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="text-sm"
                  placeholder="Confirmar"
                />
              </div>
            </div>

            {/* Términos y botones */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <Checkbox
                  className="cursor-pointer mt-0.5"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      acceptTerms: checked as boolean,
                    }))
                  }
                  required
                />
                <label className="text-xs text-gray-600 leading-relaxed">
                  Acepto los{" "}
                  <Link
                    to="/terminos"
                    className="text-gray-900 font-semibold hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    términos
                  </Link>{" "}
                  y{" "}
                  <Link
                    to="/privacidad"
                    className="text-gray-900 font-semibold hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    privacidad
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                disabled={isSigningUp}
                className="w-full bg-black hover:bg-gray-800 text-white py-2.5 font-semibold cursor-pointer disabled:opacity-50 text-sm"
              >
                {loading ? "Creando cuenta..." : "Crear cuenta"}
              </Button>

              <p className="text-center text-xs text-gray-600">
                ¿Ya tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSwitchToLogin();
                  }}
                  className="text-gray-900 font-semibold hover:underline cursor-pointer"
                >
                  Iniciar sesión
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterModal;
