import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/hooks/cart/useCart";
import { FaRegCreditCard } from "react-icons/fa6";
import { formatPrice } from "@/utils/formatters";
import { useAuth } from "@/components/Authentication/authContext";

function Cart() {
  const {
    items,
    isLoading,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalPrice,
    isUpdating,
    isRemoving,
    isClearing,
  } = useCart();

  const envio = 0;
  const subtotal = totalPrice; // ✅ totalPrice ya es el subtotal
  const total = subtotal + (items.length > 0 ? envio : 0);
  const { user } = useAuth();

  const handleClearCart = () => {
    if (items.length > 0) {
      clearCart();
    }
  };

  // ✅ Función para manejar incremento/decremento
  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return; // No permitir cantidades menores a 1
    updateQuantity({ productId, quantity: newQuantity }); // ✅ Corrección aquí
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-black mb-12">
            Carrito de Compras
          </h1>
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-500">Cargando carrito...</p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Verificar si el usuario está autenticado
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-black mb-12">
            Carrito de Compras
          </h1>
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">
              Inicia sesión para ver tu carrito
            </p>
            {/* Botón para iniciar sesión */}
          </div>
        </div>
      </div>
    );
  }

  // ✅ Carrito vacío
  if (items.length === 0) {
    return (
      <main className="min-h-screen px-4 md:px-20 py-12 2xl:py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-3xl 2xl:text-4xl font-bold mb-4">
            Tu carrito está vacío
          </h1>
          <p className="text-gray-600 mb-8">
            Agrega algunos productos increíbles a tu carrito.
          </p>
          <Link to="/">
            <Button className="cursor-pointer">Continuar comprando</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 md:px-20 py-12 2xl:py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl 2xl:text-4xl font-bold mb-1">Tu Carrito</h1>
        <p className="text-gray-600 mb-4 2xl:mb-8">
          Revisa tus artículos y procede al pago.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md p-4 flex gap-6"
              >
                {/* Imagen */}
                <img
                  src={item.products?.imagen_url}
                  alt={item.products?.nombre}
                  className="w-40 h-40 object-cover rounded-lg"
                />

                {/* Información */}
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">
                    {item.products?.nombre}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {item.products?.descripcion}
                  </p>
                  <p className="text-lg font-bold text-green-600 mb-2">
                    S/ {item.products?.precio?.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Stock disponible: {item.products?.stock}
                  </p>
                </div>

                {/* Controles */}
                <div className="flex flex-col items-end justify-between gap-4">
                  {/* Botón eliminar */}
                  <button
                    onClick={() => removeFromCart(item.product_id)}
                    disabled={isRemoving}
                    className="text-red-500 hover:text-red-700 p-2 cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  {/* Cantidad */}
                  <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.product_id, item.quantity - 1)
                      }
                      disabled={isUpdating || item.quantity <= 1}
                      className="p-1 hover:bg-gray-200 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-semibold w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.product_id, item.quantity + 1)
                      }
                      disabled={
                        isUpdating ||
                        item.quantity >= (item.products?.stock || 0)
                      }
                      className="p-1 hover:bg-gray-200 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <p className="font-bold text-lg">
                    S/{" "}
                    {formatPrice((item.products?.precio || 0) * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 sticky top-24 shadow-md">
              <h2 className="text-2xl font-bold mb-6">Resumen del Pedido</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>
                    Subtotal (
                    {items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                    productos)
                  </span>
                  <span>S/ {formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Envío</span>
                  <span>
                    {items.length > 0 ? `S/ ${envio.toFixed(2)}` : "Gratis"}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>S/ {formatPrice(total)}</span>
                </div>
              </div>

              {/* Código de promoción */}
              <div className="mb-6">
                <label className="text-sm text-gray-600 mb-2 block">
                  Código de promoción
                </label>
                <div className="flex gap-2">
                  <Input type="text" placeholder="Introduce tu código" />
                  <Button className="cursor-pointer">Aplicar</Button>
                </div>
              </div>

              {/* Botones */}
              <div className="flex flex-col gap-2">
                <Link to="/checkout">
                  <Button
                    size="lg"
                    className="w-full cursor-pointer flex gap-4"
                  >
                    <FaRegCreditCard className="w-5 h-5" />
                    <p>Proceder al pago</p>
                  </Button>
                </Link>

                <Link to="/">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full cursor-pointer border border-black"
                  >
                    Continuar comprando
                  </Button>
                </Link>

                <Button
                  variant="destructive"
                  size="lg"
                  onClick={handleClearCart}
                  disabled={isClearing}
                  className="cursor-pointer disabled:opacity-50"
                >
                  {isClearing ? "Vaciando..." : "Vaciar carrito"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Cart;
