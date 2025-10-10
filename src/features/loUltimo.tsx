import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cartContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
  categoria: string;
  stock: number;
  lo_ultimo: boolean;
}

function LoUltimo() {

  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Cargar productos de Supabase
  useEffect(() => {
    const loadProductos = async () => {
      try {
        console.log('Cargando productos lo último en llegar...');
        
        const { data, error } = await supabase
          .from('productos')
          .select('*')
          .eq('lo_ultimo', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error al cargar productos:', error);
          setLoading(false);
          return;
        }

        if (data) {
          console.log('Productos cargados:', data);
          setProductos(data);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProductos();
  }, []);

  const handleComprar = (producto: Producto) => {
    addToCart(producto);

    toast.success(`"${producto.nombre}" agregado al carrito`);
  };
  
  if (loading) {
    return (
      <section className="py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-xl">Cargando productos...</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      {productos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 2xl:gap-12">
          {productos.map((producto) => (
            <div 
              key={producto.id}
              className="border border-gray-300 bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all group"
            >
              {/* Imagen del producto */}
              <div className="aspect-square w-full h-60 2xl:h-96 overflow-hidden relative cursor-pointer"
                onClick={() => navigate(`/productos/${producto.id}`)}>
                <img
                  src={producto.imagen_url}
                  alt={producto.nombre}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    console.error('Error al cargar imagen:', producto.imagen_url);
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%239ca3af"%3EImagen no disponible%3C/text%3E%3C/svg%3E';
                  }}
                />
                
                {/* Badge de categoría */}
                <div className="absolute top-3 left-3">
                  <span className="bg-orange-500 px-3 py-1 rounded-full text-xs font-semibold text-white">
                    {producto.categoria}
                  </span>
                </div>
              </div>

              {/* Información del producto */}
              <div className="p-4 space-y-3">
                {/* Nombre del producto */}
                <h3 className="font-bold text-lg line-clamp-1">
                  {producto.nombre}
                </h3>
                
                {/* Descripción */}
                <p className="text-gray-600 text-sm line-clamp-2 min-h-[2.5rem]">
                  {producto.descripcion}
                </p>

                {/* Precio */}
                <div className="flex items-center justify-between">
                  <span className="text-xl 2xl:text-2xl font-bold text-gray-900">
                    S/ {producto.precio.toFixed(2)}
                  </span>
                </div>

                {/* Botón de comprar */}
                <Button
                  size="lg"
                  onClick={() => handleComprar(producto)}
                  disabled={producto.stock === 0}
                  className="w-full cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {producto.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">
            No hay productos disponibles
          </p>
        </div>
      )}        
    </section>
  )
}

export default LoUltimo