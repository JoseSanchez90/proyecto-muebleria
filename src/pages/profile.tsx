// src/pages/Profile.tsx
import { useState, useEffect } from "react";
import { useAuth } from "@/components/Authentication/authContext";
import { supabase } from "@/lib/supabaseClient";
import { Camera, MapPin, Package, Save, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import departamentos from "@/data/departamentos.json";
import provincias from "@/data/provincias.json";
import distritos from "@/data/distritos.json";

interface UserProfile {
  id: string;
  name: string;
  last_name: string;
  email: string;
  phone: string;
  dni: string;
  birthdate: string;
  address: string;
  reference: string;
  department: string;
  province: string;
  district: string;
  avatar_url: string | null;
}

interface Order {
  id: string;
  created_at: string;
  total: number;
  status: string;
  items_count: number;
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

function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"personal" | "address" | "orders">(
    "personal"
  );
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [provinciasFiltradas, setProvinciasFiltradas] = useState<Provincia[]>(
    []
  );
  const [distritosFiltrados, setDistritosFiltrados] = useState<Distrito[]>([]);

  // Estado para información personal
  const [profile, setProfile] = useState<UserProfile>({
    id: "",
    name: "",
    last_name: "",
    email: "",
    phone: "",
    dni: "",
    birthdate: "",
    address: "",
    reference: "",
    department: "",
    province: "",
    district: "",
    avatar_url: null,
  });

  // Estado para pedidos
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user) {
      loadProfile();
      loadOrders();
    } else {
      window.location.href = "/";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      if (data) {
        setProfile({
          id: data.id,
          name: data.name || "",
          last_name: data.last_name || "",
          email: user?.email || "",
          phone: data.phone || "",
          dni: data.dni || "",
          birthdate: data.birthdate || "",
          address: data.address || "",
          reference: data.reference || "",
          department: data.department || "",
          province: data.province || "",
          district: data.district || "",
          avatar_url: data.avatar_url,
        });
      }
    } catch (error) {
      console.error("Error al cargar perfil:", error);
      toast.error("Error al cargar el perfil");
    }
  };

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
    }
  };

  // USEEFFECT PARA FILTRADO
  useEffect(() => {
    if (profile.department) {
      const filtradas = provincias // ← Array completo de provincias
        .filter((prov) => prov.department_id === profile.department)
        .map((prov) => ({
          id: prov.id,
          nombre: prov.name,
          departamento_id: prov.department_id,
        }));
      setProvinciasFiltradas(filtradas);
    } else {
      setProvinciasFiltradas([]);
    }
  }, [profile.department]);

  useEffect(() => {
    if (profile.province) {
      const filtradas = distritos // ← Array completo de distritos
        .filter((dist) => dist.province_id === profile.province)
        .map((dist) => ({
          id: dist.id,
          nombre: dist.name,
          provincia_id: dist.province_id,
        }));
      setDistritosFiltrados(filtradas);
    } else {
      setDistritosFiltrados([]);
    }
  }, [profile.province]);

  // Usar profile.avatar_url en lugar de user.user_metadata
  const avatarSrc = profile.avatar_url
    ? profile.avatar_url
    : "/default-avatar.png";

  const uploadAvatar = async (file: File) => {
    try {
      setUploading(true);

      // Obtener usuario actual
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      if (!currentUser) throw new Error("Usuario no autenticado");

      // Generar nombre único para el archivo
      const fileExt = file.name.split(".").pop();
      const fileName = `${currentUser.id}/avatar-${Date.now()}.${fileExt}`;

      console.log("Subiendo archivo:", fileName);

      // CAMBIO 1: Cambiar "profile" por "avatars"
      const { error: uploadError } = await supabase.storage
        .from("avatars") // ← CAMBIADO A "avatars"
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.error("Error subiendo archivo:", uploadError);
        throw uploadError;
      }

      // CAMBIO 2: Cambiar "profile" por "avatars"
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(fileName); // ← CAMBIADO A "avatars"

      console.log("URL pública obtenida:", publicUrl);

      // 3. ACTUALIZAR tabla profiles (esto NO cambia)
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          avatar_url: publicUrl,
        })
        .eq("id", currentUser.id);

      if (updateError) {
        console.error("Error actualizando perfil:", updateError);
        throw updateError;
      }

      console.log("Avatar actualizado exitosamente");

      // Actualizar el estado local
      setProfile((prev) => ({
        ...prev,
        avatar_url: publicUrl,
      }));

      toast.success("Foto de perfil actualizada exitosamente");
      return { error: null, publicUrl };
    } catch (error) {
      console.error("Error en uploadAvatar:", error);
      toast.error(
        `Error subiendo imagen: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
      return { error: error as Error, publicUrl: null };
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona una imagen válida");
      return;
    }

    // Validar tamaño (ej: máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("La imagen debe ser menor a 2MB");
      return;
    }

    // CORREGIDO: Eliminado el setAvatarUrl que no existe
    await uploadAvatar(file);
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      console.log("🔄 Actualizando perfil...", {
        userId: user?.id,
        data: {
          name: profile.name,
          last_name: profile.last_name,
          phone: profile.phone,
          dni: profile.dni,
          birthdate: profile.birthdate,
        },
      });

      const { data, error } = await supabase
        .from("profiles")
        .update({
          name: profile.name,
          last_name: profile.last_name,
          phone: profile.phone,
          dni: profile.dni,
          birthdate: profile.birthdate,
        })
        .eq("id", user?.id)
        .select();

      console.log("✅ Resultado update:", data);
      console.log("❌ Error update:", error);

      // CORREGIDO: Solo lanzar error si realmente hay error
      if (error) {
        console.error("Error al guardar perfil:", error);
        throw error;
      }

      // Si llegamos aquí, la actualización fue exitosa
      console.log("✅ Perfil actualizado correctamente en la base de datos");
      toast.success("Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error en handleSaveProfile:", error);
      toast.error("Error al actualizar el perfil");
    } finally {
      setLoading(false);
      console.log("🏁 Finalizado handleSaveProfile");
    }
  };

  const handleSaveAddress = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .update({
          address: profile.address,
          reference: profile.reference,
          department: profile.department,
          province: profile.province,
          district: profile.district,
        })
        .eq("id", user?.id)
        .select(); // ← Agregar para ver el resultado

      console.log("✅ Dirección actualizada:", data);
      console.log("❌ Error dirección:", error);

      if (error) throw error;

      toast.success("Dirección actualizada correctamente");
    } catch (error) {
      console.error("Error al guardar dirección:", error);
      toast.error("Error al actualizar la dirección");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden border-4 border-gray-100">
                {profile.avatar_url ? (
                  <img
                    src={avatarSrc}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400 bg-gradient-to-br from-gray-200 to-gray-300">
                    {profile.name?.[0]?.toUpperCase() || "U"}
                    {profile.last_name?.[0]?.toUpperCase() || ""}
                  </div>
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-black text-white p-2 rounded-full cursor-pointer hover:bg-gray-800 transition shadow-lg ${
                  uploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {uploading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="w-5 h-5" />
                )}
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            {/* Info */}
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {profile.name || "Usuario"} {profile.last_name}
              </h1>
              <p className="text-gray-600">{profile.email}</p>
              {profile.dni && (
                <p className="text-sm text-gray-500 mt-1">DNI: {profile.dni}</p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab("personal")}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition whitespace-nowrap cursor-pointer ${
                activeTab === "personal"
                  ? "border-b-2 border-black text-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <User className="w-5 h-5" />
              Información Personal
            </button>
            <button
              onClick={() => setActiveTab("address")}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition whitespace-nowrap cursor-pointer ${
                activeTab === "address"
                  ? "border-b-2 border-black text-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <MapPin className="w-5 h-5" />
              Dirección de Envío
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition whitespace-nowrap cursor-pointer ${
                activeTab === "orders"
                  ? "border-b-2 border-black text-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Package className="w-5 h-5" />
              Historial de Pedidos
            </button>
          </div>

          {/* Contenido de tabs */}
          <div className="p-8">
            {/* Información Personal */}
            {activeTab === "personal" && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">Datos personales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre *
                    </label>
                    <Input
                      value={profile.name}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido *
                    </label>
                    <Input
                      value={profile.last_name}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          last_name: e.target.value,
                        }))
                      }
                      placeholder="Tu apellido"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      DNI
                    </label>
                    <Input
                      value={profile.dni}
                      onChange={(e) =>
                        setProfile((prev) => ({ ...prev, dni: e.target.value }))
                      }
                      placeholder="12345678"
                      maxLength={8}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <Input
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      placeholder="+51 999 999 999"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correo electrónico
                    </label>
                    <Input
                      value={profile.email}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de nacimiento
                    </label>
                    <Input
                      type="date"
                      value={profile.birthdate}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          birthdate: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <Button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="bg-black hover:bg-gray-800 cursor-pointer"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </div>
            )}

            {/* Dirección de Envío */}
            {activeTab === "address" && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">
                  Dirección de entrega
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección completa
                    </label>
                    <Input
                      value={profile.address}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      placeholder="Av. Principal 123, Dpto 101"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Referencia
                    </label>
                    <Input
                      value={profile.reference}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          reference: e.target.value,
                        }))
                      }
                      placeholder="Cerca al parque, edificio de color azul"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Departamento
                    </label>
                    <Select
                      value={profile.department}
                      onValueChange={(value) =>
                        setProfile((prev) => ({
                          ...prev,
                          department: value,
                          province: "", // Limpiar provincia
                          district: "", // Limpiar distrito
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona departamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {departamentos.map((depto) => (
                          <SelectItem key={depto.id} value={depto.id}>
                            {depto.name}
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
                      value={profile.province}
                      onValueChange={(value) =>
                        setProfile((prev) => ({
                          ...prev,
                          province: value,
                          district: "", // Limpiar distrito
                        }))
                      }
                      disabled={!profile.department}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            profile.department
                              ? "Selecciona provincia"
                              : "Primero selecciona departamento"
                          }
                        />
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
                      value={profile.district}
                      onValueChange={(value) =>
                        setProfile((prev) => ({
                          ...prev,
                          district: value,
                        }))
                      }
                      disabled={!profile.province}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            profile.province
                              ? "Selecciona distrito"
                              : "Primero selecciona provincia"
                          }
                        />
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

                {/* Vista previa */}
                {(profile.address || profile.department) && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Vista previa:
                    </p>
                    <p className="text-gray-800">
                      {profile.address || "Sin dirección"}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {[profile.district, profile.province, profile.department]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                    {profile.reference && (
                      <p className="text-sm text-gray-500 mt-1">
                        Ref: {profile.reference}
                      </p>
                    )}
                  </div>
                )}

                <Button
                  onClick={handleSaveAddress}
                  disabled={loading}
                  className="bg-black hover:bg-gray-800 cursor-pointer"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Guardando..." : "Guardar Dirección"}
                </Button>
              </div>
            )}

            {/* Historial de Pedidos */}
            {activeTab === "orders" && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Mis pedidos</h3>

                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-2">
                      No tienes pedidos realizados
                    </p>
                    <p className="text-gray-400 text-sm">
                      Comienza a comprar y encuentra tus productos favoritos
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border rounded-lg p-6 hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-semibold text-lg">
                              Pedido #{order.id.slice(0, 8).toUpperCase()}
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(order.created_at).toLocaleDateString(
                                "es-PE",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              order.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : order.status === "processing"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {order.status === "completed"
                              ? "Completado"
                              : order.status === "processing"
                              ? "En proceso"
                              : "Pendiente"}
                          </span>
                        </div>
                        <div className="flex justify-between items-end">
                          <p className="text-sm text-gray-600">
                            {order.items_count}{" "}
                            {order.items_count === 1 ? "producto" : "productos"}
                          </p>
                          <p className="text-2xl font-bold">
                            S/ {order.total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
