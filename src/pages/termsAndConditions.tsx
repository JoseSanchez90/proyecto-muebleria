// TermsAndConditions.tsx
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Scale,
  Shield,
  FileText,
  UserCheck,
  ShoppingCart,
  Truck,
  Package,
  BookOpen,
  Mail,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaWhatsapp } from "react-icons/fa6";
import { FaBalanceScale } from "react-icons/fa";

const TermsAndConditions = () => {
  const [openSections, setOpenSections] = useState<number[]>([0]);

  const toggleSection = (index: number) => {
    setOpenSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const sections = [
    {
      title: "Aceptación de los Términos",
      icon: <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />,
      content:
        "Al acceder y realizar compras en Muebles Munfort, usted acepta estar legalmente vinculado por estos Términos y Condiciones, nuestra Política de Privacidad, el Código de Protección y Defensa del Consumidor (Ley N° 29571) y todas las leyes y regulaciones peruanas aplicables. Nos reservamos el derecho de actualizar estos términos, notificando los cambios a través de nuestra plataforma. El uso continuado del sitio después de cualquier modificación constituye su aceptación de los cambios.",
    },
    {
      title: "Definiciones y Alcance",
      icon: <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />,
      content:
        "Para efectos de estos términos y conforme a la legislación peruana: 'Plataforma' se refiere al sitio web Muebles Munfort y todos sus servicios asociados; 'Usuario' o 'Consumidor' designa a cualquier persona que acceda o utilice nuestra plataforma según la Ley N° 29571; 'Productos' incluye todos los muebles, artículos de hogar y decoración ofrecidos; 'Contrato' significa el acuerdo de compraventa electrónica regulado por la Ley N° 27291; 'Servicios' engloban todas las funcionalidades ofrecidas a través de nuestra plataforma digital.",
    },
    {
      title: "Uso Autorizado de la Plataforma",
      icon: <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            Concedemos una licencia limitada, no exclusiva y revocable para
            acceder y utilizar nuestra plataforma conforme a estos términos y la
            legislación peruana. Quedan expresamente prohibidas las siguientes
            actividades:
          </p>
          <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-muted-foreground pl-3 sm:pl-4">
            <li>
              Utilizar la plataforma para fines comerciales no autorizados o
              reventa de productos
            </li>
            <li>Realizar pedidos fraudulentos o con información falsa</li>
            <li>Modificar, adaptar o hackear la plataforma o su contenido</li>
            <li>
              Utilizar spiders, robots o otros métodos automatizados de
              extracción de datos
            </li>
            <li>
              Infringir derechos de propiedad intelectual protegidos por el
              INDECOPI
            </li>
            <li>
              Publicar contenido difamatorio, obsceno o ilegal a través de
              nuestros sistemas
            </li>
          </ul>
          <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 mt-3">
            <p className="text-xs text-amber-800">
              <strong>Nota:</strong> El incumplimiento de estas condiciones
              puede resultar en la suspensión inmediata de su cuenta y acciones
              legales según la legislación peruana.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Registro y Cuentas de Usuario",
      icon: <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />,
      content:
        "Para realizar compras, deberá crear una cuenta proporcionando información precisa y completa de acuerdo con la Ley de Protección de Datos Personales (Ley N° 29733). Usted es responsable de mantener la confidencialidad de sus credenciales y de todas las actividades realizadas bajo su cuenta. Nos reservamos el derecho de suspender o terminar cuentas que violen estos términos o que muestren comportamientos fraudulentos. Los usuarios deben ser mayores de 18 años o contar con autorización parental para realizar compras.",
    },
    {
      title: "Condiciones de Compra y Venta",
      icon: <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            Todos los precios están expresados en Soles (PEN) e incluyen IGV
            aplicable según la legislación tributaria peruana. Nos reservamos el
            derecho de modificar precios y disponibilidad de productos,
            garantizando que los precios mostrados al momento de la compra sean
            los aplicables.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <h4 className="font-semibold text-xs sm:text-sm mb-2 text-orange-600">
                Proceso de Compra
              </h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Confirmación inmediata vía email</li>
                <li>• Verificación de stock en tiempo real</li>
                <li>• Facturación electrónica SUNAT</li>
                <li>• Pagos seguros con certificación PCI</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <h4 className="font-semibold text-xs sm:text-sm mb-2 text-orange-600">
                Condiciones Específicas
              </h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Límite de 5 unidades por producto</li>
                <li>• Precios válidos por 30 días</li>
                <li>• Stock sujeto a disponibilidad</li>
                <li>• Cambios sin previo aviso</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Políticas de Entrega y Instalación",
      icon: <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            Ofrecemos diferentes opciones de entrega dentro de Lima
            Metropolitana y provincias. Los costos de envío se calculan durante
            el proceso de compra según la ubicación.
          </p>
          <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-muted-foreground pl-3 sm:pl-4">
            <li>
              <strong>Lima Metropolitana:</strong> 3-5 días hábiles (gratis en
              compras mayores a S/ 1,200)
            </li>
            <li>
              <strong>Provincias Costa:</strong> 5-7 días hábiles
            </li>
            <li>
              <strong>Provincias Sierra:</strong> 7-10 días hábiles
            </li>
            <li>
              <strong>Provincias Selva:</strong> 10-15 días hábiles
            </li>
            <li>
              <strong>Instalación Profesional:</strong> Disponible con costo
              adicional
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "Garantías y Devoluciones",
      icon: <Package className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />,
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 text-xs sm:text-sm mb-2">
              Derechos del Consumidor - Ley N° 29571
            </h4>
            <ul className="text-xs text-green-700 space-y-1">
              <li>• Derecho de retracto: 7 días calendario</li>
              <li>• Garantía legal: 3 meses contra vicios ocultos</li>
              <li>• Libro de reclamaciones virtual</li>
              <li>• Protección INDECOPI</li>
            </ul>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Todos nuestros productos cuentan con garantía legal. Para
            devoluciones, los productos deben estar en estado original con
            empaque completo.
          </p>
        </div>
      ),
    },
    {
      title: "Propiedad Intelectual",
      icon: <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />,
      content:
        "Todo el contenido de la plataforma, incluyendo diseños, logotipos, textos, imágenes y software, es propiedad de Muebles Munfort o de sus licenciantes y está protegido por las leyes de propiedad intelectual peruanas y por el INDECOPI. Queda prohibida cualquier reproducción, distribución o modificación sin autorización expresa por escrito. Los diseños de nuestros productos están protegidos por derechos de autor y leyes de propiedad industrial peruanas.",
    },
    {
      title: "Limitación de Responsabilidad",
      icon: <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />,
      content:
        "Muebles Munfort no será responsable por daños indirectos, incidentales o consecuentes resultantes del uso o incapacidad de usar nuestros productos o servicios, en los límites permitidos por la legislación peruana. Nuestra responsabilidad máxima en cualquier reclamo será limitada al monto pagado por el producto en cuestión. No nos hacemos responsables por daños causados por uso inadecuado, modificaciones no autorizadas, negligencia en el mantenimiento o fuerza mayor.",
    },
    {
      title: "Ley Aplicable y Jurisdicción",
      icon: <Scale className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />,
      content:
        "Estos términos se rigen por las leyes de la República del Perú. Cualquier disputa relacionada con estos términos o con los productos y servicios ofrecidos será resuelta en los tribunales competentes de Lima, renunciando expresamente a cualquier otro fuero que pudiera corresponder. Para controversias con consumidores, se aplicarán los mecanismos de conciliación previos establecidos por INDECOPI.",
    },
    {
      title: "Protección al Consumidor",
      icon: <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            De acuerdo con la Ley N° 29571, todos nuestros usuarios gozan de los
            derechos fundamentales del consumidor.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 text-xs sm:text-sm mb-2">
                Derechos Básicos
              </h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Información veraz y completa</li>
                <li>• Protección de salud y seguridad</li>
                <li>• Elección libre e informada</li>
                <li>• No discriminación</li>
              </ul>
            </div>
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 text-xs sm:text-sm mb-2">
                Mecanismos
              </h4>
              <ul className="text-xs text-green-700 space-y-1">
                <li>• Libro de reclamaciones</li>
                <li>• Conciliación extrajudicial</li>
                <li>• Garantías legales</li>
                <li>• Protección INDECOPI</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const legalReferences = [
    {
      icon: <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />,
      title: "Ley del Consumidor",
      description:
        "Ley N° 29571 - Código de Protección y Defensa del Consumidor",
    },
    {
      icon: <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />,
      title: "Protección de Datos",
      description: "Ley N° 29733 - Ley de Protección de Datos Personales",
    },
    {
      icon: <Scale className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />,
      title: "Comercio Electrónico",
      description: "Ley N° 27291 - Ley de Firmas y Certificados Digitales",
    },
    {
      icon: <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />,
      title: "Derechos Fundamentales",
      description: "Constitución Política del Perú - Artículos 2 y 65",
    },
  ];

  return (
    <section className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-12 max-w-6xl">
        {/* Header Section */}
        <Card className="mb-6 sm:mb-8 shadow-sm">
          <CardHeader className="text-center px-4 sm:px-6">
            <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-tight">
              Términos y Condiciones
            </CardTitle>
            <p className="text-sm sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mt-2">
              Conoce los términos que rigen tu relación con Muebles Munfort
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-4">
              <Badge className="flex items-center gap-1 bg-orange-600 text-xs sm:text-sm">
                <Shield className="h-3 w-3" />
                Protección Legal
              </Badge>
              <Badge className="flex items-center gap-1 bg-orange-600 text-xs sm:text-sm">
                <Scale className="h-3 w-3" />
                Cumplimiento Perú
              </Badge>
              <Badge className="flex items-center gap-1 bg-orange-600 text-xs sm:text-sm">
                <UserCheck className="h-3 w-3" />
                Derechos Garantizados
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Main Terms Accordion */}
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

        {/* Legal References */}
        <Card className="shadow-sm mb-6 sm:mb-8">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-center">
              Marco Legal Peruano
            </CardTitle>
            <p className="text-sm sm:text-base text-muted-foreground text-center">
              Nuestros términos se basan en la legislación vigente del Perú
            </p>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {legalReferences.map((reference, index) => (
                <div
                  key={index}
                  className="bg-gray-100 flex flex-col justify-between rounded-lg p-4 sm:p-6 text-center hover:bg-gray-200 transition-colors"
                >
                  <div>
                    <div className="bg-orange-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      {reference.icon}
                    </div>
                    <h3 className="font-semibold text-sm sm:text-lg mb-2">
                      {reference.title}
                    </h3>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {reference.description}
                    </p>
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
              <FaBalanceScale className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
              <h3 className="font-semibold text-lg sm:text-xl">
                ¿Tienes dudas sobre nuestros términos?
              </h3>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
              Nuestro equipo legal está disponible para aclarar cualquier
              consulta
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white hover:bg-gray-50 text-black border border-black cursor-pointer text-sm sm:text-base"
              >
                <Mail className="h-4 w-4 mr-2" />
                Consulta Legal
              </Button>
              <Button
                size="lg"
                className="cursor-pointer text-sm sm:text-base"
              >
                <FaWhatsapp className="h-4 w-4 mr-2" />
                WhatsApp Legal
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TermsAndConditions;
