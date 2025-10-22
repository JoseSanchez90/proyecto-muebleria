// ShippingPolicies.tsx
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Truck,
  Clock,
  MapPin,
  Shield,
  Package,
  Home,
  Mail,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaWhatsapp } from "react-icons/fa6";
import { FaHandsHelping } from "react-icons/fa";

const ShippingPolicies = () => {
  const [openItems, setOpenItems] = useState<number[]>([0]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  const policies = [
    {
      title: "Costos y Tarifas de Envío",
      icon: <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            Nuestra estructura de costos está diseñada para ofrecerte la mejor
            relación calidad-precio en el servicio de entrega:
          </p>
          <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-muted-foreground pl-3 sm:pl-4">
            <li>
              <strong>Envío Estándar Gratuito:</strong> Para todos los pedidos
              superiores a S/ 1,200 en Lima Metropolitana
            </li>
            <li>
              <strong>Envío Estándar Económico:</strong> S/ 25 para pedidos
              entre S/ 500 y S/ 1,200
            </li>
            <li>
              <strong>Envío Express Premium:</strong> S/ 45 adicionales -
              Entrega en 24-48 horas hábiles
            </li>
            <li>
              <strong>Envío Same-Day:</strong> S/ 75 - Disponible para pedidos
              realizados antes de las 11:00 am
            </li>
            <li>
              <strong>Provincias:</strong> Costos variables según destino -
              Consultar al +51 1 234 5678
            </li>
          </ul>
          <p className="text-xs sm:text-sm text-primary font-medium">
            * Todos los precios incluyen IGV y seguro básico de transporte
          </p>
        </div>
      ),
    },
    {
      title: "Tiempos de Entrega y Seguimiento",
      icon: <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-muted/50 p-3 sm:p-4 rounded-lg">
              <h4 className="font-semibold text-xs sm:text-sm mb-2">
                Lima Metropolitana
              </h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Estándar: 3-5 días hábiles</li>
                <li>• Express: 24-48 horas hábiles</li>
                <li>• Same-Day: Mismo día (pedidos antes de 11am)</li>
              </ul>
            </div>
            <div className="bg-muted/50 p-3 sm:p-4 rounded-lg">
              <h4 className="font-semibold text-xs sm:text-sm mb-2">
                Provincias
              </h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Costa: 5-7 días hábiles</li>
                <li>• Sierra: 7-10 días hábiles</li>
                <li>• Selva: 10-15 días hábiles</li>
              </ul>
            </div>
          </div>
          <p className="text-xs sm:text-sm">
            Recibirás confirmación vía email/SMS con código de seguimiento y
            enlace de rastreo en tiempo real. Nuestro equipo se comunicará para
            coordinar la entrega 24 horas antes.
          </p>
        </div>
      ),
    },
    {
      title: "Cobertura y Zonas de Servicio",
      icon: <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h4 className="font-semibold text-xs sm:text-sm mb-2 sm:mb-3 text-primary">
                Lima Metropolitana - Cobertura Completa
              </h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Todos los distritos de Lima</p>
                <p>• Callao y Provincia Constitucional</p>
                <p>• Urbanizaciones y AA.HH.</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-xs sm:text-sm mb-2 sm:mb-3 text-primary">
                Principales Ciudades - Provincias
              </h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Arequipa, Trujillo, Chiclayo</p>
                <p>• Piura, Cusco, Iquitos</p>
                <p>• Huancayo, Tacna, Ica</p>
              </div>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Para zonas no listadas, contáctenos para verificar cobertura y
            costos adicionales.
          </p>
        </div>
      ),
    },
    {
      title: "Proceso de Entrega y Recepción",
      icon: <Package className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            Nuestro proceso garantiza que recibas tus muebles en perfectas
            condiciones:
          </p>
          <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-muted-foreground pl-3 sm:pl-4">
            <li>
              <strong>Inspección en Recepción:</strong> Verifica el producto
              antes de firmar el recibo
            </li>
            <li>
              <strong>Embalaje de Protección:</strong> Todos los muebles
              incluyen protección especial para transporte
            </li>
            <li>
              <strong>Servicio a Domicilio:</strong> Llevamos el producto hasta
              el lugar indicado en tu hogar
            </li>
            <li>
              <strong>Montaje Básico:</strong> Incluido para productos que lo
              requieran (consultar disponibilidad)
            </li>
            <li>
              <strong>Documentación:</strong> Entrega de factura física y
              garantías correspondientes
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "Seguros y Protección al Cliente",
      icon: <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />,
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 text-xs sm:text-sm mb-2">
              Protección Total del Pedido
            </h4>
            <ul className="text-xs text-green-700 space-y-1">
              <li>• Seguro contra daños durante el transporte</li>
              <li>• Cobertura por pérdida o extravío</li>
              <li>• Responsabilidad civil ante terceros</li>
              <li>• Asistencia en aduanas para provincias</li>
            </ul>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Todos nuestros envíos cuentan con póliza de seguro. En caso de
            incidencias, contamos con procedimientos ágiles de reclamación según
            normativa INDECOPI.
          </p>
        </div>
      ),
    },
    {
      title: "Restricciones y Consideraciones Especiales",
      icon: <Home className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            Para garantizar la integridad de nuestros productos y tu seguridad:
          </p>
          <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-muted-foreground pl-3 sm:pl-4">
            <li>
              <strong>Muebles de Gran Tamaño:</strong> Verificar medidas de
              accesos (puertas, ascensores, escaleras)
            </li>
            <li>
              <strong>Edificios y Condominios:</strong> Coordinar previamente
              con administración
            </li>
            <li>
              <strong>Zonas de Tráfico Restringido:</strong> Entrega sujeta a
              horarios especiales
            </li>
            <li>
              <strong>Productos Frágiles:</strong> Manipulación especial con
              costo adicional
            </li>
            <li>
              <strong>Horarios Extendidos:</strong> Disponible con cargo
              adicional (nocturno/festivos)
            </li>
          </ul>
          <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 mt-3">
            <p className="text-xs text-amber-800">
              <strong>Importante:</strong> Para productos que requieren montaje
              profesional, ofrecemos servicio especializado con costos
              adicionales.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const additionalServices = [
    {
      icon: <Package className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />,
      title: "Servicio de Montaje Profesional",
      description:
        "Instalación especializada por técnicos certificados. Incluye garantía de servicio por 30 días.",
      price: "Desde S/ 80",
    },
    {
      icon: <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />,
      title: "Protección Extendida",
      description:
        "Cobertura ampliada contra daños accidentales durante la instalación y primer año de uso.",
      price: "Desde S/ 120/año",
    },
    {
      icon: <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />,
      title: "Entrega en Horario Específico",
      description:
        "Programación exacta de entrega según tu disponibilidad (ventana de 2 horas).",
      price: "S/ 35 adicional",
    },
    {
      icon: <Home className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />,
      title: "Retiro de Muebles Antiguos",
      description:
        "Servicio ecológico de retiro y disposición responsable de tus muebles usados.",
      price: "S/ 50 por artículo",
    },
  ];

  return (
    <section className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-12 max-w-6xl">
        {/* Header Section */}
        <Card className="mb-6 sm:mb-8 shadow-sm">
          <CardHeader className="text-center px-4 sm:px-6">
            <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-tight">
              Políticas de Envío y Entrega
            </CardTitle>
            <p className="text-sm sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mt-2">
              Servicios de logística confiable para todo Perú, con estándares de
              calidad garantizados
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-4">
              <Badge className="flex items-center gap-1 bg-orange-600 text-xs sm:text-sm">
                <Shield className="h-3 w-3" />
                Envío Protegido
              </Badge>
              <Badge className="flex items-center gap-1 bg-orange-600 text-xs sm:text-sm">
                <Truck className="h-3 w-3" />
                Todo Perú
              </Badge>
              <Badge className="flex items-center gap-1 bg-orange-600 text-xs sm:text-sm">
                <Clock className="h-3 w-3" />
                Entrega Garantizada
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Main Policies Accordion */}
        <Card className="shadow-sm mb-6 sm:mb-8">
          <CardContent className="p-0 sm:p-1">
            {policies.map((policy, index) => (
              <div key={index} className="border-b last:border-b-0">
                <Button
                  className="w-full justify-between p-4 sm:p-6 h-auto bg-white text-black hover:bg-white cursor-pointer"
                  onClick={() => toggleItem(index)}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="bg-orange-100 p-2 sm:p-3 rounded-full">
                      {policy.icon}
                    </div>
                    <h3 className="text-sm sm:text-lg font-bold text-left">
                      {policy.title}
                    </h3>
                  </div>
                  {openItems.includes(index) ? (
                    <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                  )}
                </Button>
                {openItems.includes(index) && (
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                    <div className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      {policy.content}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Additional Services */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-center">
              Servicios Adicionales Disponibles
            </CardTitle>
            <p className="text-sm sm:text-base text-muted-foreground text-center">
              Mejora tu experiencia de compra con nuestros servicios premium
            </p>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {additionalServices.map((service, index) => (
                <div
                  key={index}
                  className="bg-gray-100 flex flex-col justify-between rounded-lg p-4 sm:p-6 text-center hover:bg-muted transition-colors"
                >
                  <div>
                    <div className="bg-orange-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      {service.icon}
                    </div>
                    <h3 className="font-semibold text-sm sm:text-lg mb-2">
                      {service.title}
                    </h3>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                      {service.description}
                    </p>
                    <Badge
                      variant="secondary"
                      className="font-semibold text-xs sm:text-sm"
                    >
                      {service.price}
                    </Badge>
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
              <FaHandsHelping className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
              <h3 className="font-semibold text-lg sm:text-xl">
                ¿Necesitas ayuda con tu envío?
              </h3>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
              Nuestro equipo de logística está disponible para asesorarte
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white hover:bg-gray-50 text-black border border-black cursor-pointer text-sm sm:text-base"
              >
                <Mail className="h-4 w-4 mr-2" />
                Envianos un correo
              </Button>
              <Button size="lg" className="cursor-pointer text-sm sm:text-base">
                <FaWhatsapp className="h-4 w-4 mr-2" />
                Escribenos al Whatsapp
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ShippingPolicies;
