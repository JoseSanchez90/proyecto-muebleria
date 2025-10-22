import { MdDesignServices } from "react-icons/md";
import { PiSealCheckFill } from "react-icons/pi";
import { FaTree } from "react-icons/fa6";
import { HiUserGroup } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function About() {
  const values = [
    {
      icon: (
        <MdDesignServices className="w-6 h-6 md:w-8 md:h-8 2xl:w-10 2xl:h-10 text-orange-600" />
      ),
      title: "Diseño Atemporal",
      description:
        "Creamos piezas que trascienden las tendencias, destinadas a ser amadas por generaciones.",
      badge: "Estilo Duradero",
    },
    {
      icon: (
        <PiSealCheckFill className="w-6 h-6 md:w-8 md:h-8 2xl:w-10 2xl:h-10 text-orange-600" />
      ),
      title: "Artesanía de Calidad",
      description:
        "Cada mueble está hecho con meticulosa atención al detalle por artesanos expertos.",
      badge: "Hecho a Mano",
    },
    {
      icon: (
        <FaTree className="w-6 h-6 md:w-8 md:h-8 2xl:w-10 2xl:h-10 text-orange-600" />
      ),
      title: "Sostenibilidad",
      description:
        "Materiales de origen responsable y procesos que minimizan nuestro impacto ambiental.",
      badge: "Eco-Friendly",
    },
    {
      icon: (
        <HiUserGroup className="w-6 h-6 md:w-8 md:h-8 2xl:w-10 2xl:h-10 text-orange-600" />
      ),
      title: "Enfoque en el Cliente",
      description:
        "Tu satisfacción es nuestra prioridad. Estamos aquí para ayudarte a elegir perfectamente.",
      badge: "Atención Personal",
    },
  ];

  return (
    <main className="min-h-screen px-4 lg:px-20 bg-gray-100 pt-6 2xl:pt-8">
      {/* Hero Section */}
      <section className="relative h-[35rem] md:h-[25rem] 2xl:h-[35rem] overflow-hidden rounded-3xl py-12">
        <div className="absolute inset-0 transition-all duration-1000 ease-linear ">
          {/* Imagen de fondo */}
          <div className="absolute inset-0">
            <img
              src="/about.jpg"
              alt="About Image"
              className="w-full h-full object-cover"
            />
            {/* Overlay mejorado para mejor legibilidad */}
            <div className="absolute inset-0 bg-black/70"></div>
          </div>
          {/* Contenido del slide */}
          <div className="relative h-full flex items-center justify-center px-4 lg:px-8">
            <div className="max-w-5xl text-center text-white">
              <h2 className="text-3xl md:text-4xl 2xl:text-6xl font-bold mb-4">
                Diseñando espacios para vivir mejor
              </h2>
              <p className="text-lg md:text-2xl 2xl:font-medium">
                Descubre cómo nuestra pasión por el diseño minimalista puede
                transformar tu hogar
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History & Mission Section */}
      <section className="w-full py-12 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-16 max-w-7xl mx-auto">
            <div className="flex flex-col gap-12 lg:gap-16">
              <div className="flex flex-col gap-8">
                <div className="flex items-center gap-4">
                  <div className="bg-orange-100 p-3 rounded-full">
                    <MdDesignServices className="w-8 h-8 text-orange-600" />
                  </div>
                  <div>
                    <Badge
                      variant="outline"
                      className="mb-2 border-orange-200 text-orange-600 bg-orange-50"
                    >
                      Nuestra Trayectoria
                    </Badge>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                      Nuestra Historia
                    </h2>
                  </div>
                </div>
                <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                  Nacimos de una pasión compartida por el diseño atemporal y la
                  artesanía de calidad. Creemos que los muebles no solo deben
                  ser funcionales, sino también contar una historia y crear una
                  atmósfera de calma y belleza en tu hogar.
                </p>
              </div>

              <div className="flex flex-col gap-8">
                <div className="flex items-center gap-4">
                  <div className="bg-orange-100 p-3 rounded-full">
                    <PiSealCheckFill className="w-8 h-8 text-orange-600" />
                  </div>
                  <div>
                    <Badge
                      variant="outline"
                      className="mb-2 border-orange-200 text-orange-600 bg-orange-50"
                    >
                      Nuestro Propósito
                    </Badge>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                      Nuestra Misión
                    </h2>
                  </div>
                </div>
                <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                  Nuestra misión es crear piezas de mobiliario que inspiren una
                  vida más simple y consciente. Combinamos la estética
                  minimalista con materiales sostenibles para ofrecerte muebles
                  que no solo embellecen tu espacio, sino que también respetan
                  nuestro planeta.
                </p>
              </div>
            </div>

            <div className="w-full">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/about2.jpg"
                  alt="About Image 2"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="w-full py-12 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-12 md:gap-16 max-w-7xl mx-auto">
            <div className="flex flex-col text-center gap-6">
              <Badge
                variant="outline"
                className="w-fit mx-auto px-4 py-1 border-orange-200 text-orange-600 bg-orange-50"
              >
                Lo Que Nos Define
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                Nuestros Valores
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
                Los principios que guían cada diseño y decisión que tomamos en
                Muebles Munfort
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {values.map((value, index) => (
                <Card
                  key={index}
                  className="bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 group cursor-pointer"
                >
                  <CardContent className="p-6 md:p-8 flex flex-col items-center text-center gap-6">
                    <div className="bg-orange-100 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors duration-300">
                      {value.icon}
                    </div>

                    <div className="flex flex-col gap-4">
                      <Badge className="w-fit mx-auto bg-orange-500 hover:bg-orange-600 text-white border-none text-xs">
                        {value.badge}
                      </Badge>

                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
                        {value.title}
                      </h3>

                      <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full h-full py-12 md:py-24">
        <div className="relative h-[35rem] md:h-[25rem] 2xl:h-[35rem] overflow-hidden rounded-3xl">
          <div className="absolute inset-0">
            {/* Imagen de fondo */}
            <div className="absolute inset-0">
              <img
                src="/about3.jpg"
                alt="About Image"
                className="w-full h-full object-cover"
              />
              {/* Overlay mejorado para mejor legibilidad */}
            </div>
            {/* Contenido del slide */}
            <div className="relative h-full flex items-center justify-center px-4 lg:px-8">
              <div className="flex flex-col justify-center gap-6 text-center text-white">
                <h2 className="w-full mx-auto text-3xl md:text-4xl 2xl:text-6xl font-bold 2xl:px-52">
                  Transforma tu hogar con piezas que cuentan una historia.
                </h2>
                <p className="text-lg md:text-2xl 2xl:font-medium">
                  Explora nuestra colección y encuentra el mueble perfecto que
                  has estado buscando.
                </p>
                <div className="w-full">
                  <Link to="/productos">
                    <Button
                      size="lg"
                      className="w-fit bg-orange-600 hover:bg-orange-700 text-white cursor-pointer"
                    >
                      Descubre nuestros muebles
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;
