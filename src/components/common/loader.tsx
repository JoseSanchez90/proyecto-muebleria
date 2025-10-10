import { useEffect, useState } from "react";

function Loader() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (showContent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white overflow-hidden">
      <div className="text-center space-y-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3">
          <img
            src="/logo.png"
            className="w-12 h-12"
            alt="Munfort"
          />
          <p className="font-sans font-bold text-xl">Munfort</p>
        </div>

        {/* Spinner elegante */}
        <div className="flex justify-center">
          <div className="w-12 h-12 border-3 border-gray-300 border-t-black rounded-full animate-spin"></div>
        </div>

        {/* Texto */}
        <div>
          <p className="text-gray-700 font-medium">Creando espacios únicos...</p>
          <p className="text-gray-500 text-sm mt-1">Un momento, por favor</p>
        </div>
      </div>
    </div>
  );
}

export default Loader;