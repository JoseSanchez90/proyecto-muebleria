import { AuthProvider } from "./components/Authentication/authContext";
import { Toaster } from "./components/ui/sonner";
import { CartProvider } from "./context/cartContext";
import { FavoriteProvider } from "./context/favoriteContext";
import { AppRoutes } from "./routes";

function App() {
  return (
    <AuthProvider>
      <FavoriteProvider>
        <CartProvider>
          <AppRoutes />
          <Toaster position="top-right" richColors />
        </CartProvider>
      </FavoriteProvider>
    </AuthProvider>
  );
}

export default App;
