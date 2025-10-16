// src/pages/ProductDetail.tsx
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, Heart, ChevronRight, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import toast from "react-hot-toast";
import { useFavorites } from "@/hooks/favorites/useFavorites";
import { useCart } from "@/hooks/cart/useCart";
import { useProductDetail } from "@/hooks/products/useProductDetail";
import { useRelatedProducts } from "@/hooks/products/useRelatedProducts";
import { useState } from "react";

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

  // MODIFICAR handleAddToCart para usar la cantidad
  const handleAddToCart = () => {
    if (!producto) return;
    
    console.log('Agregando al carrito:', {
      producto: producto.nombre,
      cantidadSeleccionada: cantidad
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
      quantity: cantidad  // ENVIAR la cantidad seleccionada
    });

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
                className="h-14 w-14 rounded-sm"
                src={producto.imagen_url}
                alt={producto.nombre}
              />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                {producto.nombre}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                ¡Agregado {cantidad} {cantidad === 1 ? 'unidad' : 'unidades'} al carrito!
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
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </main>
    );
  }

  // MANEJAR ERROR O PRODUCTO NO ENCONTRADO
  if (error || !producto) {
    return (
      <main className="min-h-screen flex items-center justify-center pt-8 bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {error ? "Error al cargar producto" : "Producto no encontrado"}
          </h1>
          <Link to="/" className="text-blue-600 hover:underline">
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4">
      <section className="max-w-5xl 2xl:max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mx-auto px-4 py-2 2xl:py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-black">
              Inicio
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/productos" className="hover:text-black">
              Productos
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-black">{producto.nombre}</span>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="mx-auto px-4 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Galería de imágenes */}
            <section>
              <div className="bg-gray-100 rounded-2xl overflow-hidden mb-4">
                <img
                  src={producto.imagen_url}
                  alt={producto.nombre}
                  className="w-full h-[400px] 2xl:h-[500px] object-cover"
                />
              </div>

              {/* Miniaturas */}
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="border-2 border-gray-300 rounded-lg overflow-hidden cursor-pointer hover:border-black transition"
                  >
                    <img
                      src={producto.imagen_url}
                      alt={`Vista ${i}`}
                      className="w-full h-24 object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Información del producto */}
            <section>
              <h1 className="text-3xl 2xl:text-4xl font-bold mb-4">{producto.nombre}</h1>

              <p className="text-gray-600 mb-8 leading-relaxed">
                {producto.descripcion}
              </p>

              <div className="text-2xl 2xl:text-3xl font-bold text-black mb-8">
                S/ {producto.precio.toFixed(2)}
              </div>

              {/* Opciones */}
              {/* <div className="space-y-6 mb-8">
                <Select>
                  <label className="block text-sm font-semibold mb-3">
                    Color
                  </label>
                  <SelectTrigger className="w-full border border-gray-400 bg-white">
                    <SelectValue placeholder="Selecciona el color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="roble">Roble Natural</SelectItem>
                      <SelectItem value="negro">Negro</SelectItem>
                      <SelectItem value="blanco">Blanco</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Select>
                  <label className="block text-sm font-semibold mb-3">
                    Material
                  </label>
                  <SelectTrigger className="w-full border border-gray-400 bg-white">
                    <SelectValue placeholder="Selecciona el material" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="tela">Tela</SelectItem>
                      <SelectItem value="cuero">Cuero</SelectItem>
                      <SelectItem value="madera">Madera</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div> */}

              {/* Cantidad y botones */}
              <div className="flex gap-6 mb-10">
                <div className="flex items-center bg-white border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                    className="p-2 rounded-l-lg cursor-pointer hover:bg-gray-400"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="px-6 font-semibold">{cantidad}</span>
                  <button
                    onClick={() =>
                      setCantidad(Math.min(producto.stock, cantidad + 1))
                    }
                    className="p-2 rounded-r-lg cursor-pointer hover:bg-gray-400"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={producto.stock === 0 || isAdding}
                  className="flex-1 cursor-pointer text-white text-lg disabled:opacity-50"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {isAdding ? "Agregando..." : `Añadir al carrito`}
                </Button>

                <button
                  onClick={() => toggleFavorite(producto.id)}
                  disabled={isToggling}
                  className="w-10 flex justify-center cursor-pointer items-center bg-white rounded-full shadow-md hover:bg-gray-50 transition disabled:opacity-50"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isFavorite(producto.id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-400 hover:text-red-500"
                    }`}
                  />
                </button>
              </div>

              {/* Acordeones */}
              <div className="2xl:space-y-2">
                <details className="border-b border-gray-200 py-4">
                  <summary className="font-semibold cursor-pointer flex justify-between items-center">
                    Descripción completa
                    <ChevronRight className="w-5 h-5" />
                  </summary>
                  <p className="mt-4 text-gray-600">{producto.descripcion}</p>
                </details>

                <details className="border-b border-gray-200 py-4">
                  <summary className="font-semibold cursor-pointer flex justify-between items-center">
                    Especificaciones
                    <ChevronRight className="w-5 h-5" />
                  </summary>
                  <ul className="mt-4 text-gray-600 space-y-2">
                    <li>• Stock disponible: {producto.stock} unidades</li>
                    <li>• Categoría: {producto.categoria}</li>
                    <li>• Garantía: 1 año</li>
                  </ul>
                </details>

                <details className="border-b border-gray-200 py-4">
                  <summary className="font-semibold cursor-pointer flex justify-between items-center">
                    Reseñas de clientes (0)
                    <ChevronRight className="w-5 h-5" />
                  </summary>
                  <p className="mt-4 text-gray-600">
                    Aún no hay reseñas para este producto.
                  </p>
                </details>
              </div>
            </section>
          </div>

          {/* Productos relacionados */}
          {productosRelacionados.length > 0 && (
            <section className="mt-20">
              <h2 className="text-3xl font-bold mb-8">
                Productos Relacionados
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {productosRelacionados.map((prod) => (
                  <div
                    key={prod.id}
                    className="border bg-white border-gray-200 rounded-2xl"
                  >
                    <Link to={`/productos/${prod.id}`} className="group">
                      <div className="rounded-t-2xl overflow-hidden">
                        <img
                          src={prod.imagen_url}
                          alt={prod.nombre}
                          className="w-full h-52 2xL:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>
                    <div className="p-4 space-y-2">
                      <h3 className="text-lg mb-2">{prod.nombre}</h3>
                      <p className="text-black font-bold">
                        S/ {prod.precio.toFixed(2)}
                      </p>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart()}
                        disabled={prod.stock === 0}
                        className="w-full cursor-pointer"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {prod.stock === 0 ? "Agotado" : "Agregar al carrito"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}

export default ProductDetail;