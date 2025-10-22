// ReturnsAndRefundsPolicy.tsx
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Mail,
  Package,
  Truck,
  Clock,
  Shield,
  FileText,
  RotateCcw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FaWhatsapp } from "react-icons/fa6";
import { FaExchangeAlt } from "react-icons/fa";
import { FiBriefcase } from "react-icons/fi"

const ReturnsAndRefundsPolicy = () => {
  const [openSections, setOpenSections] = useState<number[]>([0]);

  const toggleSection = (index: number) => {
    setOpenSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const sections = [
    {
      title: "Proceso de Devolución Paso a Paso",
      icon: <RotateCcw className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />,
      content: (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex gap-3 sm:gap-4 items-start">
            <Badge className="h-6 w-6 flex items-center justify-center shrink-0 mt-0.5 sm:mt-1 bg-orange-600 text-xs">
              1
            </Badge>
            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">
                Solicitud de Devolución
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Comunícate con nuestro equipo dentro de los{" "}
                <strong>7 días calendario</strong> desde la recepción del
                producto (derecho de retracto según Ley N° 29571). Envíanos un
                correo a{" "}
                <span className="text-orange-600 font-medium">
                  devoluciones@mueblesmunfort.com
                </span>{" "}
                o llámanos al{" "}
                <span className="text-orange-600 font-medium">
                  +51 1 234 5678
                </span>
                .
              </p>
            </div>
          </div>

          <div className="flex gap-3 sm:gap-4 items-start">
            <Badge className="h-6 w-6 flex items-center justify-center shrink-0 mt-0.5 sm:mt-1 bg-orange-600 text-xs">
              2
            </Badge>
            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">
                Preparación del Producto
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                El producto debe estar en estado original, sin señales de uso,
                con todos los accesorios, manuales y en su embalaje original.
                Incluye copia de la factura y número de pedido.
              </p>
            </div>
          </div>

          <div className="flex gap-3 sm:gap-4 items-start">
            <Badge className="h-6 w-6 flex items-center justify-center shrink-0 mt-0.5 sm:mt-1 bg-orange-600 text-xs">
              3
            </Badge>
            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">
                Recolección o Entrega
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Coordinamos la recolección gratuita en Lima Metropolitana. Para
                provincias, proporcionamos una guía de envío prepagada. El
                proceso de recolección toma 24-48 horas hábiles.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Condiciones para Aceptar Devoluciones",
      icon: <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 text-xs sm:text-sm mb-2">
                Productos Aceptados
              </h4>
              <ul className="text-xs text-green-700 space-y-1">
                <li>• En perfecto estado y sin uso</li>
                <li>• Embalaje original completo</li>
                <li>• Todos los accesorios incluidos</li>
                <li>• Factura de compra presente</li>
                <li>• Dentro de los 7 días de retracto</li>
              </ul>
            </div>
            <div className="bg-red-50 p-3 sm:p-4 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-800 text-xs sm:text-sm mb-2">
                Productos No Aceptados
              </h4>
              <ul className="text-xs text-red-700 space-y-1">
                <li>• Productos personalizados</li>
                <li>• Artículos de higiene personal</li>
                <li>• Software abierto</li>
                <li>• Productos instalados</li>
                <li>• Embalaje dañado</li>
              </ul>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            * Los productos deben cumplir con todas las condiciones establecidas
            en el Código de Protección al Consumidor peruano.
          </p>
        </div>
      ),
    },
    {
      title: "Plazos y Tiempos de Procesamiento",
      icon: <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <h4 className="font-semibold text-xs sm:text-sm mb-2 text-orange-600">
                Devoluciones por Retracto
              </h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Solicitud: 7 días calendario</li>
                <li>• Recolección: 2-3 días hábiles</li>
                <li>• Inspección: 1-2 días hábiles</li>
                <li>• Reembolso: 5-7 días hábiles</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <h4 className="font-semibold text-xs sm:text-sm mb-2 text-orange-600">
                Productos Defectuosos
              </h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Reclamación: 30 días naturales</li>
                <li>• Recogida: 24-48 horas</li>
                <li>• Verificación: 1-3 días hábiles</li>
                <li>• Solución: 5-10 días hábiles</li>
              </ul>
            </div>
          </div>
          <Alert className="bg-orange-50 border-orange-200">
            <Clock className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-600 text-xs sm:text-sm">
              <strong>Nota importante:</strong> Los plazos pueden variar en
              periodos de alta demanda o feriados nacionales. Mantendremos una
              comunicación constante sobre el estado de tu proceso.
            </AlertDescription>
          </Alert>
        </div>
      ),
    },
    {
      title: "Proceso de Reembolso",
      icon: <Package className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />,
      content: (
        <div className="space-y-4">
          <div className="flex gap-3 sm:gap-4 items-start">
            <div className="bg-orange-100 p-2 sm:p-3 rounded-full shrink-0">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">
                Verificación y Aprobación
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Una vez recibido el producto, nuestro equipo de control de
                calidad realiza una inspección minuciosa para verificar que
                cumple con todas las condiciones. La aprobación toma 1-2 días
                hábiles.
              </p>
            </div>
          </div>

          <div className="flex gap-3 sm:gap-4 items-start">
            <div className="bg-orange-100 p-2 sm:p-3 rounded-full shrink-0">
              <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">
                Procesamiento del Reembolso
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Una vez aprobada la devolución, procesamos el reembolso en un
                plazo de <strong>5 a 10 días hábiles</strong>. El monto se
                devuelve mediante el mismo método de pago utilizado en la compra
                original.
              </p>
            </div>
          </div>

          <div className="flex gap-3 sm:gap-4 items-start">
            <div className="bg-orange-100 p-2 sm:p-3 rounded-full shrink-0">
              <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">
                Notificación y Seguimiento
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Recibirás una confirmación por correo electrónico con el
                comprobante de reembolso. Puedes consultar el estado en tu
                cuenta o contactando a nuestro servicio al cliente.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Garantías y Protección al Consumidor",
      icon: <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />,
      content: (
        <div className="space-y-4">
          <div className="bg-orange-50 p-3 sm:p-4 rounded-lg border border-orange-200">
            <h4 className="font-semibold text-orange-700 text-xs sm:text-sm mb-2">
              Derechos del Consumidor - Ley N° 29571
            </h4>
            <ul className="text-xs text-orange-600 space-y-1">
              <li>
                • Derecho de retracto: 7 días calendario para compras online
              </li>
              <li>• Garantía legal: 3 meses contra vicios ocultos</li>
              <li>• Derecho a reclamo a través del Libro de Reclamaciones</li>
              <li>• Protección INDECOPI en caso de disputas</li>
            </ul>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Todos nuestros procesos cumplen con la normativa peruana de
            protección al consumidor. Contamos con Libro de Reclamaciones físico
            y virtual a tu disposición.
          </p>
        </div>
      ),
    },
  ];

  const returnOptions = [
    {
      icon: <RotateCcw className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />,
      title: "Devolución por Retracto",
      description:
        "Derecho a devolver el producto dentro de los 7 días calendario sin necesidad de justificación.",
      conditions: "Producto en estado original, sin uso y con empaque completo",
    },
    {
      icon: <FaExchangeAlt className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />,
      title: "Cambio por Otro Producto",
      description:
        "Intercambia tu producto por otro de igual o mayor valor dentro de los 15 días.",
      conditions: "Sujeto a disponibilidad de stock y diferencia de precio",
    },
    {
      icon: <Package className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />,
      title: "Producto Defectuoso",
      description:
        "Cambio o reparación inmediata para productos con fallas de fabricación.",
      conditions: "Dentro de los 30 días naturales desde la compra",
    },
    {
      icon: <Truck className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />,
      title: "Error de Entrega",
      description:
        "Solución inmediata para casos de productos incorrectos o dañados en transporte.",
      conditions: "Reportar dentro de las 24 horas de recibido",
    },
  ];

  return (
    <section className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-12 max-w-6xl">
        {/* Header Section */}
        <Card className="mb-6 sm:mb-8 shadow-sm">
          <CardHeader className="text-center px-4 sm:px-6">
            <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-tight">
              Política de Devoluciones y Reembolsos
            </CardTitle>
            <p className="text-sm sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mt-2">
              Tu satisfacción es nuestra prioridad. Conoce todos los detalles
              sobre nuestros procesos de devolución.
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-4">
              <Badge className="flex items-center gap-1 bg-orange-600 text-xs sm:text-sm">
                <Shield className="h-3 w-3" />7 Días de Retracto
              </Badge>
              <Badge className="flex items-center gap-1 bg-orange-600 text-xs sm:text-sm">
                <Clock className="h-3 w-3" />
                Reembolso Rápido
              </Badge>
              <Badge className="flex items-center gap-1 bg-orange-600 text-xs sm:text-sm">
                <FileText className="h-3 w-3" />
                Ley Peruana
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Main Policy Accordion */}
        <Card className="shadow-sm mb-6 sm:mb-8">
          <CardContent className="p-0 sm:p-1">
            {sections.map((section, index) => (
              <div key={index} className="border-b last:border-b-0">
                <Button
                  className="w-full justify-between p-4 sm:p-6 h-auto bg-white text-black hover:bg-white cursor-pointer"
                  onClick={() => toggleSection(index)}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="bg-orange-100 p-2 sm:p-3 rounded-full">
                      {section.icon}
                    </div>
                    <h3 className="text-sm sm:text-lg font-bold text-left">
                      {section.title}
                    </h3>
                  </div>
                  {openSections.includes(index) ? (
                    <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                  )}
                </Button>
                {openSections.includes(index) && (
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                    <div className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      {section.content}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Return Options */}
        <Card className="shadow-sm mb-6 sm:mb-8">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-center">
              Opciones de Devolución Disponibles
            </CardTitle>
            <p className="text-sm sm:text-base text-muted-foreground text-center">
              Elige la alternativa que mejor se adapte a tu situación
            </p>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {returnOptions.map((option, index) => (
                <div
                  key={index}
                  className="bg-gray-100 flex flex-col justify-between rounded-lg p-4 sm:p-6 text-center hover:bg-gray-200 transition-colors"
                >
                  <div>
                    <div className="bg-orange-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      {option.icon}
                    </div>
                    <h3 className="font-semibold text-sm sm:text-lg mb-2">
                      {option.title}
                    </h3>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                      {option.description}
                    </p>
                    <div className="bg-white p-2 rounded-md border border-gray-200">
                      <p className="text-xs text-orange-600 font-semibold">
                        {option.conditions}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="bg-white">
          <CardContent className="p-4 sm:p-6 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <FiBriefcase className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
              <h3 className="font-semibold text-lg sm:text-xl">
                ¿Necesitas iniciar una devolución?
              </h3>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
              Nuestro equipo de servicio al cliente está listo para ayudarte
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white hover:bg-gray-50 text-black border border-black cursor-pointer text-sm sm:text-base"
              >
                <Mail className="h-4 w-4 mr-2" />
                Solicitar Devolución
              </Button>
              <Button
                size="lg"
                className="cursor-pointer text-sm sm:text-base"
              >
                <FaWhatsapp className="h-4 w-4 mr-2" />
                WhatsApp Rápido
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ReturnsAndRefundsPolicy;
