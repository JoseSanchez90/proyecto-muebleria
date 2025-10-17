// components/Products.tsx
import { useState } from "react";
import { useProducts } from "@/hooks/products/useProducts";
import { useCart } from "@/hooks/cart/useCart";
import { ShoppingCart, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/utils/formatters";
import { useFavorites } from "@/hooks/favorites/useFavorites";
import { useAuth } from "@/hooks/auth/useAuth";
import { IoShareSocialSharp } from "react-icons/io5";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image: string;
  category?: string;
  mas_vendido: boolean;
  lo_ultimo: boolean;
  nuevo: boolean;
  stock: number;
  created_at: string;
}

function Products() {
  const { products, isLoading, error } = useProducts();
  const { addToCart, isAdding } = useCart();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { toggleFavorite, isFavorite, isToggling } = useFavorites();
  const { user } = useAuth();
  const itemsPerPage = 20;

  const handleComprar = (product: Product, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    const cartProduct = {
      id: product.id,
      nombre: product.name,
      descripcion: product.description || "",
      precio: product.price,
      imagen_url: product.image,
      categoria: product.category || "",
      stock: product.stock,
    };

    addToCart({ product: cartProduct, quantity: 1 });

    toast.custom((t) => (
      <div
        className={`${
          t.visible ? "animate-custom-enter" : "animate-custom-leave"
        } max-w-xs w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-gray-300 ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-2">
          <div className="flex items-center justify-center">
            <div className="flex-shrink-0 pt-0.5">
              <img
                className="h-14 w-14 rounded-sm object-cover"
                src={product.image}
                alt={product.name}
              />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900 line-clamp-1">
                {product.name}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                ¡Agregado al carrito!
              </p>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  // función para manejar favoritos con stopPropagation
  const handleToggleFavorite = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(productId);
  };

  // Función para compartir producto
  const handleShareProduct = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation(); // Importante: prevenir la navegación
    
    // Generar la URL completa del producto
    const productUrl = `${window.location.origin}/productos/${product.id}`;
    
    // Texto para compartir
    const shareText = `¡Mira este producto: ${product.name} - S/ ${formatPrice(product.price)}`;
    
    try {
      // Verificar si la Web Share API está disponible (dispositivos móviles)
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: shareText,
          url: productUrl,
        });
        toast.success('¡Producto compartido!');
      } 
      // Verificar si la Clipboard API está disponible (copiar al portapapeles)
      else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareText}\n${productUrl}`);
        toast.success('¡Enlace copiado al portapapeles!');
      } 
      // Fallback para navegadores más antiguos
      else {
        // Crear un input temporal para copiar
        const tempInput = document.createElement('input');
        tempInput.value = `${shareText}\n${productUrl}`;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        toast.success('¡Enlace copiado al portapapeles!');
      }
    } catch (error) {
      console.error('Error al compartir:', error);
      
      // Si el usuario cancela el share, no mostrar error
      if (error instanceof Error && error.name !== 'AbortError') {
        toast.error('Error al compartir el producto');
      }
    }
  };

  // Cálculos de paginación
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderPageNumbers = () => {
    const pages = [];

    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => goToPage(currentPage - 1)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
      );
    }

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(
          <button
            key={i}
            onClick={() => goToPage(i)}
            className={`w-8 h-8 flex items-center justify-center rounded-full font-medium transition-colors cursor-pointer ${
              currentPage === i
                ? "bg-orange-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {i}
          </button>
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push(
          <span
            key={`ellipsis-${i}`}
            className="w-10 h-10 flex items-center justify-center text-gray-400"
          >
            ...
          </span>
        );
      }
    }

    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => goToPage(currentPage + 1)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      );
    }

    return pages;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="container mx-auto px-4 max-w-5xl 2xl:max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl 2xl:text-4xl font-bold text-black mb-2">
              Nuestros Productos
            </h1>
            <p className="text-gray-600">
              Descubre nuestra colección de muebles y decoración
            </p>
          </div>
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-xl">Cargando productos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="container mx-auto px-4 max-w-5xl 2xl:max-w-7xl text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-800 mb-2">
              Error al cargar productos
            </h2>
            <p className="text-red-600">
              Por favor, intenta de nuevo más tarde.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="container mx-auto px-4 max-w-6xl 2xl:max-w-[90rem]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl 2xl:text-4xl font-bold text-black mb-2">
            Nuestros Productos
          </h1>
          <p className="text-gray-600">
            Descubre nuestra colección de muebles y decoración
          </p>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">
              No hay productos disponibles
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6 2xl:gap-8 mb-12">
              {currentProducts.map((product) => (
                <div
                  key={product.id}
                  className="border border-gray-300 bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all group flex flex-col"
                  onMouseEnter={() => setHoveredId(product.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Imagen del producto con overlay del botón */}
                  <div
                    className="aspect-square w-full h-48 2xl:h-60 overflow-hidden relative cursor-pointer"
                    onClick={() => navigate(`/productos/${product.id}`)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        console.error("Error al cargar imagen:", product.image);
                        e.currentTarget.src =
                          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%239ca3af"%3EImagen no disponible%3C/text%3E%3C/svg%3E';
                      }}
                    />

                    {/* Overlay con botón de agregar al carrito */}
                    <div
                      className={`absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-4 transition-opacity duration-300 ${
                        hoveredId === product.id ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <Button 
                        onClick={(e) => handleShareProduct(product, e)}
                        className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-orange-600 hover:text-white transition-all duration-300 flex items-center gap-2 shadow-lg cursor-pointer"
                      >
                        <IoShareSocialSharp className="w-4 h-4" />
                        Compartir enlace
                      </Button>
                      <Button
                        onClick={(e) => handleComprar(product, e)}
                        disabled={product.stock === 0 || isAdding}
                        className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-orange-600 hover:text-white transition-all duration-300 flex items-center gap-2 shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {isAdding ? "Agregando..." : "Agregar al carrito"}
                      </Button>
                      <Button
                        onClick={(e) => handleToggleFavorite(product.id, e)}
                        disabled={isToggling || !user}
                        className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-orange-600 hover:text-white transition-all duration-300 flex items-center gap-2 shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isFavorite(product.id)
                              ? "fill-red-500 text-red-500"
                              : "text-gray-400 hover:text-red-500"
                          }`}
                        />
                        Añadir a Favoritos
                      </Button>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-2">
                      {product.mas_vendido && (
                        <span className="bg-purple-600 px-2 py-1 rounded-full text-xs font-semibold text-white">
                          Más Vendido
                        </span>
                      )}
                      {product.lo_ultimo && (
                        <span className="bg-[#211C84] px-2 py-1 rounded-full text-xs font-semibold text-white">
                          Lo último
                        </span>
                      )}
                      {product.nuevo && (
                        <span className="bg-green-500 px-2 py-1 rounded-full text-xs font-semibold text-white">
                          Nuevo
                        </span>
                      )}
                    </div>

                    {/* Badge de categoría */}
                    {product.category && (
                      <div className="absolute top-2 right-2 ">
                        <span className="bg-orange-500 px-2 py-1 rounded-full text-xs font-semibold text-white">
                          {product.category}
                        </span>
                      </div>
                    )}

                    {/* Indicador de stock */}
                    {product.stock === 0 && (
                      <div className="absolute bottom-3 left-3">
                        <span className="bg-red-500 px-2 py-1 rounded-full text-xs font-semibold text-white">
                          Agotado
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Información del producto - ALTURA FIJA */}
                  <div className="flex flex-col justify-between flex-1 p-4 min-h-[120px]">
                    {/* Nombre del producto con altura fija */}
                    <div className="flex-1 min-h-[48px] max-h-[48px] overflow-hidden">
                      <h3
                        className="font-semibold text-md cursor-pointer text-gray-800 hover:text-orange-600 transition-colors line-clamp-2"
                        onClick={() => navigate(`/productos/${product.id}`)}
                      >
                        {product.name}
                      </h3>
                    </div>

                    {/* Precio y stock info */}
                    <div className="mt-auto pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-md 2xl:text-lg font-bold text-gray-900">
                          S/ {formatPrice(product.price)}
                        </span>
                        {product.stock < 10 && product.stock > 0 && (
                          <span className="text-xs text-orange-600 font-medium">
                            {product.stock} unidades
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Botón de comprar para móvil (siempre visible) */}
                  <div className="p-4 pt-0 md:hidden">
                    <Button
                      size="lg"
                      onClick={(e) => handleComprar(product, e)}
                      disabled={product.stock === 0 || isAdding}
                      className="w-full cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {isAdding
                        ? "Agregando..."
                        : product.stock === 0
                        ? "Agotado"
                        : "Agregar al carrito"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <>
                <div className="flex items-center justify-center gap-2">
                  {renderPageNumbers()}
                </div>

                {/* Page Info */}
                <div className="text-center mt-4 text-sm text-gray-500">
                  Mostrando {startIndex + 1}-
                  {Math.min(endIndex, products.length)} de {products.length}{" "}
                  productos
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Products;