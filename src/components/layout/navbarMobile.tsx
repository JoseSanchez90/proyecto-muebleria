// components/NavbarMobile.tsx
import { useState, useRef, useEffect } from "react";
import {
  Menu,
  X,
  ShoppingCart,
  LogOut,
  Search,
  ChevronDown,
  ChevronRight,
  User,
  Heart,
  Package,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth/useAuth";
import { useCart } from "@/hooks/cart/useCart";
import { useProfile } from "@/hooks/useProfile";
import toast from "react-hot-toast";
import LoginModal from "@/pages/loginModal";
import RegisterModal from "@/pages/registerModal";
import ForgotPasswordModal from "@/pages/forgotPasswordModal";
import { useProducts } from "@/hooks/products/useProducts";
import { Link, useNavigate, useLocation } from "react-router-dom";

function NavbarMobile() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { products: allProducts, isLoading: productsLoading } = useProducts();
  const { user, signOut } = useAuth();
  const { totalItems, isLoading } = useCart();
  const { data: profileData } = useProfile(user?.id);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Datos del usuario
  const userName = profileData?.name || user?.user_metadata?.name || "";
  const userAvatar = profileData?.avatar_url || user?.user_metadata?.avatar_url;

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  // Función de búsqueda
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim().length === 0) {
      setSearchResults([]);
      setShowResults(false);
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
    setShowResults(true);
  };

  // Realizar búsqueda completa
  const performSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/productos?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setShowResults(false);
      setSearchQuery("");
    }
  };

  // Navegar a producto desde resultado
  const handleResultClick = (productId: number) => {
    navigate(`/productos/${productId}`);
    setSearchOpen(false);
    setShowResults(false);
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
    try {
      await signOut();
      setIsMenuOpen(false);
      setShowUserMenu(false);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Hubo un problema al cerrar sesión.");
    } finally {
      setLoggingOut(false);
    }
  };

  // Toggle categorías
  const toggleCategory = (category: string) => {
    setOpenCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
        setShowResults(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Categorías y subcategorías
  const categories = [
    {
      title: "Sillas",
      items: [
        { label: "Comedor", path: "/silla/comedor" },
        { label: "Oficina", path: "/silla/oficina" },
        { label: "Todos", path: "/sillas" },
      ],
    },
    {
      title: "Mesas",
      items: [
        { label: "Comedor", path: "/mesas/comedor" },
        { label: "Centro", path: "/mesas/centro" },
        { label: "Todos", path: "/mesas" },
      ],
    },
    {
      title: "Decoración",
      items: [
        { label: "Cocina", path: "/decoracion/cocina" },
        { label: "Baño", path: "/decoracion/baño" },
        { label: "Paredes", path: "/decoracion/paredes" },
        { label: "Todos", path: "/decoracion" },
      ],
    },
  ];

  return (
    <section className="flex lg:hidden w-full bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="w-full px-4 py-3">
        {/* Header principal */}
        <div className="flex items-center justify-between">
          {/* Logo solamente */}
          <Link to="/" className="flex items-center">
            <img src="/logo.png" className="w-10" alt="Munfort" />
          </Link>

          {/* Iconos derecha */}
          <div className="flex items-center gap-3">
            {/* Botón de búsqueda */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>

            {/* Carrito */}
            <Link
              to="/carrito"
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              {isLoading ? (
                <div className="absolute -top-1 -right-1 bg-gray-300 rounded-full w-4 h-4 animate-pulse"></div>
              ) : totalItems > 0 ? (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-medium">
                  {totalItems}
                </span>
              ) : null}
            </Link>

            {/* Avatar del usuario cuando está logueado */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg transition-colors min-w-0"
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300 flex-shrink-0">
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600 text-white text-xs font-bold">
                        {userName?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                  </div>

                  {/* Nombre abreviado */}
                  <span className="text-sm font-medium text-gray-800 truncate max-w-20 hidden sm:block">
                    {userName ? userName.split(" ")[0] : "Usuario"}
                  </span>

                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      showUserMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Menú desplegable del usuario */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    {/* Header del usuario */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 flex-shrink-0">
                          {userAvatar ? (
                            <img
                              src={userAvatar}
                              alt="Avatar"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600 text-white text-sm font-bold">
                              {userName?.[0]?.toUpperCase() || "U"}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {userName || "Usuario"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user?.email || ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Opciones del menú */}
                    <Link
                      to="/perfil"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">Mi perfil</span>
                    </Link>

                    <Link
                      to="/mis-favoritos"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Heart className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">Mis favoritos</span>
                    </Link>

                    <Link
                      to="/mis-pedidos"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">Mis pedidos</span>
                    </Link>

                    {/* Separador */}
                    <div className="border-t border-gray-100 my-2"></div>

                    {/* Cerrar sesión */}
                    <button
                      onClick={handleSignOut}
                      disabled={loggingOut}
                      className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      {loggingOut ? (
                        <>
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                          <span className="text-sm">Cerrando sesión...</span>
                        </>
                      ) : (
                        <>
                          <LogOut className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm">Cerrar sesión</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : null}

            {/* Menú hamburguesa - SIEMPRE VISIBLE */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Barra de búsqueda desplegable */}
        {searchOpen && (
          <div ref={searchRef} className="mt-3 animate-in fade-in duration-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar productos..."
                className="pl-10 w-full bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                autoFocus
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>

            {/* Resultados de búsqueda */}
            {showResults && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <>
                    {/* Resultados encontrados */}
                    {searchResults.slice(0, 4).map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleResultClick(product.id)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-14 h-14 rounded object-cover"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {product.category}
                            </p>
                          </div>
                          {/* <span className="text-sm font-semibold text-orange-600">
                            S/ {product.price}
                          </span> */}
                        </div>
                      </button>
                    ))}

                    {/* Ver todos los resultados */}
                    {searchResults.length > 4 && (
                      <button
                        onClick={performSearch}
                        className="w-full text-center px-4 py-3 bg-gray-50 hover:bg-gray-100 text-sm font-medium text-orange-600 transition-colors cursor-pointer"
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
                  </div>
                ) : null}
              </div>
            )}
          </div>
        )}

        {/* Menú desplegable principal - SIEMPRE DISPONIBLE */}
        <div
          ref={menuRef}
          className={`
          absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-200 
          max-h-[80vh] overflow-y-auto z-40 transition-all duration-300 ease-in-out
          ${
            isMenuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-4 opacity-0 pointer-events-none"
          }
        `}
        >
          <div className="p-4">
            {/* Navegación principal */}
            <div className="space-y-1">
              <Link
                to="/"
                className={`block py-3 px-4 rounded-lg font-medium transition-colors ${
                  isActiveRoute("/")
                    ? "text-orange-600 bg-orange-50"
                    : "text-gray-800 hover:bg-gray-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                to="/productos"
                className={`block py-3 px-4 rounded-lg font-medium transition-colors ${
                  isActiveRoute("/productos")
                    ? "text-orange-600 bg-orange-50"
                    : "text-gray-800 hover:bg-gray-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Productos
              </Link>
              <Link
                to="/sofas"
                className={`block py-3 px-4 rounded-lg font-medium transition-colors ${
                  isActiveRoute("/sofas")
                    ? "text-orange-600 bg-orange-50"
                    : "text-gray-800 hover:bg-gray-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Sofás
              </Link>
            </div>

            {/* Categorías desplegables */}
            <div>
              {categories.map((category) => (
                <div key={category.title} className="mb-2">
                  <button
                    onClick={() => toggleCategory(category.title)}
                    className="flex items-center justify-between w-full py-3 px-4 text-gray-800 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                  >
                    <span>{category.title}</span>
                    {openCategories.includes(category.title) ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>

                  {openCategories.includes(category.title) && (
                    <div className="ml-4 space-y-1 mt-1 animate-in fade-in duration-200">
                      {category.items.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`block py-2 px-4 rounded-lg text-sm transition-colors ${
                            isActiveRoute(item.path)
                              ? "text-orange-600 bg-orange-50 font-medium"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Botones de autenticación (solo para no logueados) */}
            {!user && (
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <Button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setShowLoginModal(true);
                  }}
                  className="w-full bg-orange-600 hover:bg-orange-700 transition-colors"
                >
                  Iniciar sesión
                </Button>
                <Button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setShowRegisterModal(true);
                  }}
                  variant="outline"
                  className="w-full border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Crear cuenta
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

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
    </section>
  );
}

export default NavbarMobile;
