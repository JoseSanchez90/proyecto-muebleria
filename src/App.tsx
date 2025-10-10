// import { useEffect, useState } from "react";
import { AuthProvider } from "./components/Authentication/authContext";
import { CartProvider } from "./context/cartContext";
import { FavoriteProvider } from "./context/favoriteContext";
import { AppRoutes } from "./routes";
// import Loader from "./components/common/loader";

function App() {
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   // Deshabilitar scroll cuando se monta
  //   document.body.style.overflow = 'hidden'
    
  //   const timer = setTimeout(() => {
  //     setIsLoading(false)
  //     // Habilitar scroll cuando termina el loader
  //     document.body.style.overflow = 'auto'
  //   }, 2000)

  //   return () => {
  //     clearTimeout(timer)
  //     // Asegurarse de habilitar scroll si el componente se desmonta
  //     document.body.style.overflow = 'auto'
  //   }
  // }, [])

        {/* Loader encima de todo */}
      {/* {isLoading && <Loader />}
      <div
        className={
          isLoading
            ? "opacity-0"
            : "opacity-100 transition-opacity duration-300"
        }
      ></div> */}

  return (
    

      <AuthProvider>
        <FavoriteProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </FavoriteProvider>
      </AuthProvider>
    
  );
}

export default App;
