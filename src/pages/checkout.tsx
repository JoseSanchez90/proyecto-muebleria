// pages/checkout.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useCart } from "@/hooks/cart/useCart";
import { useAuth } from "@/hooks/auth/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { formatPrice } from "@/utils/formatters";
import {
  ArrowLeft,
  CreditCard,
  Shield,
  Edit,
  Plus,
  SmartphoneNfc,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import PaymentDetails from "@/checkout/paymentDetails";
// Importar los mismos JSONs que usas en profile.tsx
import departamentos from "@/data/departamentos.json";
import provincias from "@/data/provincias.json";
import distritos from "@/data/distritos.json";
import { FaSquareWhatsapp } from "react-icons/fa6";

function Checkout() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const { user } = useAuth();
  const { data: profileData } = useProfile(user?.id);
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

  // Datos del usuario desde el perfil
  const userName = profileData?.name || user?.user_metadata?.name || "";
  const lastName =
    profileData?.last_name || user?.user_metadata?.last_name || "";
  const userPhone = profileData?.phone || "";
  const userAddress =
    profileData?.address || user?.user_metadata?.address || "";
  const userReference =
    profileData?.reference || user?.user_metadata?.reference || "";

  // Obtener nombres completos de ubicación usando los JSONs
  const getLocationName = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[],
    id?: string,
    defaultName?: string
  ): string => {
    if (!id) return defaultName || "";
    const location = data.find((item) => item.id === id);
    return location?.name || defaultName || id;
  };

  const userDepartment = getLocationName(
    departamentos,
    profileData?.department
  );
  const userProvince = getLocationName(provincias, profileData?.province);
  const userDistrict = getLocationName(distritos, profileData?.district);

  // Formatear dirección completa
  const formatFullAddress = () => {
    const parts = [];

    // Dirección principal
    if (userAddress) parts.push(userAddress);

    // Referencia (si existe)
    if (userReference) parts.push(`Ref: ${userReference}`);

    // Ubicación (Distrito, Provincia, Departamento)
    const locationParts = [userDistrict, userProvince, userDepartment].filter(
      Boolean
    );
    if (locationParts.length > 0) {
      parts.push(locationParts.join(", "));
    }

    return parts.length > 0 ? parts.join(" - ") : "No hay dirección guardada";
  };

  const fullAddress = formatFullAddress();

  const envio = 0;
  const subtotal = totalPrice;
  const total = subtotal + envio;

  const handleProceedToPayment = () => {
    if (!paymentMethod) {
      alert("Por favor selecciona un método de pago");
      return;
    }
    setShowPaymentDetails(true);
  };

  const handlePayment = async (method: string) => {
    setIsProcessing(true);
    // Simular procesamiento de pago
    setTimeout(async () => {
      await clearCart(); // Limpiar carrito
      setIsProcessing(false);
      navigate(`/pago-exitoso?payment_method=${method}`);
    }, 5000);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-16 bg-white rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Carrito vacío
            </h2>
            <p className="text-gray-600 mb-6">
              No hay productos para procesar el pago.
            </p>
            <Link to="/">
              <Button>Continuar comprando</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/carrito"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al carrito
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Finalizar Compra</h1>
          <p className="text-gray-600 mt-2">
            Completa tu información para procesar el pedido
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Información y métodos de pago */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dirección de Envío */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="w-5 h-5 text-orange-600" />
                    Dirección de Envío
                  </div>
                  <Link
                    to="/perfil"
                    className="inline-flex items-center text-orange-600 hover:text-orange-700 text-sm font-normal"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar dirección
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userAddress || userDepartment ? (
                  <div className="space-y-3">
                    {/* Dirección principal */}
                    <div className="p-4 border rounded-lg border-orange-500 transition-colors cursor-pointer bg-white">
                      <div className="flex gap-4 items-start justify-between">
                        <div className="border border-orange-300 flex items-center justify-center w-5 h-5 rounded-full">
                          <div className="w-2 h-2 rounded-full bg-orange-600 flex-shrink-0" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-2">
                            {userName} {lastName}
                          </p>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {fullAddress}
                          </p>
                          {userPhone && (
                            <p className="flex  items-center gap-2 text-gray-500 text-sm mt-2">
                              <FaSquareWhatsapp className="text-green-500 w-5 h-5" />
                              {userPhone}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Opciones adicionales */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <span className="text-xs text-gray-500 sm:ml-auto">
                        ¿Necesitas cambiar algo? Edita tu dirección
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500 mb-4">
                      No tienes una dirección guardada
                    </p>
                    <Link to="/mi-perfil">
                      <Button className="bg-orange-600 hover:bg-orange-700 cursor-pointer">
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar dirección en mi perfil
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Método de Pago */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-orange-600" />
                  Método de Pago
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-4"
                >
                  {/* Yape */}
                  <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-orange-500 transition-colors cursor-pointer bg-white">
                    <RadioGroupItem value="yape" id="yape" />
                    <Label htmlFor="yape" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <SmartphoneNfc className="w-6 h-6 text-purple-600" />
                          <div>
                            <p className="font-medium">Yape</p>
                            <p className="text-sm text-gray-500">
                              Paga rápido con Yape
                            </p>
                          </div>
                          <img
                            src="/yape.webp"
                            alt="Yape Logo"
                            className="w-10 md:w-12"
                          />
                        </div>
                      </div>
                    </Label>
                  </div>

                  {/* Plin */}
                  <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-orange-500 transition-colors cursor-pointer bg-white">
                    <RadioGroupItem value="plin" id="plin" />
                    <Label htmlFor="plin" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <SmartphoneNfc className="w-6 h-6 text-blue-600" />
                          <div>
                            <p className="font-medium">Plin</p>
                            <p className="text-sm text-gray-500">
                              Paga fácil con Plin
                            </p>
                          </div>
                          <img
                            src="/plin.webp"
                            alt="Plin Logo"
                            className="w-8 md:w-10"
                          />
                        </div>
                      </div>
                    </Label>
                  </div>

                  {/* Tarjeta de crédito/débito */}
                  <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-orange-500 transition-colors cursor-pointer bg-white">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 md:gap-4">
                          <CreditCard className="w-6 h-6 text-gray-600" />
                          <div>
                            <p className="font-medium">
                              Tarjeta de débito/crédito
                            </p>
                            <p className="text-sm text-gray-500">
                              Paga con tu tarjeta Visa, Mastercard
                            </p>
                          </div>
                          <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                            <img
                              src="/visa-logo.png"
                              alt="Visa Logo"
                              className="w-8 md:w-12"
                            />
                            <img
                              src="/mastercard-logo.png"
                              alt="MasterCard Logo"
                              className="w-8 md:w-12"
                            />
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {/* Detalles del pago seleccionado */}
                {showPaymentDetails && paymentMethod && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                    <PaymentDetails
                      method={paymentMethod}
                      total={total}
                      onPayment={handlePayment.bind(null, paymentMethod)}
                      isProcessing={isProcessing}
                    />
                  </div>
                )}

                {!showPaymentDetails && paymentMethod && (
                  // <Link to="/pago-exitoso">
                  <Button
                    size="lg"
                    onClick={handleProceedToPayment}
                    className="w-full flex items-center mt-6 bg-orange-600 hover:bg-orange-700 cursor-pointer text-white font-semibold"
                  >
                    Continuar con el pago
                    <ArrowRight className="w-6 h-6" />
                  </Button>
                  // </Link>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Columna derecha - Resumen del pedido */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Productos */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.product_id} className="flex gap-3">
                      <img
                        src={item.products?.imagen_url}
                        alt={item.products?.nombre}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                          {item.products?.nombre}
                        </p>
                        <p className="text-xs text-gray-500">
                          Cantidad: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">
                        S/{" "}
                        {formatPrice(
                          (item.products?.precio || 0) * item.quantity
                        )}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totales */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({totalItems} productos)</span>
                    <span>S/ {formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Envío</span>
                    <span>S/ {envio.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2">
                    <span>Total</span>
                    <span>S/ {formatPrice(total)}</span>
                  </div>
                </div>

                {/* Garantía */}
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-4 border-t border-gray-200">
                  <Shield className="w-4 h-4" />
                  <span>Compra 100% segura y protegida</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
