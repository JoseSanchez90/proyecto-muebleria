import { BsFacebook, BsInstagram, BsWhatsapp } from "react-icons/bs"

function Footer() {
  return (
    <section className="w-full px-20 bg-black/10">
      <div className="py-6 2xl:py-12 grid grid-cols-4 justify-items-center items-center border-b border-gray-400">
        <div className="flex flex-col gap-2 justify-center items-center">
          <img src="/public/logo.png" alt="Logo" className="w-32 2xl:w-48" />
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-2xl font-bold">Muebles Munfort</h2>
            <p>Diseño que transforma tu hogar</p>
          </div>
        </div>
        <div className="flex flex-col space-y-1">
          <h3 className="text-lg font-bold pb-1">Tienda</h3>
          <a href="/sofas" className="hover:text-orange-600">Sofás</a>
          <a href="/sillas" className="hover:text-orange-600">Sillas</a>
          <a href="/mesas" className="hover:text-orange-600">Mesas</a>
          <a href="/iluminacion" className="hover:text-orange-600">Iluminación</a>
        </div>
        <div className="flex flex-col space-y-1">
          <h3 className="text-lg font-bold pb-1">Información</h3>
          <a href="/sobre%nosotros" className="hover:text-orange-600">Sobre Nosotros</a>
          <a href="/blog" className="hover:text-orange-600">Blog</a>
          <a href="/politicas%de%envio" className="hover:text-orange-600">Politicas de envio</a>
          <a href="/contacto" className="hover:text-orange-600">Contacto</a>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold">Siguenos</h3>
          <div className="flex justify-center items-center gap-6">
            <a href="https://web.whatsapp.com/">
              <BsWhatsapp className="w-5 h-5 hover:text-green-600" />
            </a>
            <a href="https://www.facebook.com/">
              <BsFacebook className="w-5 h-5 hover:text-blue-600" />
            </a>
            <a href="https://www.instagram.com/">
              <BsInstagram className="w-5 h-5 hover:text-purple-500" />
            </a>
          </div>
        </div>
      </div>
      <div className="w-full text-center py-4">
        <small className="text-gray-600">&copy; 2025 Muebles Munfort. Todos los derechos reservados.</small>
      </div>
    </section>
  )
}

export default Footer