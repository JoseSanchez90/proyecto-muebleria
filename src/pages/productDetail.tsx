// src/pages/ProductDetail.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { ShoppingCart, Heart, ChevronRight, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cartContext";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import AnimatedShoppingBag from "@/assets/icons/shoppingBag";
import { useFavorites } from "@/context/favoriteContext";

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
  categoria: string;
  stock: number;
  mas_vendido?: boolean;
  nuevo?: boolean;
}

function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [productosRelacionados, setProductosRelacionados] = useState<
    Producto[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [cantidad, setCantidad] = useState(1);
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [toggling] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadProducto();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadProducto = async () => {
    try {
      setLoading(true);

      // Cargar producto principal
      const { data: productoData, error: productoError } = await supabase
        .from("productos")
        .select("*")
        .eq("id", id)
        .single();

      if (productoError) throw productoError;

      setProducto(productoData);

      // Cargar productos relacionados de la misma categoría
      if (productoData) {
        const { data: relacionados } = await supabase
          .from("productos")
          .select("*")
          .eq("categoria", productoData.categoria)
          .neq("id", id)
          .limit(4);

        setProductosRelacionados(relacionados || []);
      }
    } catch (error) {
      console.error("Error al cargar producto:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (producto) {
      for (let i = 0; i < cantidad; i++) {
        addToCart(producto);
      }
      toast.custom(
        () => (
          <div className="bg-white flex items-center gap-3 p-2 rounded-2xl">
            <AnimatedShoppingBag />
            <div>
              <p className="text-sm font-semibold text-black">
                ¡{producto.nombre}!
              </p>
              <p className="text-sm text-gray-600">agregado al carrito</p>
            </div>
          </div>
        ),
        {
          duration: 2500, // milisegundos
        }
      );
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </main>
    );
  }

  if (!producto) {
    return (
      <main className="min-h-screen flex items-center justify-center pt-8 bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
          <Link to="/" className="text-blue-600 hover:underline">
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-gray-100 pt-8 px-40">
      <section>
        {/* Breadcrumb */}
        <div className="mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-black">
              Inicio
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/" className="hover:text-black">
              Productos
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/" className="hover:text-black">
              {producto.categoria}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-black">{producto.nombre}</span>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 2xl:px-20">
            {/* Galería de imágenes */}
            <section>
              <div className="bg-gray-100 rounded-2xl overflow-hidden mb-4">
                <img
                  src={producto.imagen_url}
                  alt={producto.nombre}
                  className="w-full h-[500px] object-cover"
                />
              </div>

              {/* Miniaturas (puedes agregar más imágenes aquí) */}
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
              <h1 className="text-4xl font-bold mb-2">{producto.nombre}</h1>

              <p className="text-gray-600 mb-4 leading-relaxed">
                {producto.descripcion}
              </p>

              <div className="text-3xl font-bold text-black mb-6">
                S/ {producto.precio.toFixed(2)}
              </div>

              {/* Opciones (Color, Material - puedes personalizarlos) */}
              <div className="space-y-6 mb-8">
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
              </div>

              {/* Cantidad y botones */}
              <div className="flex gap-6 mb-8">
                <div className="flex items-center bg-white border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="px-6 font-semibold">{cantidad}</span>
                  <button
                    onClick={() =>
                      setCantidad(Math.min(producto.stock, cantidad + 1))
                    }
                    className="p-2 cursor-pointer hover:bg-gray-200"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={producto.stock === 0}
                  className="flex-1 cursor-pointer text-white text-lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Añadir al carrito
                </Button>

                <button
                  onClick={() => toggleFavorite(producto.id)}
                  disabled={toggling === producto.id}
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
              <div className="space-y-2">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {productosRelacionados.map((prod) => (
                  <div className="border bg-white border-gray-200 rounded-2xl">
                    <Link
                      key={prod.id}
                      to={`/productos/${prod.id}`}
                      className="group"
                    >
                      <div className="rounded-t-2xl overflow-hidden">
                        <img
                          src={prod.imagen_url}
                          alt={prod.nombre}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
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
                        disabled={producto.stock === 0}
                        className="w-full cursor-pointer"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {producto.stock === 0
                          ? "Agotado"
                          : "Agregar al carrito"}
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
