import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "../lib/supabaseClient";
import MasVendidos from "@/features/masVendidos";
import LoUltimo from "@/features/loUltimo";
import { Link } from "react-router-dom";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
}

// Datos por defecto con imágenes locales de respaldo
const defaultSlides: Slide[] = [
  {
    id: 1,
    title: "El Corazón de tu Hogar",
    subtitle:
      "Donde nacen las mejores conversaciones. Confort y diseño en perfecta armonía",
    image: "", // Imagen local de respaldo
  },
  {
    id: 2,
    title: "El Punto de Encuentro",
    subtitle:
      "El complemento ideal para tu living. Funcionalidad y estilo para tu día a día",
    image: "", // Imagen local de respaldo
  },
  {
    id: 3,
    title: "Tu Refugio Personal",
    subtitle:
      "Crea el dormitorio de tus sueños. Estilo y confort para un descanso renovador",
    image: "", // Imagen local de respaldo
  },
  {
    id: 4,
    title: "Diseño que Inspira",
    subtitle:
      "Elegancia y ergonomía para tu espacio de trabajo. Diseñada para inspirar tu mejor rendimiento",
    image: "", // Imagen local de respaldo
  },
];

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slides, setSlides] = useState<Slide[]>(defaultSlides);
  const [loading, setLoading] = useState(true);

  // Cargar imágenes de Supabase
  useEffect(() => {
    const loadImages = async () => {
      try {
        console.log("Iniciando carga de imágenes desde Supabase Storage...");

        const { data: files, error } = await supabase.storage
          .from("Flayers")
          .list("", {
            limit: 100,
            offset: 0,
            sortBy: { column: "name", order: "asc" },
          });

        console.log("Archivos encontrados:", files);
        console.log("Error al listar archivos:", error);

        if (error) {
          console.error("Error al cargar imágenes de Supabase:", error);
          // IMPORTANTE: No bloquear la app si falla Supabase
          // Usar slides por defecto y continuar
          setLoading(false);
          return;
        }

        // Si no hay archivos o hay error, usar slides por defecto
        if (!files || files.length === 0) {
          console.log(
            "No se encontraron imágenes en Supabase, usando imágenes por defecto"
          );
          setLoading(false);
          return;
        }

        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        console.log("Supabase URL:", supabaseUrl);

        // Filtrar solo imágenes
        const imageFiles = files.filter(
          (file) =>
            /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name) &&
            file.name !== ".emptyFolderPlaceholder"
        );

        console.log("Imágenes filtradas:", imageFiles);

        if (imageFiles.length > 0) {
          // Actualizar slides con las imágenes de Supabase
          const updatedSlides = defaultSlides.map((slide, index) => {
            if (imageFiles[index]) {
              const imageUrl = `${supabaseUrl}/storage/v1/object/public/Flayers/${imageFiles[index].name}`;
              console.log(`Slide ${index}: ${imageUrl}`);
              return {
                ...slide,
                image: imageUrl,
              };
            }
            return slide; // Mantener imagen por defecto si no hay suficiente
          });

          setSlides(updatedSlides);
        } else {
          console.log("No se encontraron imágenes válidas en Supabase");
        }
      } catch (err) {
        console.error("Error inesperado:", err);
      } finally {
        // IMPORTANTE: Siempre quitar el loading
        setLoading(false);
        console.log("Carga de imágenes completada");
      }
    };

    loadImages();
  }, []);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 10000);
    return () => clearInterval(interval);
  });

  return (
    <main className="min-h-screen px-20 bg-gray-100 pt-4 2xl:pt-8">
      {/* MOSTRAR SKELETON O CAROUSEL (no ambos) */}
      {loading ? (
        // SPINNER elegante
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-6">
            {/* Spinner con sombra */}
            <div className="flex justify-center">
              <div className="w-12 h-12 border-3 border-gray-300 border-t-gray-700 rounded-full animate-spin shadow-md"></div>
            </div>

            {/* Texto */}
            <div className="space-y-2">
              <p className="text-gray-800 font-semibold text-xl">
                Cargando portada
              </p>
              <p className="text-gray-600 text-sm">Un momento, por favor</p>
            </div>
          </div>
        </div>
      ) : (
        // CAROUSEL cuando terminó de cargar
        <section className="relative xl:h-[30rem] 2xl:h-[48rem] overflow-hidden rounded-3xl">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === currentSlide
                  ? "translate-x-0 opacity-100"
                  : "translate-x-full opacity-0"
              }`}
            >
              {/* Imagen de fondo */}
              <div className="absolute inset-0">
                {slide.image && (
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error(
                        "❌ Error al cargar imagen de Supabase:",
                        slide.image
                      );
                      e.currentTarget.style.display = "none";
                    }}
                    onLoad={() =>
                      console.log(
                        `✅ Imagen cargada correctamente: ${slide.image}`
                      )
                    }
                  />
                )}
                {/* Overlay para mejor contraste del texto */}
                <div className="absolute inset-0 bg-black/40"></div>
              </div>

              {/* Contenido del slide */}
              <div className="relative h-full flex items-center justify-end px-8">
                <div className="max-w-2xl text-right text-white">
                  <h2 className="text-5xl lg:text-6xl font-bold mb-4">
                    {slide.title}
                  </h2>
                  <p className="text-xl md:text-2xl font-medium opacity-90">
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Controles de navegación */}
          <div className="absolute bottom-8 right-8 md:bottom-6 md:right-8 flex gap-4 z-10">
            <Button
              onClick={prevSlide}
              disabled={isAnimating}
              className="w-10 h-10 rounded-full cursor-pointer bg-white hover:bg-gray-300 text-black shadow-lg backdrop-blur-sm"
              size="icon"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              onClick={nextSlide}
              disabled={isAnimating}
              className="w-10 h-10 rounded-full cursor-pointer bg-white hover:bg-gray-300 text-black shadow-lg backdrop-blur-sm"
              size="icon"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          {/* Indicadores de slide */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true);
                    setCurrentSlide(index);
                    setTimeout(() => setIsAnimating(false), 1000);
                  }
                }}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentSlide
                    ? "w-12 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </section>
      )}

      {/* El resto de tu contenido */}
      <section className="w-full h-full py-24 space-y-16">
        <div className="flex flex-col gap-6 2xl:gap-10">
          <h2 className="text-3xl font-bold">Nuestros más vendidos</h2>
          <div>
            <MasVendidos />
          </div>
        </div>
        <div className="flex flex-col gap-6 2xl:gap-10">
          <h2 className="text-3xl font-bold">Lo último en llegar</h2>
          <div>
            <LoUltimo />
          </div>
        </div>
      </section>

      <section className="pt-16 pb-36">
        <div className="flex justify-between items-center bg-white p-16 border border-gray-300 rounded-2xl">
          <div className="flex flex-col gap-2">
            <h3 className="text-3xl font-semibold">
              Descubre nuestra colección de sofás modernos
            </h3>
            <p className="text-lg text-gray-600">
              Crea el espacio perfecto con diseño versátiles
            </p>
          </div>
          <div>
            <Link to="/sofas">
              <Button size="lg" className="py-6 px-12 cursor-pointer">
                Ver ahora
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
