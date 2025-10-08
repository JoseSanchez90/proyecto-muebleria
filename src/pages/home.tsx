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

// Datos por defecto mientras cargan las imágenes
const defaultSlides: Slide[] = [
  {
    id: 1,
    title: "El Corazón de tu Hogar",
    subtitle:
      "Donde nacen las mejores conversaciones. Confort y diseño en perfecta armonía",
    image: "",
  },
  {
    id: 2,
    title: "El Punto de Encuentro",
    subtitle:
      "El complemento ideal para tu living. Funcionalidad y estilo para tu día a día",
    image: "",
  },
  {
    id: 3,
    title: "Tu Refugio Personal",
    subtitle:
      "Crea el dormitorio de tus sueños. Estilo y confort para un descanso renovador",
    image: "",
  },
  {
    id: 4,
    title: "Diseño que Inspira",
    subtitle:
      "Elegancia y ergonomía para tu espacio de trabajo. Diseñada para inspirar tu mejor rendimiento",
    image: "",
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
        const { data: files, error } = await supabase
          .storage
          .from('Flayers')
          .list('', {
            limit: 100,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' }
          });

        if (error) {
          console.error('Error al cargar imágenes:', error);
          setLoading(false);
          return;
        }

        if (files && files.length > 0) {
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
          
          // Filtrar solo imágenes
          const imageFiles = files.filter(file => 
            /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name) &&
            file.name !== '.emptyFolderPlaceholder'
          );

          // Actualizar slides con las imágenes de Supabase
          const updatedSlides = defaultSlides.map((slide, index) => {
            if (imageFiles[index]) {
              return {
                ...slide,
                image: `${supabaseUrl}/storage/v1/object/public/Flayers/${imageFiles[index].name}`
              };
            }
            return slide;
          });

          setSlides(updatedSlides);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
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

  if (loading) {
    return (
      <main className="min-h-screen px-20 flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-xl">Cargando...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-20 bg-gray-100 pt-8">
      {/* Carousel */}
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
              {slide.image ? (
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Error al cargar imagen:', slide.image);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-400">Imagen no disponible</p>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-br bg-black opacity-50"></div>
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
            <h3 className="text-3xl font-semibold">Descubre nuestra colección de sofás modernos</h3>
            <p className="text-lg text-gray-600">Crea el espacio perfecto con diseño versátiles</p>
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