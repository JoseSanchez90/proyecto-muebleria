// pages/checkout.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Calendar,
  SmartphoneNfc,
  ArrowRight,
  CheckCircle2,
  CheckCircle,
  Upload,
} from "lucide-react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";

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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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

  // Calendario - generar fechas desde hoy
  const generateCalendarDates = () => {
    const today = new Date();
    const dates = [];

    for (let i = 1; i <= 14; i++) {
      // 2 semanas
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }

    return dates;
  };

  const availableDates = generateCalendarDates();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatCalendarDate = (date: Date) => {
    const weekday = date.toLocaleDateString("es-ES", { weekday: "short" });
    const day = date.getDate();
    const month = date.toLocaleDateString("es-ES", { month: "short" });

    return {
      weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1),
      day,
      month: month.charAt(0).toUpperCase() + month.slice(1),
    };
  };

  const handleProceedToPayment = () => {
    if (!paymentMethod) {
      alert("Por favor selecciona un método de pago");
      return;
    }
    if (!selectedDate) {
      alert("Por favor selecciona una fecha de entrega");
      return;
    }
    setShowPaymentDetails(true);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simular procesamiento de pago
    setTimeout(async () => {
      await clearCart(); // Limpiar carrito
      setIsProcessing(false);
      navigate("/pago-exitoso");
    }, 5000);
  };

  const isSameDate = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString();
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

            {/* Fecha de Entrega */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  Fecha de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm">
                    Selecciona la fecha en la que deseas recibir tu pedido
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {availableDates.map((date, index) => {
                      const formattedDate = formatCalendarDate(date);
                      const isSelected =
                        selectedDate && isSameDate(selectedDate, date);

                      return (
                        <button
                          key={index}
                          onClick={() => {
                            // Crear una nueva fecha con la misma fecha pero hora fija
                            const newDate = new Date(date);
                            newDate.setHours(12, 0, 0, 0);
                            setSelectedDate(newDate);
                          }}
                          className={`p-3 border-2 rounded-lg text-center transition-all duration-200 ${
                            isSelected
                              ? "border-orange-500 bg-orange-50 text-orange-700 shadow-lg ring-2 ring-orange-500"
                              : "border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:bg-orange-25"
                          }`}
                        >
                          <div
                            className={`text-xs font-medium ${
                              isSelected ? "text-orange-600" : "text-gray-500"
                            }`}
                          >
                            {formattedDate.weekday}
                          </div>
                          <div
                            className={`text-lg font-bold my-1 ${
                              isSelected ? "text-orange-800" : "text-gray-900"
                            }`}
                          >
                            {formattedDate.day}
                          </div>
                          <div
                            className={`text-xs ${
                              isSelected ? "text-orange-600" : "text-gray-600"
                            }`}
                          >
                            {formattedDate.month}
                          </div>
                          {index === 0 && (
                            <div className="text-xs text-green-600 font-medium mt-1">
                              Más rápido
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {selectedDate && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="flex items-center gap-2 text-green-800 text-sm">
                        <CheckCircle2 className="w-5 h-5" />
                        <strong>Entrega programada para:</strong>{" "}
                        {formatDate(selectedDate)}
                      </p>
                    </div>
                  )}
                </div>
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
                      onPayment={handlePayment}
                      isProcessing={isProcessing}
                    />
                  </div>
                )}

                {!showPaymentDetails && paymentMethod && selectedDate && (
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
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total</span>
                    <span>S/ {formatPrice(total)}</span>
                  </div>
                </div>

                {/* Información de entrega */}
                {selectedDate && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      📅 Entrega programada
                    </p>
                    <p className="text-xs text-gray-600">
                      {formatDate(selectedDate)}
                    </p>
                  </div>
                )}

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

// Componente para los detalles de pago (se mantiene igual)
function PaymentDetails({
  method,
  total,
  onPayment,
  isProcessing = false,
}: {
  method: string;
  total: number;
  onPayment: () => Promise<void>;
  isProcessing?: boolean;
}) {
  const [showYapeHelp, setShowYapeHelp] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [plinVoucher, setPlinVoucher] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [localIsProcessing, setLocalIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  // Estados para los campos de tarjeta (NUEVO)
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  // Función para formatear número de tarjeta (XXXX XXXX XXXX XXXX) - NUEVO
  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\s+/g, "").replace(/[^\d]/g, "");
    const limited = numbers.slice(0, 16);
    const formatted = limited.replace(/(\d{4})/g, "$1 ").trim();
    return formatted;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  // Función para formatear fecha de expiración (MM/AAAA) - NUEVO
  const formatExpiryDate = (value: string) => {
    const numbers = value.replace(/[^\d]/g, "");
    if (numbers.length <= 2) {
      return numbers;
    } else {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 6)}`;
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setExpiryDate(formatted);
  };

  // Función para validar CVV - NUEVO
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, "").slice(0, 4);
    setCvv(value);
  };

  // Función para validar nombre en tarjeta - NUEVO
  const handleCardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "")
      .slice(0, 30);
    setCardName(value);
  };

  // Función para manejar el pago con delay - MODIFICADA
  const handlePaymentWithDelay = async () => {
    // Validaciones para tarjeta - NUEVO
    if (method === "card") {
      const rawCardNumber = cardNumber.replace(/\s+/g, "");
      const rawExpiryDate = expiryDate.replace("/", "");

      if (rawCardNumber.length !== 16) {
        alert("Por favor ingresa un número de tarjeta válido (16 dígitos)");
        return;
      }

      if (rawExpiryDate.length !== 6) {
        alert("Por favor ingresa una fecha de expiración válida (MM/AAAA)");
        return;
      }

      if (cvv.length < 3) {
        alert("Por favor ingresa un CVV válido (3-4 dígitos)");
        return;
      }

      if (cardName.trim().length < 2) {
        alert("Por favor ingresa el nombre como aparece en tu tarjeta");
        return;
      }
    }

    setLocalIsProcessing(true);
    setProgress(0); // Reiniciar progreso

    // Animación de progreso durante 5 segundos
    const interval = 50; // actualizar cada 50ms
    const totalTime = 5000; // 5 segundos
    const steps = totalTime / interval;
    const increment = 100 / steps;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return newProgress;
      });
    }, interval);

    setTimeout(() => {
      clearInterval(progressInterval);
      setLocalIsProcessing(false);
      setProgress(100);
      onPayment();
    }, totalTime);
  };

  // Función para manejar subida de voucher de Plin (EXISTENTE)
  const handleVoucherUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setPlinVoucher(file);
        setIsUploading(true);
        setTimeout(() => {
          setIsUploading(false);
        }, 2000);
      } else {
        alert("Por favor sube una imagen válida");
      }
    }
  };

  return (
    <>
      {/* Contenido normal del pago */}
      {method === "card" && (
        <div className="space-y-4">
          <h4 className="font-semibold">Información de la tarjeta</h4>
          <div className="space-y-3">
            {/* Número de tarjeta - MODIFICADO */}
            <div>
              <Input
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                className="font-mono text-lg tracking-wider"
                maxLength={19}
              />
              <p className="text-xs text-gray-500 mt-1">
                {cardNumber.replace(/\s+/g, "").length}/16 dígitos
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Fecha de expiración - MODIFICADO */}
              <div>
                <Input
                  value={expiryDate}
                  onChange={handleExpiryDateChange}
                  placeholder="MM/AAAA"
                  className="text-center font-mono"
                  maxLength={7}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {expiryDate.replace(/[^\d]/g, "").length}/6 dígitos
                </p>
              </div>

              {/* CVV - MODIFICADO */}
              <div>
                <Input
                  value={cvv}
                  onChange={handleCvvChange}
                  placeholder="CVV"
                  type="password"
                  className="text-center font-mono"
                  maxLength={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {cvv.length}/3-4 dígitos
                </p>
              </div>
            </div>

            {/* Nombre en tarjeta - MODIFICADO */}
            <div>
              <Input
                value={cardName}
                onChange={handleCardNameChange}
                placeholder="JUAN PEREZ GARCIA"
                className="uppercase"
                maxLength={30}
              />
              <p className="text-xs text-gray-500 mt-1">
                {cardName.length}/30 caracteres
              </p>
            </div>
          </div>
          <Button
            onClick={handlePaymentWithDelay}
            className="w-full bg-orange-600 hover:bg-orange-700 cursor-pointer"
          >
            {`Pagar S/ ${formatPrice(total)}`}
          </Button>
        </div>
      )}

      {method === "yape" && (
        <div className="space-y-4 text-center">
          <h4 className="font-semibold text-lg">Pago con Yape</h4>

          {/* QR Code */}
          <div className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center">
            <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
              <img
                src="/qr.png"
                alt="QR Yape"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Escanea el código QR con Yape
            </p>

            {/* Número de teléfono */}
            <div className="bg-gray-50 p-3 rounded-lg w-full">
              <p className="text-xs text-gray-500 mb-1">O Yapea al número:</p>
              <p className="font-mono font-bold text-lg">999 888 777</p>
            </div>
          </div>

          {/* Código de confirmación */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Label htmlFor="confirmationCode" className="text-sm font-medium">
                Ingresa tu código de aprobación (6 dígitos)
              </Label>
              <button
                onClick={() => setShowYapeHelp(true)}
                className="w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600 cursor-pointer"
              >
                ?
              </button>
            </div>
            <Input
              id="confirmationCode"
              placeholder="123456"
              maxLength={6}
              value={confirmationCode}
              onChange={(e) =>
                setConfirmationCode(e.target.value.replace(/\D/g, ""))
              }
              className="text-center font-mono text-lg text-orange-600 font-bold"
            />
            <p className="text-xs text-gray-500">
              Ingresa los 6 dígitos que aparecen en tu Yape
            </p>
          </div>

          <Button
            onClick={handlePaymentWithDelay}
            disabled={confirmationCode.length !== 6}
            className="w-full bg-orange-600 hover:bg-orange-700 cursor-pointer"
          >
            {`Pagar S/ ${formatPrice(total)}`}
          </Button>

          {/* Modal de ayuda Yape */}
          {showYapeHelp && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-lg p-6 max-w-md w-full animate-in slide-in-from-bottom duration-300">
                <h3 className="text-lg font-bold mb-4">
                  ¿Dónde encuentro mi código de aprobación?
                </h3>
                <div className="space-y-3 text-sm text-start text-gray-600">
                  <p>1. Abre tu app de Yape</p>
                  <p>2. Ve a la sección "Movimientos" o "Historial"</p>
                  <p>3. Busca la transacción que acabas de realizar</p>
                  <p>
                    4. En los detalles de la transacción, verás un{" "}
                    <strong>código de 6 dígitos</strong>
                  </p>
                  <p>5. Ingresa ese código en el campo anterior</p>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={() => setShowYapeHelp(false)}
                    className="bg-orange-600 hover:bg-orange-700 cursor-pointer"
                  >
                    Entendido
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {method === "plin" && (
        <div className="space-y-4 text-center">
          <h4 className="font-semibold text-lg">Pago con Plin</h4>

          {/* QR Code */}
          <div className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center">
            <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
              <img
                src="/src/assets/images/qr.png"
                alt="QR Plin"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Escanea el código QR con Plin
            </p>

            {/* Número de teléfono */}
            <div className="bg-gray-50 p-3 rounded-lg w-full">
              <p className="text-xs text-gray-500 mb-1">O Plinea al número:</p>
              <p className="font-mono font-bold text-lg">999 888 777</p>
            </div>
          </div>

          {/* Subida de voucher */}
          <div className="space-y-3">
            <Label className="text-sm font-medium block">
              Sube una imagen de tu voucher de Plin
            </Label>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-orange-400 transition-colors">
              <input
                type="file"
                id="plinVoucher"
                accept="image/*"
                onChange={handleVoucherUpload}
                className="hidden"
              />
              <label
                htmlFor="plinVoucher"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <div className="w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-sm text-gray-600">Subiendo voucher...</p>
                  </>
                ) : plinVoucher ? (
                  <>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-sm text-green-600 font-medium">
                      Voucher subido
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {plinVoucher.name}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                      <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">
                      Haz clic para subir tu voucher
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Formatos: JPG, PNG (Max. 5MB)
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

          <Button
            onClick={handlePaymentWithDelay}
            disabled={!plinVoucher || isUploading}
            className="w-full bg-orange-600 hover:bg-orange-700 cursor-pointer"
          >
            {`Pagar S/ ${formatPrice(total)}`}
          </Button>
        </div>
      )}

      {/* Modal de procesamiento de pago */}
      {(localIsProcessing || isProcessing) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 animate-in slide-in-from-bottom duration-500">
            <div className="text-center space-y-6">
              {/* Spinner */}
              <div className="flex justify-center">
                <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
              </div>

              {/* Texto */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900">
                  Procesando pago...
                </h3>
                <p className="text-gray-600">
                  Un momento por favor, estamos confirmando tu pago
                </p>
                <p className="text-sm text-gray-500">
                  {Math.round(progress)}% completado
                </p>
              </div>

              {/* Barra de progreso animada */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Checkout;
