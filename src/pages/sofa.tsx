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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

function Sofas() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<Producto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  // const [showFilters, setShowFilters] = useState(false);
  
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite, isToggling } = useFavorites();
  const navigate = useNavigate();

  // Cargar productos de la categoría Sofás
  useEffect(() => {
    const loadProductos = async () => {
      try {
        const { data, error } = await supabase
          .from("productos")
          .select("*")
          .eq("categoria", "Sofas")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error al cargar sofás:", error);
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
    let filtered = productos.filter(producto =>
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Ordenar
    switch (sortBy) {
      case "price-asc":
        filtered = [...filtered].sort((a, b) => a.precio - b.precio);
        break;
      case "price-desc":
        filtered = [...filtered].sort((a, b) => b.precio - a.precio);
        break;
      case "name":
        filtered = [...filtered].sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case "newest":
      default:
        filtered = [...filtered].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
    }

    setFilteredProducts(filtered);
  }, [searchTerm, sortBy, productos]);

  const handleAddToCart = (producto: Producto) => {
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
      quantity: 1
    });

    toast.success("¡Producto agregado al carrito!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando sofás...</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sofás</h1>
          <p className="text-gray-600">
            Descubre nuestra colección de sofás modernos y cómodos
          </p>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 w-full lg:w-auto">
              <Input
                placeholder="Buscar sofás..."
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
            <p className="text-gray-500 text-lg">No se encontraron sofás</p>
            <p className="text-gray-400 text-sm mt-2">
              {searchTerm ? "Intenta con otros términos de búsqueda" : "Próximamente más productos"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((producto) => (
              <div
                key={producto.id}
                className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                {/* Imagen */}
                <div
                  className="aspect-square overflow-hidden relative cursor-pointer"
                  onClick={() => navigate(`/productos/${producto.id}`)}
                >
                  <img
                    src={producto.imagen_url}
                    alt={producto.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {producto.mas_vendido && (
                      <span className="bg-purple-600 px-2 py-1 rounded-full text-xs font-semibold text-white">
                        Más Vendido
                      </span>
                    )}
                    {producto.lo_ultimo && (
                      <span className="bg-blue-600 px-2 py-1 rounded-full text-xs font-semibold text-white">
                        Nuevo
                      </span>
                    )}
                    {producto.nuevo && (
                      <span className="bg-green-500 px-2 py-1 rounded-full text-xs font-semibold text-white">
                        Nuevo Ingreso
                      </span>
                    )}
                  </div>

                  {/* Botón favorito */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(producto.id);
                    }}
                    disabled={isToggling}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFavorite(producto.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600"
                      }`}
                    />
                  </button>
                </div>

                {/* Información */}
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">
                    {producto.nombre}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {producto.descripcion}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">
                      S/ {formatPrice(producto.precio)}
                    </span>
                    {producto.stock < 10 && producto.stock > 0 && (
                      <span className="text-xs text-orange-600 font-medium">
                        {producto.stock} unidades
                      </span>
                    )}
                  </div>
                  <Button
                    onClick={() => handleAddToCart(producto)}
                    disabled={producto.stock === 0}
                    className="w-full bg-orange-600 text-white hover:bg-orange-700 cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {producto.stock === 0 ? "Agotado" : "Agregar al carrito"}
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

export default Sofas;