import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, ShoppingBag, LogIn, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/hooks/cart/useCart";
import { FaRegCreditCard } from "react-icons/fa6";
import { formatPrice } from "@/utils/formatters";
import { useAuth } from "@/hooks/auth/useAuth";
import { useState } from "react";
import LoginModal from "./loginModal";
import RegisterModal from "./registerModal";
import ForgotPasswordModal from "./forgotPasswordModal";
import toast from "react-hot-toast";

function Cart() {
  const {
    items,
    isLoading,
    updateQuantity,
    removeFromCart,
    clearCart,
    isUsingLocalCart,
    totalItems,
    totalPrice,
    isUpdating,
    isRemoving,
    isClearing,
  } = useCart();

  const envio = 0;
  const subtotal = totalPrice; // ✅ totalPrice ya es el subtotal
  const total = subtotal + (items.length > 0 ? envio : 0);
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const handleClearCart = () => {
    if (items.length > 0) {
      clearCart();
    }
  };

  // ✅ Función para manejar incremento/decremento
  const handleQuantityChange = async (
    productId: string,
    newQuantity: number
  ) => {
    console.log("Cambiando cantidad:", { productId, newQuantity });

    try {
      if (newQuantity <= 0) {
        await removeFromCart(productId);
      } else {
        await updateQuantity({ productId, quantity: newQuantity });
      }
      toast.success("Cantidad actualizada");
    } catch (error) {
      console.error("Error actualizando cantidad:", error);
      toast.error("Error al actualizar la cantidad");
    }
  };

  // Estados de carga
  if (isLoading) {
    return (
      <main className="min-h-screen px-4 md:px-20 py-12 2xl:py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl 2xl:text-4xl font-bold mb-1">Tu Carrito</h1>
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-500">Cargando tu carrito...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 md:px-20 py-12 2xl:py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header con información del estado del carrito */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 2xl:mb-8">
          <div>
            <h1 className="text-3xl 2xl:text-4xl font-bold mb-1">Tu Carrito</h1>
            <p className="text-gray-600">
              Revisa tus artículos y procede al pago.
            </p>
          </div>

          {isUsingLocalCart && items.length > 0 && (
            <div className="mt-4 md:mt-0 bg-yellow-100 border border-yellow-400 px-4 py-3 rounded-lg">
              <button
                onClick={() => setShowLoginModal(true)}
                className="text-sm font-medium flex items-center gap-2"
              >
                <p className="flex cursor-pointer gap-2 items-center underline font-bold hover:text-yellow-900">
                  <User className="w-4 h-4" />
                  Inicia sesión
                </p>
                para guardar tus productos
              </button>
              <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onSwitchToRegister={() => {
                  setShowLoginModal(false);
                  setShowRegisterModal(true);
                }}
                onSwitchToForgotPassword={() => {
                  setShowLoginModal(false);
                  setShowForgot(true);
                }}
              />
              <RegisterModal
                isOpen={showRegisterModal}
                onClose={() => setShowRegisterModal(false)}
                onSwitchToLogin={() => {
                  setShowRegisterModal(false);
                  setShowLoginModal(true);
                }}
              />
              <ForgotPasswordModal
                isOpen={showForgot}
                onClose={() => setShowForgot(false)}
                onSwitchToLogin={() => {
                  setShowForgot(false);
                  setShowLoginModal(true);
                }}
              />
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Tu carrito está vacío
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {isUsingLocalCart
                ? "Agrega algunos productos increíbles a tu carrito temporal."
                : "Agrega algunos productos increíbles a tu carrito."}
            </p>
            <Link to="/">
              <Button className="cursor-pointer">Continuar comprando</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.product_id}
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
                      S/ {formatPrice(item.products?.precio || 0)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Stock disponible: {item.products?.stock}
                    </p>

                    {/* Indicador de carrito local */}
                    {isUsingLocalCart && (
                      <p className="text-xs text-yellow-600 mt-2">
                        ⚡ Guardado temporalmente
                      </p>
                    )}
                  </div>

                  {/* Controles */}
                  <div className="flex flex-col items-end justify-between gap-4">
                    {/* Botón eliminar */}
                    <button
                      onClick={() => removeFromCart(item.product_id)}
                      disabled={isRemoving}
                      className="text-red-500 hover:text-red-700 p-2 cursor-pointer disabled:opacity-50 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    {/* Cantidad */}
                    <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.product_id,
                            item.quantity - 1
                          )
                        }
                        disabled={isUpdating || item.quantity <= 1}
                        className="p-1 hover:bg-gray-200 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-semibold w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.product_id,
                            item.quantity + 1
                          )
                        }
                        disabled={
                          isUpdating ||
                          item.quantity >= (item.products?.stock || 0)
                        }
                        className="p-1 hover:bg-gray-200 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <p className="font-bold text-lg">
                      S/{" "}
                      {formatPrice(
                        (item.products?.precio || 0) * item.quantity
                      )}
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
                      Subtotal ({totalItems}{" "}
                      {totalItems === 1 ? "producto" : "productos"})
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
                  {!user ? (
                    <>
                      <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-2">
                        <p className="text-sm text-center">
                          💡{" "}
                          <strong>Inicia sesión para proceder al pago</strong>
                        </p>
                      </div>
                      <div>
                        <Button
                          onClick={() => setShowLoginModal(true)}
                          size="lg"
                          className="w-full cursor-pointer"
                        >
                          <LogIn className="w-4 h-4" />
                          Iniciar sesión para comprar
                        </Button>
                      </div>
                      <LoginModal
                        isOpen={showLoginModal}
                        onClose={() => setShowLoginModal(false)}
                        onSwitchToRegister={() => {
                          setShowLoginModal(false);
                          setShowRegisterModal(true);
                        }}
                        onSwitchToForgotPassword={() => {
                          setShowLoginModal(false);
                          setShowForgot(true);
                        }}
                      />
                      <RegisterModal
                        isOpen={showRegisterModal}
                        onClose={() => setShowRegisterModal(false)}
                        onSwitchToLogin={() => {
                          setShowRegisterModal(false);
                          setShowLoginModal(true);
                        }}
                      />
                      <ForgotPasswordModal
                        isOpen={showForgot}
                        onClose={() => setShowForgot(false)}
                        onSwitchToLogin={() => {
                          setShowForgot(false);
                          setShowLoginModal(true);
                        }}
                      />
                    </>
                  ) : (
                    <Link to="/checkout">
                      <Button
                        size="lg"
                        className="w-full cursor-pointer flex gap-4"
                      >
                        <FaRegCreditCard className="w-5 h-5" />
                        <p>Proceder al pago</p>
                      </Button>
                    </Link>
                  )}

                  <Link to="/">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full cursor-pointer border border-black hover:bg-gray-50"
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

                {/* Información adicional para carrito local */}
                {isUsingLocalCart && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
                    <p className="text-xs text-gray-600 text-center">
                      🔒 Tu carrito se guardará automáticamente cuando inicies
                      sesión
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Cart;
