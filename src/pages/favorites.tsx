import { useAuth } from "@/hooks/auth/useAuth";
import { useCart } from "@/hooks/cart/useCart";
import { supabase } from "@/lib/supabaseClient";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { useFavorites } from "@/hooks/favorites/useFavorites";
import { formatPrice } from "@/utils/formatters";

interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
  categoria: string;
  stock: number;
}

function Favorites() {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const {
    favorites,
    toggleFavorite,
    isLoading: favoritesLoading,
    isRemoving,
  } = useFavorites();

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["favorite-products", favorites],
    queryFn: async (): Promise<Product[]> => {
      if (!favorites.length) return [];

      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .in("id", favorites);

      if (error) throw error;
      return data || [];
    },
    enabled: favorites.length > 0,
  });

  // Manejar agregar al carrito
  const handleAddToCart = (producto: Product) => {
    const cartItem = {
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
    };

    addToCart(cartItem);
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? "animate-custom-enter" : "animate-custom-leave"
        } max-w-xs w-full bg-[#FF9340] shadow-lg rounded-lg pointer-events-auto flex`}
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
              <p className="mt-1 text-sm text-white font-medium">¡Agregado al carrito!</p>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  // Manejar toggle de favoritos (opcional - más eficiente)
  const handleToggleFavorite = (productId: string) => {
    toggleFavorite(productId);
  };

  // Loading combinado
  const isLoading = favoritesLoading || productsLoading;

  // Redirigir si no está logueado
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-8 sm:mb-12">
            Mis Favoritos
          </h1>
          <div className="text-center py-12 sm:py-20">
            <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-base sm:text-lg mb-4">
              Inicia sesión para ver tus favoritos
            </p>
            <Link to="/">
              <Button className="cursor-pointer text-sm sm:text-base">
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Usar favoritesLoading del hook
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-8 sm:mb-12">
            Mis Favoritos
          </h2>
          <div className="text-center py-12 sm:py-20">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-500 text-sm sm:text-base">
              Cargando favoritos...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen w-full bg-gray-100 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-8 sm:mb-12">
            Mis Favoritos
          </h2>
          <div className="text-center py-8 sm:py-12 lg:py-20">
            <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-base sm:text-lg mb-4">
              No tienes productos favoritos aún
            </p>
            <Link to="/">
              <Button className="cursor-pointer text-sm sm:text-base">
                Explorar Productos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">
            Mis Favoritos
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mt-2">
            {products.length} {products.length === 1 ? "producto" : "productos"}{" "}
            en tu lista de favoritos
          </p>
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
            >
              {/* Imagen del producto */}
              <div className="relative bg-gray-100 aspect-square">
                <img
                  src={product.imagen_url}
                  alt={product.nombre}
                  className="w-full h-full object-cover"
                />

                {/* Botón de corazón */}
                <button
                  onClick={() => handleToggleFavorite(product.id)}
                  disabled={isRemoving}
                  className="absolute top-3 right-3 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-200 shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRemoving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                  ) : (
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 fill-red-500" />
                  )}
                </button>
              </div>

              {/* Información del producto */}
              <div className="flex flex-col flex-1 p-3 sm:p-4">
                <div className="flex-1 mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-2">
                    {product.nombre}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3">
                    {product.descripcion}
                  </p>
                </div>

                <div className="mt-auto">
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                    S/ {formatPrice(product.precio)}
                  </p>

                  {/* Botón añadir al carrito */}
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white cursor-pointer text-xs sm:text-sm"
                    size="sm"
                  >
                    <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Añadir al carrito
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Favorites;
