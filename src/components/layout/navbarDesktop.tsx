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
import { Link } from "react-router-dom";
import { LogOut, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/context/cartContext";
import { useAuth } from "../Authentication/authContext";
import { useEffect, useRef, useState } from "react";
import LoginModal from "@/pages/loginModal";
import RegisterModal from "@/pages/registerModal";

function NavbarDesktop() {
  const { getTotalItems } = useCart();
  const { user, signOut } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const totalItems = getTotalItems();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Cerrar Sesion
  const handleSignOut = async () => {
    setLoggingOut(true);
    try {
      await signOut();
      // Pequeño delay para asegurar que todo se limpie
      await new Promise((resolve) => setTimeout(resolve, 200));
      window.location.href = "/";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
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

  return (
    <section className="hidden lg:flex w-full h-full justify-center pt-6 xl:px-20 2xl:px-40 bg-gray-100">
      <div className="w-full flex justify-between items-center z-20">
        <Link to="/">
          <button className="flex items-center gap-2 cursor-pointer">
            <img
              src="/public/logo.png"
              className="w-12 2xl:w-16"
            ></img>
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
                {/* Botón que muestra el avatar y nombre - MODIFICADO */}
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-800 hover:text-gray-600 transition cursor-pointer"
                >
                  {/* Avatar pequeño */}
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300">
                    {user.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 text-xs font-bold">
                        {user.user_metadata?.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                  </div>

                  {/* Texto del saludo */}
                  <span className="border-b border-gray-800">
                    {user.user_metadata?.name
                      ? `Hola, ${user.user_metadata.name.split(" ")[0]}`
                      : "Hola, usuario"}
                  </span>
                </button>

                {/* Menú desplegable - TAMBIÉN AGREGAR AVATAR AQUÍ */}
                {showMenu && (
                  <div className="absolute right-0 mt-10 w-72 bg-white rounded-lg shadow-lg py-2 z-50">
                    {/* Header del menú con avatar más grande */}
                    <div className="px-4 py-3 border-b flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300">
                        {user.user_metadata?.avatar_url ? (
                          <img
                            src={user.user_metadata.avatar_url}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 text-sm font-bold">
                            {user.user_metadata?.name?.[0]?.toUpperCase() ||
                              "U"}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          {user.user_metadata?.name
                            ? `${user.user_metadata.name} ${
                                user.user_metadata.last_name || ""
                              }`
                            : user.email}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
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

                {/* Modal de login */}
                <LoginModal
                  isOpen={showLoginModal}
                  onClose={() => setShowLoginModal(false)}
                  onSwitchToRegister={() => {
                    setShowLoginModal(false);
                    setShowRegisterModal(true);
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
              </>
            )}
            {/* Carrito con contador */}
            <Link to="/carrito" className="flex items-center justify-center">
              <div className="relative flex items-center justify-center rounded-full p-2 transition-all duration-300 cursor-pointer">
                {/* Icono del carrito */}
                <ShoppingCart className="w-6 h-6 text-black" />

                {/* Burbuja del contador - SOLO cuando hay productos */}
                {totalItems > 0 && (
                  <div className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold bg-red-500 text-white">
                    {totalItems}
                  </div>
                )}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NavbarDesktop;
