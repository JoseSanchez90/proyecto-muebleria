import { BsFacebook, BsInstagram, BsWhatsapp } from "react-icons/bs";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <section className="w-full bg-black/10">
      {/* Contenido principal del footer */}
      <div className="px-4 sm:px-6 lg:px-8 xl:px-20 py-6 2xl:py-12">
        {/* Grid responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 xl:gap-8 justify-items-center items-start">
          {/* Logo y descripción - Ocupa toda la fila en móvil */}
          <div className="flex flex-col gap-4 justify-center items-center text-center md:items-start md:text-left col-span-1 md:col-span-2 lg:col-span-1">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-24 sm:w-28 lg:w-32 2xl:w-48"
            />
            <div className="flex flex-col justify-center items-center md:items-start">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Muebles Munfort
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mt-1">
                Diseño que transforma tu hogar
              </p>
            </div>
          </div>

          {/* Contenedor para Tienda e Información - 2 columnas en móvil */}
          <div className="grid grid-cols-2 gap-8 md:gap-6 w-full md:col-span-2 lg:col-span-2">
            {/* Enlaces de tienda */}
            <div className="flex flex-col space-y-3 items-center">
              <div className="flex flex-col gap-3">
                <h3 className="text-lg font-bold text-gray-900 pb-2">Tienda</h3>
                <Link
                  to="/sofas"
                  className="text-gray-600 hover:text-orange-600 transition-colors text-sm sm:text-base"
                >
                  Sofás
                </Link>
                <Link
                  to="/sillas"
                  className="text-gray-600 hover:text-orange-600 transition-colors text-sm sm:text-base"
                >
                  Sillas
                </Link>
                <Link
                  to="/mesas"
                  className="text-gray-600 hover:text-orange-600 transition-colors text-sm sm:text-base"
                >
                  Mesas
                </Link>
                <Link
                  to="/decoracion"
                  className="text-gray-600 hover:text-orange-600 transition-colors text-sm sm:text-base"
                >
                  Decoración
                </Link>
              </div>
            </div>

            {/* Información */}
            <div className="flex flex-col space-y-3 items-center">
              <div className="flex flex-col gap-3">
                <h3 className="text-lg font-bold text-gray-900 pb-2">
                  Información
                </h3>
                <Link
                  to="/sobre-nosotros"
                  className="text-gray-600 hover:text-orange-600 transition-colors text-sm sm:text-base"
                >
                  Sobre Nosotros
                </Link>
                <Link
                  to="/politicas-envio"
                  className="text-gray-600 hover:text-orange-600 transition-colors text-sm sm:text-base"
                >
                  Políticas de envío
                </Link>
                <Link
                  to="/terminos-condiciones"
                  className="text-gray-600 hover:text-orange-600 transition-colors text-sm sm:text-base"
                >
                  Términos y Condiciones
                </Link>
                <Link
                  to="/politicas-devoluciones"
                  className="text-gray-600 hover:text-orange-600 transition-colors text-sm sm:text-base"
                >
                  Políticas de Devoluciones
                </Link>
              </div>
            </div>
          </div>

          {/* Redes sociales */}
          <div className="flex flex-col gap-4 text-center md:text-left col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-bold text-gray-900">Síguenos</h3>
            <div className="flex justify-center md:justify-start items-center gap-6">
              <Link
                to="https://web.whatsapp.com/"
                className="text-gray-600 hover:text-green-600 transition-colors transform hover:scale-110"
                aria-label="WhatsApp"
              >
                <BsWhatsapp className="w-5 h-5 2xl:w-6 2xl:h-6" />
              </Link>
              <Link
                to="https://www.facebook.com/"
                className="text-gray-600 hover:text-blue-600 transition-colors transform hover:scale-110"
                aria-label="Facebook"
              >
                <BsFacebook className="w-5 h-5 2xl:w-6 2xl:h-6" />
              </Link>
              <Link
                to="https://www.instagram.com/"
                className="text-gray-600 hover:text-purple-500 transition-colors transform hover:scale-110"
                aria-label="Instagram"
              >
                <BsInstagram className="w-5 h-5 2xl:w-6 2xl:h-6" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Línea separadora */}
      <div className="border-b border-gray-300 mx-4 sm:mx-6 lg:mx-8 xl:mx-20"></div>

      {/* Copyright */}
      <div className="w-full text-center py-4 px-4">
        <small className="text-gray-600 text-xs sm:text-sm">
          &copy; 2025 Muebles Munfort. Todos los derechos reservados.
        </small>
      </div>
    </section>
  );
}

export default Footer;
