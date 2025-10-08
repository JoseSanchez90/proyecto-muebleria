import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/Authentication/authContext";
import { Eye, EyeOff, ArrowLeft, ChevronDownIcon } from "lucide-react";
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

function Register() {
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
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [departamento, setDepartamento] = useState<string>("");
  const [provincia, setProvincia] = useState<string>("");
  const [distrito, setDistrito] = useState<string>("");

  const [provinciasFiltradas, setProvinciasFiltradas] = useState<Provincia[]>(
    []
  );
  const [distritosFiltrados, setDistritosFiltrados] = useState<Distrito[]>([]);

  // Cuando cambia el departamento
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

  // Cuando cambia la provincia
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

    // Validaciones previas
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
        toast.success(
          "✅ ¡Cuenta creada exitosamente! Serás redirigido al inicio..."
        );
        // Redirección con pequeño retraso
        setTimeout(() => navigate("/"), 2500);
      }
    } catch (err) {
      console.error("Error inesperado:", err);
      toast.error("Ocurrió un error inesperado. Inténtalo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="w-full flex flex-col mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-black"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al inicio
          </Link>
        </div>

        {/* Contenedor principal */}
        <div className="grid grid-cols-2 gap-8 w-full">
          {/* SECCIÓN IZQUIERDA - Imagen y marca */}
          <section className="hidden lg:flex flex-col justify-center items-center bg-gray-100">
            <img
              src="/src/assets/images/logo.png"
              alt="Logo Muebles Modernos"
              className="object-contain w-92"
            />
            <div className="text-center mt-8">
              <h1 className="text-3xl font-bold text-gray-800">
                Muebles Modernos
              </h1>
              <p className="text-gray-600 mt-2 text-sm px-20">
                Diseño y confort para tu hogar. La mejor selección de muebles
                minimalistas con calidad y estilo.
              </p>
            </div>
          </section>

          {/* SECCIÓN DERECHA - Formulario */}
          <section className="p-8 flex items-center justify-center bg-white rounded-2xl">
            <div className="w-full max-w-2xl">
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
                  {error}
                </div>
              )}

              {/* Formulario compacto y elegante */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Encabezado */}
                <div className="mb-6 text-center md:text-left">
                  <h1 className="text-3xl font-bold">Crear cuenta</h1>
                  <p className="text-gray-600">
                    ¡Bienvenido! Solo falta un paso para unirte a nuestra
                    comunidad.
                  </p>
                </div>

                {/* Datos personales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    />
                  </div>
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
                    />
                  </div>
                </div>

                {/* Contacto */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <Input
                      aria-placeholder=""
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de nacimiento
                    </label>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          id="date"
                          className="w-full justify-between font-normal bg-white text-gray-500 border border-gray-300 hover:bg-gray-50 transition"
                        >
                          {formData.birthdate
                            ? formData.birthdate.split("-").reverse().join("/") // "14/01/1990"
                            : "Seleccionar fecha"}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          captionLayout="dropdown"
                          selected={
                            formData.birthdate
                              ? new Date(formData.birthdate + "T00:00:00") // asegura día correcto
                              : undefined
                          }
                          onSelect={(date) => {
                            if (date) {
                              const formatted = `${date.getFullYear()}-${String(
                                date.getMonth() + 1
                              ).padStart(2, "0")}-${String(
                                date.getDate()
                              ).padStart(2, "0")}`;

                              setFormData((prev) => ({
                                ...prev,
                                birthdate: formatted, // Ejemplo: "1990-01-14"
                              }));
                            } else {
                              setFormData((prev) => ({
                                ...prev,
                                birthdate: "",
                              }));
                            }
                            setOpen(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Dirección */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Departamento */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      Departamento
                    </label>
                    <Select
                      value={departamento}
                      onValueChange={(value) => {
                        setDepartamento(value);
                        setProvincia("");
                        setDistrito("");
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione un departamento" />
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

                  {/* Provincia */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      Provincia
                    </label>
                    <Select
                      value={provincia}
                      onValueChange={(value) => {
                        setProvincia(value);
                        setDistrito("");
                      }}
                      disabled={!departamento}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione una provincia" />
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

                  {/* Distrito */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      Distrito
                    </label>
                    <Select
                      value={distrito}
                      onValueChange={setDistrito}
                      disabled={!provincia}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione un distrito" />
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

                {/* Contraseña */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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

                {/* Términos y botones */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      name="acceptTerms"
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
                    size="lg"
                    type="submit"
                    disabled={loading}
                    className={`w-full text-white font-semibold transition-all cursor-pointer ${
                      loading ? "bg-gray-400" : ""
                    }`}
                  >
                    {loading ? "Creando cuenta..." : "Registrarse"}
                  </Button>

                  <p className="text-center text-sm text-gray-600">
                    ¿Ya tienes una cuenta?{" "}
                    <Link
                      to="/login"
                      className="text-gray-900 font-semibold hover:underline"
                    >
                      Inicia sesión
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Register;
