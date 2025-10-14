import { useAuth } from "@/hooks/auth/useAuth";
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

import {
  useProfile,
  type UserProfile as ProfileType,
} from "@/hooks/useProfile";
import { useOrders, type Order } from "@/hooks/useOrders";
import { useState, useEffect, useMemo } from "react";

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
  const [activeTab, setActiveTab] = useState<"personal" | "address" | "orders">(
    "personal"
  );
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [provinciasFiltradas, setProvinciasFiltradas] = useState<Provincia[]>(
    []
  );
  const [distritosFiltrados, setDistritosFiltrados] = useState<Distrito[]>([]);

  const { user } = useAuth();
  const userId = useMemo(() => user?.id, [user?.id]);

  // ✅ REACT QUERY PARA DATOS
  const {
    data: profileData,
    isLoading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useProfile(userId);

  const { data: orders, isLoading: ordersLoading } = useOrders(userId);

  // ✅ UN SOLO ESTADO PARA FORMULARIOS - INICIALIZAR CON DATOS DE REACT QUERY
  const [formData, setFormData] = useState<Partial<ProfileType>>({});

  // ✅ SINCRONIZAR FORM DATA CON DATOS DEL PERFIL
  useEffect(() => {
    if (profileData) {
      console.log("✅ Sincronizando formData con profileData:", profileData);
      setFormData({
        name: profileData.name || "",
        last_name: profileData.last_name || "",
        phone: profileData.phone || "",
        dni: profileData.dni || "",
        birthdate: profileData.birthdate || "",
        address: profileData.address || "",
        reference: profileData.reference || "",
        department: profileData.department || "",
        province: profileData.province || "",
        district: profileData.district || "",
        avatar_url: profileData.avatar_url,
      });
    }
  }, [profileData]);

  // ✅ USEEFFECT PARA FILTRADO - USAR formData
  useEffect(() => {
    if (formData.department) {
      const filtradas = provincias
        .filter((prov) => prov.department_id === formData.department)
        .map((prov) => ({
          id: prov.id,
          nombre: prov.name,
          departamento_id: prov.department_id,
        }));
      setProvinciasFiltradas(filtradas);
    } else {
      setProvinciasFiltradas([]);
    }
  }, [formData.department]);

  useEffect(() => {
    if (formData.province) {
      const filtradas = distritos
        .filter((dist) => dist.province_id === formData.province)
        .map((dist) => ({
          id: dist.id,
          nombre: dist.name,
          provincia_id: dist.province_id,
        }));
      setDistritosFiltrados(filtradas);
    } else {
      setDistritosFiltrados([]);
    }
  }, [formData.province]);

  // ✅ REDIRIGIR SI NO HAY USUARIO
  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => {
        window.location.href = "/";
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  // ✅ ESTADOS DE CARGA
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (profileError || !profileData) {
    return (
      <div className="min-h-screen bg-gray-100 pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error al cargar el perfil</p>
          <Button onClick={() => refetchProfile()}>Reintentar</Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">No se pudo cargar el perfil</p>
          <Button onClick={() => window.location.reload()}>Reintentar</Button>
        </div>
      </div>
    );
  }

  // ✅ AVATAR SRC - USAR formData
  const avatarSrc = formData.avatar_url || "/default-avatar.png";

  const uploadAvatar = async (file: File) => {
    try {
      setUploading(true);

      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      if (!currentUser) throw new Error("Usuario no autenticado");

      const fileExt = file.name.split(".").pop();
      const fileName = `${currentUser.id}/avatar-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", currentUser.id);

      if (updateError) throw updateError;

      // ✅ ACTUALIZAR formData Y REFRESCAR REACT QUERY
      setFormData((prev) => ({ ...prev, avatar_url: publicUrl }));
      await refetchProfile();

      toast.success("Foto de perfil actualizada exitosamente");
    } catch (error) {
      console.error("Error en uploadAvatar:", error);
      toast.error(
        `Error subiendo imagen: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona una imagen válida");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("La imagen debe ser menor a 2MB");
      return;
    }

    await uploadAvatar(file);
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from("profiles")
        .update({
          name: formData.name,
          last_name: formData.last_name,
          phone: formData.phone,
          dni: formData.dni,
          birthdate: formData.birthdate,
        })
        .eq("id", user?.id);

      if (error) throw error;

      await refetchProfile();
      toast.success("Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error en handleSaveProfile:", error);
      toast.error("Error al actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = async () => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from("profiles")
        .update({
          address: formData.address,
          reference: formData.reference,
          department: formData.department,
          province: formData.province,
          district: formData.district,
        })
        .eq("id", user?.id);

      if (error) throw error;

      await refetchProfile();
      toast.success("Dirección actualizada correctamente");
    } catch (error) {
      console.error("Error al guardar dirección:", error);
      toast.error("Error al actualizar la dirección");
    } finally {
      setLoading(false);
    }
  };

  // ✅ JSX ACTUALIZADO - USAR formData EN LUGAR DE profile
  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden border-4 border-gray-100">
                {formData.avatar_url ? (
                  <img
                    src={avatarSrc}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400 bg-gradient-to-br from-gray-200 to-gray-300">
                    {formData.name?.[0]?.toUpperCase() || "U"}
                    {formData.last_name?.[0]?.toUpperCase() || ""}
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

            {/* Info - USAR formData */}
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {formData.name || "Usuario"} {formData.last_name}
              </h1>
              <p className="text-gray-600">{user?.email}</p>
              {formData.dni && (
                <p className="text-sm text-gray-500 mt-1">
                  DNI: {formData.dni}
                </p>
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
              <User className="w-5 h-5" /> Información Personal
            </button>
            <button
              onClick={() => setActiveTab("address")}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition whitespace-nowrap cursor-pointer ${
                activeTab === "address"
                  ? "border-b-2 border-black text-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <MapPin className="w-5 h-5" /> Dirección de Envío
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition whitespace-nowrap cursor-pointer ${
                activeTab === "orders"
                  ? "border-b-2 border-black text-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Package className="w-5 h-5" /> Historial de Pedidos
            </button>
          </div>

          <div className="p-8">
            {/* Información Personal - USAR formData */}
            {activeTab === "personal" && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">Datos personales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre *
                    </label>
                    <Input
                      value={formData.name || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
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
                      value={formData.last_name || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
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
                      value={formData.dni || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          dni: e.target.value,
                        }))
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
                      value={formData.phone || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
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
                      value={user?.email || ""}
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
                      value={formData.birthdate || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
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
                  <Save className="w-4 h-4 mr-2" />{" "}
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
                      value={formData.address}
                      onChange={(e) =>
                        setFormData((prev) => ({
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
                      value={formData.reference}
                      onChange={(e) =>
                        setFormData((prev) => ({
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
                      value={formData.department}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
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
                      value={formData.province}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          province: value,
                          district: "", // Limpiar distrito
                        }))
                      }
                      disabled={!formData.department}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            formData.department
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
                      value={formData.district}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          district: value,
                        }))
                      }
                      disabled={!formData.province}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            formData.province
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
                {(formData.address || formData.department) && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Vista previa:
                    </p>
                    <p className="text-gray-800">
                      {formData.address || "Sin dirección"}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {[formData.district, formData.province, formData.department]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                    {formData.reference && (
                      <p className="text-sm text-gray-500 mt-1">
                        Ref: {formData.reference}
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

                {ordersLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-500">Cargando pedidos...</p>
                  </div>
                ) : !orders || orders.length === 0 ? ( // ✅ FIX: Verificar si es undefined o vacío
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
                    {orders.map(
                      (
                        order: Order // ✅ FIX: Tipar explícitamente
                      ) => (
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
                              {order.items_count === 1
                                ? "producto"
                                : "productos"}
                            </p>
                            <p className="text-2xl font-bold">
                              S/ {order.total.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      )
                    )}
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
