import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/cartContext";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

function Cart() {
  const { items, updateQuantity, removeFromCart, getTotal, clearCart } =
    useCart();

  const envio = 0;
  const subtotal = getTotal();
  const total = subtotal + (items.length > 0 ? envio : 0);

  if (items.length === 0) {
    return (
      <main className="min-h-screen px-20 py-16 flex justify-center items-center bg-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
          <h1 className="text-3xl font-bold mb-4">Tu carrito está vacío</h1>
          <p className="text-gray-600 mb-8">
            Agrega productos para continuar con tu compra
          </p>
          <Link to="/">
            <Button className="cursor-pointer" size="lg">
              Ir a comprar
            </Button>
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
                className="bg-white rounded-xl shadow-md p-6 flex gap-6"
              >
                {/* Imagen */}
                <img
                  src={item.imagen_url}
                  alt={item.nombre}
                  className="w-40 object-cover rounded-lg"
                />

                {/* Información */}
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">{item.nombre}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {item.descripcion}
                  </p>
                  <p className="font-bold">Color:</p>
                </div>

                {/* Controles */}
                <div className="flex flex-col items-end justify-between gap-4">
                  {/* Botón eliminar */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 p-2 cursor-pointer"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  {/* Cantidad */}
                  <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-gray-200 rounded cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-semibold w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-gray-200 rounded cursor-pointer"
                      disabled={item.quantity >= item.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <p className="font-bold text-lg">
                    S/ {(item.precio * item.quantity).toFixed(2)}
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
                  <span>Subtotal</span>
                  <span>S/ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Envío</span>
                  <span>S/ {envio.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>S/ {total.toFixed(2)}</span>
                </div>
              </div>

              {/* Código de promoción */}
              <div className="mb-6">
                <label className="text-sm text-gray-600 mb-2 block">
                  Código de promoción
                </label>
                <div className="flex gap-2">
                  <Input type="text" placeholder="Introduce tu código" />
                  <Button size="sm" className="cursor-pointer">
                    Aplicar
                  </Button>
                </div>
              </div>

              {/* Botones */}
              <div className="flex flex-col gap-2">
                <Link to="/checkout">
                  <Button className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-full font-semibold mt-4">
                    Proceder al pago
                  </Button>
                </Link>

                <Button
                  variant="destructive"
                  size="lg"
                  onClick={clearCart}
                  className="cursor-pointer"
                >
                  Vaciar carrito
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
