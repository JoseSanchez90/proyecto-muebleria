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
  const subtotal = totalPrice;
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

  // Función para manejar incremento/decremento
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
    } catch (error) {
      console.error("Error actualizando cantidad:", error);
    }
  };

  // Estados de carga
  if (isLoading) {
    return (
      <main className="min-h-screen px-4 sm:px-6 lg:px-8 xl:px-20 py-8 sm:py-12 2xl:py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl 2xl:text-4xl font-bold mb-1">
            Tu Carrito
          </h1>
          <div className="text-center py-12 sm:py-20">
            <div className="animate-spin rounded-full h-10 sm:h-12 w-10 sm:w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-500 text-sm sm:text-base">
              Cargando tu carrito...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 xl:px-20 py-8 sm:py-12 2xl:py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header con información del estado del carrito */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 2xl:mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl sm:text-3xl 2xl:text-4xl font-bold mb-1">
              Tu Carrito
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Revisa tus artículos y procede al pago.
            </p>
          </div>

          {isUsingLocalCart && items.length > 0 && (
            <div className="mt-2 sm:mt-0 bg-yellow-100 border border-yellow-400 px-3 sm:px-4 py-2 sm:py-3 rounded-lg">
              <button
                onClick={() => setShowLoginModal(true)}
                className="text-xs sm:text-sm font-medium flex items-center gap-2"
              >
                <p className="flex cursor-pointer gap-2 items-center underline font-bold hover:text-yellow-900">
                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
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
          <div className="text-center py-44 sm:py-16 lg:py-20 2xl:py-52 bg-white rounded-lg sm:rounded-xl shadow-sm mx-2 sm:mx-0">
            <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
              Tu carrito está vacío
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto text-sm sm:text-base px-4">
              {isUsingLocalCart
                ? "Agrega algunos productos increíbles a tu carrito temporal."
                : "Agrega algunos productos increíbles a tu carrito."}
            </p>
            <Link to="/">
              <Button className="cursor-pointer text-sm sm:text-base">
                Continuar comprando
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              {items.map((item) => (
                <div
                  key={item.product_id}
                  className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md p-3 sm:p-4 flex flex-col sm:flex-row gap-4 sm:gap-6"
                >
                  {/* Imagen */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.products?.imagen_url}
                      alt={item.products?.nombre}
                      className="w-full sm:w-32 lg:w-40 h-44 sm:h-32 lg:h-40 object-cover rounded-lg mx-auto sm:mx-0"
                    />
                  </div>

                  {/* Información */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base sm:text-lg mb-1 line-clamp-2">
                      {item.products?.nombre}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">
                      {item.products?.descripcion}
                    </p>
                    <p className="text-base sm:text-lg font-bold text-green-600 mb-2">
                      S/ {formatPrice(item.products?.precio || 0)}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Stock disponible: {item.products?.stock}
                    </p>

                    {/* Indicador de carrito local */}
                    {isUsingLocalCart && (
                      <p className="text-xs text-yellow-600 mt-1 sm:mt-2">
                        ⚡ Guardado temporalmente
                      </p>
                    )}
                  </div>

                  {/* Controles */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-between gap-3 sm:gap-4">
                    {/* Botón eliminar */}

                    <Button
                      onClick={() => removeFromCart(item.product_id)}
                      disabled={isRemoving}
                      className="flex w-8 h-8 rounded-full items-center bg-red-500 hover:bg-red-600 text-white cursor-pointer disabled:opacity-50 transition-colors order-2 sm:order-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>

                    {/* Cantidad */}
                    <div className="flex items-center gap-2 sm:gap-3 bg-gray-100 rounded-lg p-1 order-1 sm:order-2">
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
                        <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <span className="font-semibold w-6 sm:w-8 text-center text-sm sm:text-base">
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
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <p className="font-bold text-xl sm:text-lg order-3">
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
              <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 sticky top-4 sm:top-6 lg:top-24 shadow-sm sm:shadow-md">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                  Resumen del Pedido
                </h2>

                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <div className="flex justify-between text-gray-700 text-sm sm:text-base">
                    <span>
                      Subtotal ({totalItems}{" "}
                      {totalItems === 1 ? "producto" : "productos"})
                    </span>
                    <span>S/ {formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 text-sm sm:text-base">
                    <span>Envío</span>
                    <span>
                      {items.length > 0 ? `S/ ${envio.toFixed(2)}` : "Gratis"}
                    </span>
                  </div>
                  <div className="border-t pt-2 sm:pt-3 flex justify-between text-lg sm:text-xl font-bold">
                    <span>Total</span>
                    <span>S/ {formatPrice(total)}</span>
                  </div>
                </div>

                {/* Código de promoción */}
                <div className="mb-4 sm:mb-6">
                  <label className="text-xs sm:text-sm text-gray-600 mb-2 block">
                    Código de promoción
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Introduce tu código"
                      className="text-sm sm:text-base"
                    />
                    <Button className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4">
                      Aplicar
                    </Button>
                  </div>
                </div>

                {/* Botones */}
                <div className="flex flex-col gap-2 sm:gap-3">
                  {!user ? (
                    <>
                      <div className="bg-blue-50 border border-blue-200 text-blue-800 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-2">
                        <p className="flex items-center justify-center gap-2 text-xs sm:text-sm">
                          <User className="w-3 h-3 sm:w-4 sm:h-4" />
                          <strong>Inicia sesión para proceder al pago</strong>
                        </p>
                      </div>
                      <div>
                        <Button
                          onClick={() => setShowLoginModal(true)}
                          size="lg"
                          className="w-full cursor-pointer text-sm sm:text-base"
                        >
                          <LogIn className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
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
                        className="w-full cursor-pointer flex gap-2 sm:gap-4 text-sm sm:text-base"
                      >
                        <FaRegCreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                        <p>Proceder al pago</p>
                      </Button>
                    </Link>
                  )}

                  <Link to="/">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full cursor-pointer border border-black hover:bg-gray-50 text-sm sm:text-base"
                    >
                      Continuar comprando
                    </Button>
                  </Link>

                  <Button
                    variant="destructive"
                    size="lg"
                    onClick={handleClearCart}
                    disabled={isClearing}
                    className="cursor-pointer disabled:opacity-50 text-sm sm:text-base"
                  >
                    {isClearing ? "Vaciando..." : "Vaciar carrito"}
                  </Button>
                </div>

                {/* Información adicional para carrito local */}
                {isUsingLocalCart && (
                  <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-gray-50 rounded-lg border">
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
