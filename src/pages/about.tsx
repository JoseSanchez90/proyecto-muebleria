import { MdDesignServices } from "react-icons/md";
import { PiSealCheckFill } from "react-icons/pi";
import { FaTree } from "react-icons/fa6";
import { HiUserGroup } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function About() {

  return (
    <main className="min-h-screen px-2 lg:px-20 bg-gray-100 pt-6 2xl:pt-8">
      <section className="relative h-[30rem] md:h-[25rem] 2xl:h-[35rem] overflow-hidden rounded-3xl">
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

      <section className="w-full h-full flex justify-center items-center px-4 md:px-0 pt-20 md:pt-24">
        <div className="flex md:grid md:grid-cols-2 justify-items-center gap-20">
          <div className="flex flex-col gap-10 md:grid md:grid-rows-2 items-center">
            <div className="max-w-2xl mx-auto flex flex-col gap-4">
              <h2 className="text-3xl md:text-4xl 2xl:text-5xl font-bold">Nuestra Historia</h2>
              <p className="text-lg md:text-xl 2xl:text-2xl">
                Nacimos de una pasión compartida por el diseño atemporal y la
                artesanía de calidad. Creemos que los muebles no solo deben ser
                funcionales, sino también contar una historia y crear una
                atmósfera de calma y belleza en tu hogar.
              </p>
            </div>
            <div className="max-w-2xl mx-auto flex flex-col gap-4">
              <h2 className="text-3xl md:text-4xl 2xl:text-5xl font-bold">Nuestra Misión</h2>
              <p className="text-lg md:text-xl 2xl:text-2xl">
                Nuestra misión es crear piezas de mobiliario que inspiren una
                vida más simple y consciente. Combinamos la estética minimalista
                con materiales sostenibles para ofrecerte muebles que no solo
                embellecen tu espacio, sino que también respetan nuestro
                planeta.
              </p>
            </div>
          </div>
          <img
            src="/about2.jpg"
            alt="About Image 2"
            className="hidden md:flex w-[45rem] rounded-xl"
          />
        </div>
      </section>

      <section className="w-full h-full py-24 md:py-40">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col text-center gap-4">
            <h2 className="text-3xl md:text-4xl 2xl:text-5xl font-bold">Nuestros Valores</h2>
            <p className="text-lg md:text-xl 2xl:text-2xl">
              Los principios que guían cada diseño y decisión que tomamos.
            </p>
          </div>
          <div className="flex justify-center items-center gap-20">
            <div className="max-w-xs flex flex-col gap-4 bg-orange-200 md:p-6 2xl:p-8 rounded-2xl">
              <div className="md:w-14 md:h-14 2xl:w-18 2xl:h-18 flex items-center justify-center mx-auto rounded-full bg-white">
                <MdDesignServices className="md:w-8 md:h-8 2xl:w-10 2xl:h-10 text-orange-600" />
              </div>
              <div className="flex flex-col gap-2 text-black text-center">
                <h3 className="md:text-lg 2xl:text-xl font-semibold">Diseño Atemporal</h3>
                <p className="md:text-sm 2xl:text-base">
                  Creamos piezas que trascienden las tendencias, destinadas a
                  ser amadas por generaciones.
                </p>
              </div>
            </div>
            <div className="mmax-w-xs flex flex-col gap-4 bg-orange-200 md:p-6 2xl:p-8 rounded-2xl">
              <div className="md:w-14 md:h-14 2xl:w-18 2xl:h-18 flex items-center justify-center mx-auto rounded-full bg-white">
                <PiSealCheckFill className="md:w-8 md:h-8 2xl:w-10 2xl:h-10 text-orange-600" />
              </div>
              <div className="flex flex-col gap-2 text-black text-center">
                <h3 className="md:text-lg 2xl:text-xl font-semibold">Artesanía de Calidad</h3>
                <p className="md:text-sm 2xl:text-base">
                  Cada mueble está hecho con meticulosa atención al detalle por
                  artesanos expertos.
                </p>
              </div>
            </div>
            <div className="mmax-w-xs flex flex-col gap-4 bg-orange-200 md:p-6 2xl:p-8 rounded-2xl">
              <div className="md:w-14 md:h-14 2xl:w-18 2xl:h-18 flex items-center justify-center mx-auto rounded-full bg-white">
                <FaTree className="md:w-8 md:h-8 2xl:w-10 2xl:h-10 text-orange-600" />
              </div>
              <div className="flex flex-col gap-2 text-black text-center">
                <h3 className="md:text-lg 2xl:text-xl font-semibold">Sostenibilidad</h3>
                <p className="md:text-sm 2xl:text-base">
                  Utilizamos materiales de origen responsable y procesos que
                  minimizan nuestro impacto.
                </p>
              </div>
            </div>
            <div className="mmax-w-xs flex flex-col gap-4 bg-orange-200 md:p-6 2xl:p-8 rounded-2xl">
              <div className="md:w-14 md:h-14 2xl:w-18 2xl:h-18 flex items-center justify-center mx-auto rounded-full bg-white">
                <HiUserGroup className="md:w-8 md:h-8 2xl:w-10 2xl:h-10 text-orange-600" />
              </div>
              <div className="flex flex-col gap-2 text-black text-center">
                <h3 className="md:text-lg 2xl:text-xl font-semibold">Enfoque en el Cliente</h3>
                <p className="md:text-sm 2xl:text-base">
                  Tu satisfacción es nuestra prioridad. Estamos aquí para
                  ayudarte a crear el hogar de tus sueños.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full h-full pt-6 pb-32">
        <div className="relative md:h-[25rem] 2xl:h-[35rem] overflow-hidden rounded-3xl">
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
                <h2 className="w-full mx-auto md:text-4xl 2xl:text-6xl font-bold 2xl:px-52">
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
