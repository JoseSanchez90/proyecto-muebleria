import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Input } from "../ui/input";
import { IoIosSearch } from "react-icons/io";
import { IMAGES } from "@/assets/images";
import { CategoryMenuItem } from "../common/categoryMenuItem";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, ShoppingCart, User } from "lucide-react";
import { useAuth } from "../Authentication/authContext";
import { useEffect, useRef, useState } from "react";
import LoginModal from "@/pages/loginModal";
import RegisterModal from "@/pages/registerModal";
import ForgotPasswordModal from "@/pages/forgotPasswordModal";
import toast from "react-hot-toast";
import { useCart } from "@/hooks/cart/useCart";
import { useProfile } from "@/hooks/useProfile";

function NavbarDesktop() {
  const { user, signOut } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const navigate = useNavigate();
  const { totalItems } = useCart();

  // USAR REACT QUERY PARA DATOS DEL PERFIL
  const { data: profileData } = useProfile(user?.id);

  // Cerrar sesión
  const handleSignOut = async () => {
    setLoggingOut(true);
    try {
      await signOut();
      toast.success("Sesión cerrada correctamente.");
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Hubo un problema al cerrar sesión.");
    } finally {
      setLoggingOut(false);
      setShowMenu(false);
    }
  };

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ DATOS PARA MOSTRAR EN EL NAVBAR
  const userName = profileData?.name || user?.user_metadata?.name || "";
  const userLastName =
    profileData?.last_name || user?.user_metadata?.last_name || "";
  const userAvatar = profileData?.avatar_url || user?.user_metadata?.avatar_url;
  const userEmail = user?.email || "";

  return (
    <section className="hidden lg:flex w-full h-full justify-center pt-6 xl:px-20 2xl:px-40 bg-gray-100">
      <div className="w-full flex justify-between items-center z-20">
        <Link to="/">
          <button className="flex items-center gap-2 cursor-pointer">
            <img src="/logo.png" className="w-12 2xl:w-16"></img>
            <p className="font-sans font-bold text-xl 2xl:text-2xl">Munfort</p>
          </button>
        </Link>
        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink href="/" className="font-semibold">
                Inicio
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/sofas" className="font-semibold">
                Sofás
              </NavigationMenuLink>
            </NavigationMenuItem>
            <CategoryMenuItem
              title="Sillas"
              items={[
                { label: "Comedor", path: "/silla/comedor", key: "comedor" },
                { label: "Oficina", path: "/silla/oficina", key: "oficina" },
                { label: "Todos", path: "/sillas", key: "" },
              ]}
              images={{
                comedor: IMAGES.sillas.SillaComedor,
                oficina: IMAGES.sillas.SillaOficina,
              }}
              defaultImage={IMAGES.sillas.SillaComedor}
            />
            <CategoryMenuItem
              title="Mesas"
              items={[
                { label: "Comedor", path: "/mesas/comedor", key: "comedor" },
                { label: "Centro", path: "/mesas/centro", key: "centro" },
                { label: "Todos", path: "/mesas", key: "" },
              ]}
              images={{
                comedor: IMAGES.mesas.MesaComedor,
                centro: IMAGES.mesas.MesaCentro,
              }}
              defaultImage={IMAGES.mesas.MesaComedor}
            />
            <CategoryMenuItem
              title="Iluminacion"
              items={[
                { label: "Sala", path: "/iluminacion/sala", key: "sala" },
                {
                  label: "Dormitorio",
                  path: "/iluminacion/dormitorio",
                  key: "dormitorio",
                },
                {
                  label: "Exterior",
                  path: "/iluminacion/exterior",
                  key: "exterior",
                },
                { label: "Todos", path: "/iluminacion", key: "" },
              ]}
              images={{
                sala: IMAGES.iluminacion.IluminacionSala,
                dormitorio: IMAGES.iluminacion.IluminacionDormitorio,
                exterior: IMAGES.iluminacion.IluminacionExterior,
              }}
              defaultImage={IMAGES.iluminacion.IluminacionSala}
            />
            <CategoryMenuItem
              title="Decoración"
              items={[
                { label: "Cocina", path: "/decoracion/cocina", key: "cocina" },
                { label: "Baño", path: "/decoracion/baño", key: "baño" },
                {
                  label: "Paredes",
                  path: "/decoracion/paredes",
                  key: "paredes",
                },
                { label: "Todos", path: "/decoracion", key: "" },
              ]}
              images={{
                cocina: IMAGES.decoracion.DecoracionCocina,
                baño: IMAGES.decoracion.DecoracionBaño,
                paredes: IMAGES.decoracion.DecoracionParedes,
              }}
              defaultImage={IMAGES.decoracion.DecoracionCocina}
            />
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center justify-center gap-8">
          <div className="flex">
            <IoIosSearch className="relative w-5 h-5 left-7 top-2" />
            <Input
              className="pl-9 w-60 2xl:w-80 bg-white"
              placeholder="Buscar"
            />
          </div>

          {/* Iconos de usuario y carrito */}
          <div className="flex items-center gap-4">
            {/* Avatar/Usuario */}
            {user ? (
              <div
                className="relative flex flex-col items-center"
                ref={menuRef}
              >
                {/* Botón del avatar + nombre */}
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-800 hover:text-gray-600 transition cursor-pointer"
                >
                  {/* ✅ Avatar pequeño - USAR DATOS DE REACT QUERY */}
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300">
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 text-xs font-bold">
                        {userName?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                  </div>

                  {/* ✅ Texto del saludo - USAR DATOS DE REACT QUERY */}
                  <span className="border-b border-gray-800">
                    {userName
                      ? `Hola, ${userName.split(" ")[0]}`
                      : "Hola, usuario"}
                  </span>
                </button>

                {/* Menú desplegable */}
                {showMenu && (
                  <div className="absolute right-0 mt-10 w-72 bg-white rounded-lg shadow-lg py-2 z-50">
                    {/* ✅ Header del menú - USAR DATOS DE REACT QUERY */}
                    <div className="px-4 py-3 border-b flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300">
                        {userAvatar ? (
                          <img
                            src={userAvatar}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 text-sm font-bold">
                            {userName?.[0]?.toUpperCase() || "U"}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          {userName && userLastName
                            ? `${userName} ${userLastName}`
                            : userName
                            ? userName
                            : userEmail || "Usuario"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {userEmail || "Sin correo"}
                        </p>
                      </div>
                    </div>

                    <Link
                      to="/perfil"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => setShowMenu(false)}
                    >
                      Mi perfil
                    </Link>
                    <Link
                      to="/mis-favoritos"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => setShowMenu(false)}
                    >
                      Mis favoritos
                    </Link>
                    <Link
                      to="/mis-pedidos"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => setShowMenu(false)}
                    >
                      Mis pedidos
                    </Link>

                    {/* Botón de cerrar sesión */}
                    <button
                      onClick={handleSignOut}
                      disabled={loggingOut}
                      className="w-full cursor-pointer text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600 flex items-center gap-2 disabled:opacity-50"
                    >
                      {loggingOut ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                          <span>Cerrando sesión...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <LogOut className="w-4 h-4 flex-shrink-0" />
                          <span>Cerrar sesión</span>
                        </div>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button onClick={() => setShowLoginModal(true)}>
                  <div className="flex items-center justify-center rounded-full p-2 transition-all duration-300 cursor-pointer">
                    <User className="w-6 h-6 text-black" />
                  </div>
                </button>

                {/* Modales */}
                <LoginModal
                  isOpen={showLoginModal}
                  onClose={() => setShowLoginModal(false)}
                  onSwitchToRegister={() => {
                    setShowLoginModal(false);
                    setShowRegisterModal(true);
                  }}
                  onSwitchToForgotPassword={() => {
                    setShowLoginModal(false);
                    setShowForgot(true);
                  }}
                />
                <RegisterModal
                  isOpen={showRegisterModal}
                  onClose={() => setShowRegisterModal(false)}
                  onSwitchToLogin={() => {
                    setShowRegisterModal(false);
                    setShowLoginModal(true);
                  }}
                />
                <ForgotPasswordModal
                  isOpen={showForgot}
                  onClose={() => setShowForgot(false)}
                  onSwitchToLogin={() => {
                    setShowForgot(false);
                    setShowLoginModal(true);
                  }}
                />
              </>
            )}

            {/* Carrito */}
            <Link to="/carrito" className="relative">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NavbarDesktop;
