import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/cart/useCart";
import { useFavorites } from "@/hooks/favorites/useFavorites";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { formatPrice } from "@/utils/formatters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/auth/useAuth";
import { IoShareSocialSharp } from "react-icons/io5";

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
  categoria: string;
  stock: number;
  mas_vendido: boolean;
  lo_ultimo: boolean;
  nuevo: boolean;
  created_at: string;
}

function Mesas() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<Producto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { addToCart, isAdding } = useCart();
  const { toggleFavorite, isFavorite, isToggling } = useFavorites();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Cargar productos de la categoría Mesas
  useEffect(() => {
    const loadProductos = async () => {
      try {
        const { data, error } = await supabase
          .from("productos")
          .select("*")
          .eq("categoria", "Mesas")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error al cargar mesas:", error);
          return;
        }

        if (data) {
          setProductos(data);
          setFilteredProducts(data);
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProductos();
  }, []);

  // Filtrar y ordenar productos
  useEffect(() => {
    let filtered = productos.filter(
      (producto) =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (sortBy) {
      case "price-asc":
        filtered = [...filtered].sort((a, b) => a.precio - b.precio);
        break;
      case "price-desc":
        filtered = [...filtered].sort((a, b) => b.precio - a.precio);
        break;
      case "name":
        filtered = [...filtered].sort((a, b) =>
          a.nombre.localeCompare(b.nombre)
        );
        break;
      case "newest":
      default:
        filtered = [...filtered].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
    }

    setFilteredProducts(filtered);
  }, [searchTerm, sortBy, productos]);

  const handleAddToCart = (producto: Producto, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    addToCart({
      product: {
        id: producto.id,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        imagen_url: producto.imagen_url,
        categoria: producto.categoria,
        stock: producto.stock,
      },
      quantity: 1,
    });

    toast.custom((t) => (
      <div
        className={`${
          t.visible ? "animate-custom-enter" : "animate-custom-leave"
        } max-w-xs w-full bg-[#2735F5] shadow-lg rounded-lg pointer-events-auto flex`}
      >
        <div className="flex-1 w-0 p-2">
          <div className="flex items-center justify-center">
            <div className="flex-shrink-0 pt-0.5">
              <img
                className="h-14 w-14 rounded-sm object-cover"
                src={producto.imagen_url}
                alt={producto.nombre}
              />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-bold text-white line-clamp-1">
                {producto.nombre}
              </p>
              <p className="mt-1 text-sm text-white font-medium">
                ¡Agregado al carrito!
              </p>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  // función para manejar favoritos con stopPropagation
  const handleToggleFavorite = (productoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(productoId);
  };

  // Función para compartir producto - Versión simplificada
  const handleShareProduct = async (
    producto: Producto,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    const productUrl = `${window.location.origin}/productos/${producto.id}`;

    const textToCopy = `${productUrl}`;

    try {
      // Intentar usar la Clipboard API moderna primero
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback para navegadores antiguos
        const tempInput = document.createElement("input");
        tempInput.value = textToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
      }

      toast.success("¡Enlace copiado al portapapeles!");
    } catch (error) {
      console.error("Error al copiar al portapapeles:", error);
      toast.error("Error al copiar el enlace");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando mesas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mesas</h1>
          <p className="text-gray-600">
            Descubre mesas funcionales y elegantes para cada espacio
          </p>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 w-full lg:w-auto">
              <Input
                placeholder="Buscar mesas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full lg:w-80"
              />
            </div>
            <div className="flex gap-4 w-full lg:w-auto">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full lg:w-[200px]">
                  <SelectValue placeholder="Ordenar por..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Más recientes</SelectItem>
                  <SelectItem value="price-asc">
                    Precio: Menor a Mayor
                  </SelectItem>
                  <SelectItem value="price-desc">
                    Precio: Mayor a Menor
                  </SelectItem>
                  <SelectItem value="name">Nombre A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Grid de productos */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 text-lg">No se encontraron mesas</p>
            <p className="text-gray-400 text-sm mt-2">
              {searchTerm
                ? "Intenta con otros términos de búsqueda"
                : "Próximamente más productos"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((producto) => (
              <div
                key={producto.id}
                className="border border-gray-300 bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all group flex flex-col"
                onMouseEnter={() => setHoveredId(producto.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* código del producto */}
                <div
                  className="aspect-square w-full h-48 2xl:h-60 overflow-hidden relative cursor-pointer"
                  onClick={() => navigate(`/productos/${producto.id}`)}
                >
                  <img
                    src={producto.imagen_url}
                    alt={producto.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      console.error(
                        "Error al cargar imagen:",
                        producto.imagen_url
                      );
                      e.currentTarget.src =
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%239ca3af"%3EImagen no disponible%3C/text%3E%3C/svg%3E';
                    }}
                  />

                  {/* Overlay con botones */}
                  <div
                    className={`hidden lg:flex absolute inset-0 bg-black/40 flex-col items-center justify-center gap-4 transition-opacity duration-300 ${
                      hoveredId === producto.id ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <Button
                      onClick={(e) => handleShareProduct(producto, e)}
                      className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-orange-600 hover:text-white transition-all duration-300 flex items-center gap-2 shadow-lg cursor-pointer"
                    >
                      <IoShareSocialSharp className="w-4 h-4" />
                      Compartir enlace
                    </Button>
                    <Button
                      onClick={(e) => handleAddToCart(producto, e)}
                      disabled={producto.stock === 0 || isAdding}
                      className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-orange-600 hover:text-white transition-all duration-300 flex items-center gap-2 shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {isAdding ? "Agregando..." : "Agregar al carrito"}
                    </Button>
                    <Button
                      onClick={(e) => handleToggleFavorite(producto.id, e)}
                      disabled={isToggling || !user}
                      className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-orange-600 hover:text-white transition-all duration-300 flex items-center gap-2 shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isFavorite(producto.id)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-400 hover:text-red-500"
                        }`}
                      />
                      Añadir a Favoritos
                    </Button>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-2">
                    {producto.mas_vendido && (
                      <span className="bg-purple-600 px-2 py-1 rounded-full text-xs font-semibold text-white">
                        Más Vendido
                      </span>
                    )}
                    {producto.lo_ultimo && (
                      <span className="bg-[#211C84] px-2 py-1 rounded-full text-xs font-semibold text-white">
                        Lo último
                      </span>
                    )}
                    {producto.nuevo && (
                      <span className="bg-green-500 px-2 py-1 rounded-full text-xs font-semibold text-white">
                        Nuevo
                      </span>
                    )}
                  </div>

                  {/* Badge de categoría */}
                  {producto.categoria && (
                    <div className="absolute top-2 right-2">
                      <span className="bg-orange-500 px-2 py-1 rounded-full text-xs font-semibold text-white">
                        {producto.categoria}
                      </span>
                    </div>
                  )}

                  {/* Indicador de stock */}
                  {producto.stock === 0 && (
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-red-500 px-2 py-1 rounded-full text-xs font-semibold text-white">
                        Agotado
                      </span>
                    </div>
                  )}
                </div>

                {/* Información del producto */}
                <div className="flex flex-col justify-between flex-1 p-4 min-h-[120px]">
                  <div className="flex-1 min-h-[48px] max-h-[48px] overflow-hidden">
                    <h3
                      className="font-semibold text-md cursor-pointer text-gray-800 hover:text-orange-600 transition-colors line-clamp-2"
                      onClick={() => navigate(`/productos/${producto.id}`)}
                    >
                      {producto.nombre}
                    </h3>
                  </div>

                  <div className="mt-auto pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-md 2xl:text-lg font-bold text-gray-900">
                        S/ {formatPrice(producto.precio)}
                      </span>
                      {producto.stock < 10 && producto.stock > 0 && (
                        <span className="flex lg:flex-col text-xs gap-1 text-orange-600 font-medium">
                          <p>Quedan {producto.stock}</p>
                          <p>unidades</p>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Botón de comprar para móvil */}
                <div className="p-4 pt-0 md:hidden">
                  <Button
                    size="lg"
                    onClick={() => handleAddToCart(producto)}
                    disabled={producto.stock === 0 || isAdding}
                    className="w-full bg-orange-600 text-white hover:bg-orange-700 cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {isAdding
                      ? "Agregando..."
                      : producto.stock === 0
                      ? "Agotado"
                      : "Agregar al carrito"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Mesas;
