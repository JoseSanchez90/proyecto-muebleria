import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Input } from "@/components/ui/input";
import { IoIosSearch } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, ShoppingCart, X } from "lucide-react";
import { useAuth } from "@/hooks/auth/useAuth";
import { useEffect, useRef, useState } from "react";
import LoginModal from "@/pages/loginModal";
import RegisterModal from "@/pages/registerModal";
import ForgotPasswordModal from "@/pages/forgotPasswordModal";
import toast from "react-hot-toast";
import { useCart } from "@/hooks/cart/useCart";
import { useProfile } from "@/hooks/useProfile";
import { useProducts } from "@/hooks/products/useProducts";
import { useQueryClient } from "@tanstack/react-query";

function NavbarDesktop() {
  const { user, signOut } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const { totalItems, isLoading } = useCart();
  const { data: profileData } = useProfile(user?.id);
  const navigate = useNavigate();
  // Usa tu hook de React Query para obtener los productos
  const { products: allProducts, isLoading: productsLoading } = useProducts();
  // Estados para la búsqueda
  const [searchQuery, setSearchQuery] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Función de búsqueda en tiempo real
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim().length === 0) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    // Si los productos aún están cargando, no hacer búsqueda
    if (productsLoading || !allProducts) {
      return;
    }

    const filtered = allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        (product.category &&
          product.category.toLowerCase().includes(query.toLowerCase()))
    );

    setSearchResults(filtered);
    setShowSearchResults(true);
  };

  // Realizar búsqueda completa
  const performSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/productos?search=${encodeURIComponent(searchQuery)}`);
      setShowSearchResults(false);
      setSearchQuery("");
    }
  };

  // Navegar a producto desde resultado
  const handleResultClick = (productId: string) => {
    navigate(`/productos/${productId}`);
    setShowSearchResults(false);
    setSearchQuery("");
  };

  // Manejar tecla Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      performSearch();
    }
  };

  // Cerrar sesión
  const handleSignOut = async () => {
    setLoggingOut(true);
    setShowMenu(false); // Cerrar el menú inmediatamente

    try {
      console.log("Iniciando cierre de sesión desde navbar...");

      // Forzar limpieza local ANTES del signOut para mejor UX
      queryClient.setQueryData(["auth", "user"], null);

      await signOut();

      console.log("SignOut completado desde navbar");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Hubo un problema al cerrar sesión.");
    } finally {
      setLoggingOut(false);
      setShowLoginModal(false)
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

  // DATOS PARA MOSTRAR EN EL NAVBAR
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
              <NavigationMenuLink href="/productos" className="font-semibold">
                Productos
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/sofas" className="font-semibold">
                Sofás
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/sillas" className="font-semibold">
                Sillas
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/mesas" className="font-semibold">
                Mesas
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/decoracion" className="font-semibold">
                Decoración
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center justify-center gap-6">
          {/* Búsqueda con resultados en tiempo real */}
          <div className="flex relative" ref={searchRef}>
            <IoIosSearch className="relative w-5 h-5 left-7 top-2 text-gray-400" />
            <Input
              className="pl-9 w-64 2xl:w-80 bg-white"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
            />

            {/* Botón para limpiar búsqueda */}
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setShowSearchResults(false);
                }}
                className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Resultados de búsqueda */}
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                {productsLoading ? (
                  // Loading state
                  <div className="px-4 py-6 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600 mx-auto"></div>
                    <p className="text-gray-500 text-sm mt-2">
                      Buscando productos...
                    </p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <>
                    {/* Resultados encontrados */}
                    {searchResults.slice(0, 8).map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleResultClick(product.id)}
                        className="w-full text-left px-2 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-14 h-14 rounded object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 group-hover:text-orange-600 truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {product.category}
                            </p>
                          </div>
                          {/* <span className="text-sm font-semibold text-orange-600 ml-4 whitespace-nowrap">
                            S/ {product.price}
                          </span> */}
                        </div>
                      </button>
                    ))}

                    {/* Ver todos los resultados */}
                    {searchResults.length > 8 && (
                      <button
                        onClick={performSearch}
                        className="w-full text-center px-4 py-3 bg-gray-50 hover:bg-gray-100 text-sm font-medium text-orange-600 transition-colors border-t border-gray-100"
                      >
                        Ver todos los resultados ({searchResults.length})
                      </button>
                    )}
                  </>
                ) : searchQuery.trim() ? (
                  // Sin resultados
                  <div className="px-4 py-6 text-center">
                    <p className="text-gray-500 text-sm">
                      No se encontraron productos para "{searchQuery}"
                    </p>
                    <button
                      onClick={performSearch}
                      className="mt-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
                    >
                      Buscar en todos los productos
                    </button>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Iconos de usuario y carrito */}
          <div className="flex items-center gap-6">
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
                  {/* Avatar pequeño - USAR DATOS DE REACT QUERY */}
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

                  {/* Texto del saludo - USAR DATOS DE REACT QUERY */}
                  <span className="border-b border-gray-800">
                    {userName
                      ? `Hola, ${userName.split(" ")[0]}`
                      : "Hola, usuario"}
                  </span>
                </button>

                {/* Menú desplegable */}
                {showMenu && (
                  <div className="absolute right-0 mt-10 w-72 bg-white rounded-lg shadow-lg py-2 z-50">
                    {/* Header del menú - USAR DATOS DE REACT QUERY */}
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
                    <p className="text-gray-600 text-sm underline underline-offset-4">
                      Iniciar sesión
                    </p>
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
              {isLoading ? (
                // Skeleton loader mientras carga
                <div className="absolute -top-2 -right-2 bg-gray-300 rounded-full w-5 h-5 animate-pulse"></div>
              ) : totalItems > 0 ? (
                // Contador real cuando termina de cargar
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {totalItems}
                </span>
              ) : null}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NavbarDesktop;
