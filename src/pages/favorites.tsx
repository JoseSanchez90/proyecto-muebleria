import { useEffect, useState } from "react";
import { useAuth } from "@/components/Authentication/authContext";
import { useCart } from "@/hooks/cart/useCart";
import { supabase } from "@/lib/supabaseClient";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useFavorites } from "@/hooks/favorites/useFavorites"; // 

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

  // ✅ Usar el nuevo hook useFavorites
  const {
    favorites,
    toggleFavorite,
    isLoading: favoritesLoading,
    isRemoving,
  } = useFavorites();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar productos favoritos
  const loadFavoriteProducts = async () => {
    if (favorites.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .in("id", favorites);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error cargando productos favoritos:", error);
      toast.error("Error al cargar productos favoritos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavoriteProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favorites]); // ✅ Dependencia correcta

  // Manejar agregar al carrito
  const handleAddToCart = (product: Product) => {
    const cartItem = {
      id: product.id,
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      imagen_url: product.imagen_url,
      categoria: product.categoria,
      stock: product.stock,
      quantity: 1,
    };

    addToCart(cartItem);
    toast("Producto agregado al carrito", {
      icon: "🛒"
    });
  };

  // ✅ Manejar toggle de favoritos (opcional - más eficiente)
  const handleToggleFavorite = (productId: string) => {
    toggleFavorite(productId);
    // Los toasts se manejan automáticamente en el hook
  };

  // Redirigir si no está logueado
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-black mb-12">Mis Favoritos</h1>
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">
              Inicia sesión para ver tus favoritos
            </p>
            <Link to="/">
              <Button className="cursor-pointer">Iniciar Sesión</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Usar favoritesLoading del hook
  if (favoritesLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-black mb-12">Mis Favoritos</h1>
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-500">Cargando favoritos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen w-full bg-gray-100 px-4 pt-20">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-black mb-20">Mis Favoritos</h1>
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">
              No tienes productos favoritos aún
            </p>
            <Link to="/">
              <Button className="cursor-pointer">Explorar Productos</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-5xl 2xl:max-w-7xl mx-auto">
        <h1 className="text-3xl 2xl:text-4xl font-bold text-black mb-12">
          Mis Favoritos
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="grid grid-cols-2 2xl:flex 2xl:flex-col justify-between">
                {/* Imagen del producto */}
                <div className="bg-gray-100 relative">
                  <img
                    src={product.imagen_url}
                    alt={product.nombre}
                    className="w-full h-full object-cover"
                  />

                  {/* ✅ Botón de corazón - actualizado */}
                  <button
                    onClick={() => handleToggleFavorite(product.id)}
                    disabled={isRemoving}
                    className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-black transition-colors shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                    {isRemoving && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                      </div>
                    )}
                  </button>
                </div>

                {/* Información del producto */}
                <div className="p-4 flex flex-col justify-between">
                  <h3 className="text-lg font-semibold text-black mb-2">
                    {product.nombre}
                  </h3>
                  <div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.descripcion}
                    </p>
                    <p className="text-2xl font-bold text-black mb-4">
                      S/ {product.precio.toFixed(2)}
                    </p>

                    {/* Botón añadir al carrito */}
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="w-full cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Añadir al carrito
                    </Button>
                  </div>
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
