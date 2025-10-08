// src/components/RegisterModal.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/Authentication/authContext";
import { Eye, EyeOff, X, ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import departamentos from "@/data/departamentos.json";
import provincias from "@/data/provincias.json";
import distritos from "@/data/distritos.json";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

interface Provincia {
  id: string;
  nombre: string;
  departamento_id: string;
}

interface Distrito {
  id: string;
  nombre: string;
  provincia_id: string;
}

function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
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
  const { signUp } = useAuth();
  const [open, setOpen] = useState(false);
  const [departamento, setDepartamento] = useState<string>("");
  const [provincia, setProvincia] = useState<string>("");
  const [distrito, setDistrito] = useState<string>("");

  const [provinciasFiltradas, setProvinciasFiltradas] = useState<Provincia[]>([]);
  const [distritosFiltrados, setDistritosFiltrados] = useState<Distrito[]>([]);

  useEffect(() => {
    if (departamento) {
      const filtradas = provincias
        .filter((prov) => prov.department_id === departamento)
        .map((prov) => ({
          id: prov.id,
          nombre: prov.name,
          departamento_id: prov.department_id,
        }));
      setProvinciasFiltradas(filtradas);
      setProvincia("");
      setDistrito("");
      setDistritosFiltrados([]);
    }
  }, [departamento]);

  useEffect(() => {
    if (provincia) {
      const filtradas = distritos
        .filter((dist) => dist.province_id === provincia)
        .map((dist) => ({
          id: dist.id,
          nombre: dist.name,
          provincia_id: dist.province_id,
        }));
      setDistritosFiltrados(filtradas as Distrito[]);
      setDistrito("");
    }
  }, [provincia]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (!formData.acceptTerms) {
      setError("Debes aceptar los términos y condiciones");
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(formData);

      if (error) {
        setError(error.message || "Error al crear la cuenta");
        toast.error("❌ Error al crear la cuenta. Inténtalo nuevamente.");
      } else {
        toast.success("¡Cuenta creada exitosamente!");
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
      }
    } catch (err) {
      console.error("Error inesperado:", err);
      toast.error("Ocurrió un error inesperado. Inténtalo más tarde.");
    } finally {
      setLoading(false);
    }
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
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[80vh] animate-in fade-in zoom-in duration-200">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="sticky top-4 right-4 ml-auto p-2 hover:bg-gray-100 rounded-full transition cursor-pointer z-10 float-right"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Contenido */}
        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Encabezado */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-2">Crear cuenta</h2>
              <p className="text-gray-600">
                ¡Bienvenido! Solo falta un paso para unirte a nuestra comunidad.
              </p>
            </div>

            {/* Datos personales */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido *
                  </label>
                  <Input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  />
                </div>
              </div>
            </div>

            {/* Contacto */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo electrónico *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de nacimiento
                  </label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        className="w-full justify-between font-normal bg-white text-gray-500 border border-gray-300 hover:bg-gray-50"
                      >
                        {formData.birthdate
                          ? formData.birthdate.split("-").reverse().join("/")
                          : "Seleccionar fecha"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        captionLayout="dropdown"
                        selected={
                          formData.birthdate
                            ? new Date(formData.birthdate + "T00:00:00")
                            : undefined
                        }
                        onSelect={(date) => {
                          if (date) {
                            const formatted = `${date.getFullYear()}-${String(
                              date.getMonth() + 1
                            ).padStart(2, "0")}-${String(date.getDate()).padStart(
                              2,
                              "0"
                            )}`;
                            setFormData((prev) => ({
                              ...prev,
                              birthdate: formatted,
                            }));
                          }
                          setOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Dirección */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección
                  </label>
                  <Input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Referencia
                  </label>
                  <Input
                    type="text"
                    name="reference"
                    value={formData.reference}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departamento
                  </label>
                  <Select value={departamento} onValueChange={setDepartamento}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                      {departamentos.map((dpto) => (
                        <SelectItem key={dpto.id} value={dpto.id}>
                          {dpto.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Provincia
                  </label>
                  <Select
                    value={provincia}
                    onValueChange={setProvincia}
                    disabled={!departamento}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinciasFiltradas.map((prov) => (
                        <SelectItem key={prov.id} value={prov.id}>
                          {prov.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Distrito
                  </label>
                  <Select
                    value={distrito}
                    onValueChange={setDistrito}
                    disabled={!provincia}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                      {distritosFiltrados.map((dist) => (
                        <SelectItem key={dist.id} value={dist.id}>
                          {dist.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar contraseña *
                  </label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Términos y botones */}
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  className="cursor-pointer"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      acceptTerms: checked as boolean,
                    }))
                  }
                  required
                />
                <label className="text-sm text-gray-600">
                  Acepto los{" "}
                  <Link
                    to="/terminos"
                    className="text-gray-900 font-semibold hover:underline"
                  >
                    términos y condiciones
                  </Link>{" "}
                  y la{" "}
                  <Link
                    to="/privacidad"
                    className="text-gray-900 font-semibold hover:underline"
                  >
                    política de privacidad
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-black hover:bg-gray-800 text-white py-3 font-semibold cursor-pointer"
              >
                {loading ? "Creando cuenta..." : "Registrarse"}
              </Button>

              <p className="text-center text-sm text-gray-600">
                ¿Ya tienes una cuenta?{" "}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSwitchToLogin();
                  }}
                  className="text-gray-900 font-semibold hover:underline cursor-pointer"
                >
                  Inicia sesión
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