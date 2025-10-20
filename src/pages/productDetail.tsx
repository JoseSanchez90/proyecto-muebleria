// src/pages/ProductDetail.tsx
import { useParams, Link } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  ChevronRight,
  Minus,
  Plus,
  Star,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useFavorites } from "@/hooks/favorites/useFavorites";
import { useCart } from "@/hooks/cart/useCart";
import { useProductDetail } from "@/hooks/products/useProductDetail";
import { useRelatedProducts } from "@/hooks/products/useRelatedProducts";
import { useState } from "react";
import { useRef } from "react";

function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { toggleFavorite, isFavorite, isToggling } = useFavorites();
  const { data: producto, isLoading, error } = useProductDetail(id);
  const { data: productosRelacionados = [] } = useRelatedProducts(
    producto?.categoria,
    id
  );
  const [cantidad, setCantidad] = useState(1);
  const { addToCart, isAdding } = useCart();
  const scrollRelatedRef = useRef<HTMLDivElement>(null);

  // MODIFICAR handleAddToCart para usar la cantidad
  const handleAddToCart = () => {
    if (!producto) return;

    console.log("Agregando al carrito:", {
      producto: producto.nombre,
      cantidadSeleccionada: cantidad,
    });

    // ENVIAR producto Y cantidad
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
      quantity: cantidad, // ENVIAR la cantidad seleccionada
    });

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
              <p className="mt-1 text-sm text-white font-medium">
                ¡Agregado al carrito!
              </p>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  // MANEJAR CARGANDO
  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando producto...</p>
        </div>
      </main>
    );
  }

  // MANEJAR ERROR O PRODUCTO NO ENCONTRADO
  if (error || !producto) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6">
        <div className="text-center max-w-md">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">
            {error ? "Error al cargar producto" : "Producto no encontrado"}
          </h1>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            {error
              ? "Intenta recargar la página"
              : "El producto que buscas no existe o ha sido removido"}
          </p>
          <Link to="/">
            <Button className="cursor-pointer text-sm sm:text-base">
              Volver al inicio
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 py-6 sm:py-8 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Breadcrumb */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
            <Link to="/" className="hover:text-black transition-colors">
              Inicio
            </Link>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            <Link
              to="/productos"
              className="hover:text-black transition-colors"
            >
              Productos
            </Link>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-black font-medium truncate max-w-[150px] sm:max-w-none">
              {producto.nombre}
            </span>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 p-4 sm:p-6 lg:p-8">
            {/* Galería de imágenes */}
            <section className="space-y-4">
              {/* Imagen principal */}
              <div className="bg-gray-50 rounded-xl overflow-hidden">
                <img
                  src={producto.imagen_url}
                  alt={producto.nombre}
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                />
              </div>

              {/* Miniaturas */}
              <div className="grid grid-cols-4 gap-3 sm:gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:border-orange-500 transition-colors"
                  >
                    <img
                      src={producto.imagen_url}
                      alt={`Vista ${i}`}
                      className="w-full h-16 sm:h-20 object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Información del producto */}
            <section className="space-y-6">
              {/* Header del producto */}
              <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  {producto.nombre}
                </h1>

                {/* Rating y categoría */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <span className="ml-1">(0 reseñas)</span>
                  </div>
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                    {producto.categoria}
                  </span>
                </div>
              </div>

              {/* Precio */}
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                S/ {producto.precio.toFixed(2)}
              </div>

              {/* Descripción */}
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                {producto.descripcion}
              </p>

              {/* Stock */}
              <div
                className={`text-sm font-medium ${
                  producto.stock > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {producto.stock > 0
                  ? `✓ En stock (${producto.stock} disponibles)`
                  : "✗ Agotado"}
              </div>

              {/* Cantidad y botones */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Selector de cantidad */}
                  <div className="flex items-center bg-white border border-gray-300 rounded-lg w-fit">
                    <button
                      onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                      disabled={cantidad <= 1}
                      className="p-2 sm:p-3 rounded-l-lg cursor-pointer hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <span className="px-4 sm:px-6 font-semibold text-sm sm:text-base min-w-[3rem] text-center">
                      {cantidad}
                    </span>
                    <button
                      onClick={() =>
                        setCantidad(Math.min(producto.stock, cantidad + 1))
                      }
                      disabled={cantidad >= producto.stock}
                      className="p-2 sm:p-3 rounded-r-lg cursor-pointer hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-3 flex-1">
                    <button
                      onClick={handleAddToCart}
                      disabled={producto.stock === 0 || isAdding}
                      className="w-full flex items-center justify-center cursor-pointer bg-orange-600 hover:bg-orange-700 text-white text-sm sm:text-base rounded-lg disabled:opacity-50"
                    >
                      <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      {isAdding ? "Agregando..." : `Añadir al carrito`}
                    </button>

                    <button
                      onClick={() => toggleFavorite(producto.id)}
                      disabled={isToggling}
                      className="w-12 h-12 flex-shrink-0 flex justify-center items-center bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <Heart
                        className={`w-5 h-5 transition-colors ${
                          isFavorite(producto.id)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-400 hover:text-red-500"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Acordeones */}
              <div className="space-y-2 border-t border-gray-200 pt-6">
                <details className="group">
                  <summary className="font-semibold cursor-pointer flex justify-between items-center py-3 text-sm sm:text-base">
                    Descripción completa
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-open:rotate-90" />
                  </summary>
                  <div className="mt-3 text-gray-600 text-sm sm:text-base leading-relaxed">
                    {producto.descripcion}
                  </div>
                </details>

                <details className="group border-t border-gray-100">
                  <summary className="font-semibold cursor-pointer flex justify-between items-center py-3 text-sm sm:text-base">
                    Especificaciones
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-open:rotate-90" />
                  </summary>
                  <div className="mt-3 text-gray-600 text-sm sm:text-base space-y-2">
                    <div className="flex justify-between py-1">
                      <span>Stock disponible:</span>
                      <span className="font-medium">
                        {producto.stock} unidades
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Categoría:</span>
                      <span className="font-medium">{producto.categoria}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Garantía:</span>
                      <span className="font-medium">1 año</span>
                    </div>
                  </div>
                </details>

                <details className="group border-t border-gray-100">
                  <summary className="font-semibold cursor-pointer flex justify-between items-center py-3 text-sm sm:text-base">
                    Reseñas de clientes (0)
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-open:rotate-90" />
                  </summary>
                  <div className="mt-3 text-gray-600 text-sm sm:text-base">
                    Aún no hay reseñas para este producto. Sé el primero en
                    opinar.
                  </div>
                </details>
              </div>
            </section>
          </div>
        </div>

        {/* Productos relacionados */}
        {productosRelacionados.length > 0 && (
          <section className="mt-12 sm:mt-16 lg:mt-20">
            {/* Header con controles */}
            <div className="flex justify-between items-center mb-6 sm:mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  Productos Relacionados
                </h2>
                <p className="text-gray-600 text-sm sm:text-base mt-2">
                  Descubre productos similares que te podrían interesar
                </p>
              </div>

              {/* Controles del carousel - Solo en móvil */}
              <div className="flex gap-2 lg:hidden">
                <button
                  onClick={() => {
                    if (scrollRelatedRef.current) {
                      const container = scrollRelatedRef.current;
                      const cardWidth =
                        container.querySelector(".related-card")?.clientWidth ||
                        0;
                      const gap = 24;
                      const scrollAmount = cardWidth + gap;
                      container.scrollBy({
                        left: -scrollAmount,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    if (scrollRelatedRef.current) {
                      const container = scrollRelatedRef.current;
                      const cardWidth =
                        container.querySelector(".related-card")?.clientWidth ||
                        0;
                      const gap = 24;
                      const scrollAmount = cardWidth + gap;
                      container.scrollBy({
                        left: scrollAmount,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Grid para desktop */}
            <div className="hidden lg:grid lg:grid-cols-4 gap-6 lg:pb-12">
              {productosRelacionados.slice(0, 4).map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group"
                >
                  <Link to={`/productos/${prod.id}`} className="block">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={prod.imagen_url}
                        alt={prod.nombre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                  <div className="p-4 space-y-3">
                    <h3 className="font-medium text-gray-900 text-base line-clamp-2 min-h-[2.5rem]">
                      {prod.nombre}
                    </h3>
                    <p className="text-xl font-bold text-gray-900">
                      S/ {prod.precio.toFixed(2)}
                    </p>
                    <Button
                      size="sm"
                      onClick={() => {
                        // Aquí podrías agregar lógica para agregar el producto relacionado
                        const cartItem = {
                          product: {
                            id: prod.id,
                            nombre: prod.nombre,
                            descripcion: prod.descripcion,
                            precio: prod.precio,
                            imagen_url: prod.imagen_url,
                            categoria: prod.categoria,
                            stock: prod.stock,
                          },
                          quantity: 1,
                        };
                        addToCart(cartItem);

                        toast.custom((t) => (
                          <div
                            className={`${
                              t.visible
                                ? "animate-custom-enter"
                                : "animate-custom-leave"
                            } max-w-xs w-full bg-[#ff892f] shadow-lg rounded-lg pointer-events-auto flex`}
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
                                  <p className="text-sm font-medium text-white line-clamp-1">
                                    {producto.nombre}
                                  </p>
                                  <p className="mt-1 text-sm text-white">
                                    ¡Agregado al carrito!
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ));
                      }}
                      disabled={prod.stock === 0}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {prod.stock === 0 ? "Agotado" : "Agregar al carrito"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel para móvil */}
            <div className="lg:hidden">
              <div
                ref={scrollRelatedRef}
                className="flex overflow-x-auto scrollbar-hide gap-6 pb-4 snap-x snap-mandatory"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {productosRelacionados.map((prod) => (
                  <div
                    key={prod.id}
                    className="related-card flex-none w-[70vw] max-w-sm border border-gray-300 bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all group snap-start"
                  >
                    {/* Imagen del producto */}
                    <Link to={`/productos/${prod.id}`} className="block">
                      <div className="aspect-square w-full overflow-hidden relative cursor-pointer">
                        <img
                          src={prod.imagen_url}
                          alt={prod.nombre}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>

                    {/* Información del producto */}
                    <div className="p-4 space-y-3">
                      {/* Nombre del producto */}
                      <h3 className="font-bold text-lg line-clamp-1">
                        {prod.nombre}
                      </h3>

                      {/* Descripción */}
                      <p className="text-gray-600 text-sm line-clamp-2 min-h-[2.5rem]">
                        {prod.descripcion}
                      </p>

                      {/* Precio */}
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-gray-900">
                          S/ {prod.precio.toFixed(2)}
                        </span>
                      </div>

                      {/* Botón de comprar */}
                      <Button
                        size="lg"
                        onClick={() => {
                          const cartItem = {
                            product: {
                              id: prod.id,
                              nombre: prod.nombre,
                              descripcion: prod.descripcion,
                              precio: prod.precio,
                              imagen_url: prod.imagen_url,
                              categoria: prod.categoria,
                              stock: prod.stock,
                            },
                            quantity: 1,
                          };
                          addToCart(cartItem);

                          toast.custom((t) => (
                            <div
                              className={`${
                                t.visible
                                  ? "animate-custom-enter"
                                  : "animate-custom-leave"
                              } max-w-xs w-full bg-[#ff892f] shadow-lg rounded-lg pointer-events-auto flex`}
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
                                    <p className="text-sm font-medium text-white line-clamp-1">
                                      {producto.nombre}
                                    </p>
                                    <p className="mt-1 text-sm text-white">
                                      ¡Agregado al carrito!
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ));
                        }}
                        disabled={prod.stock === 0}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white cursor-pointer"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {prod.stock === 0 ? "Agotado" : "Agregar al carrito"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default ProductDetail;
