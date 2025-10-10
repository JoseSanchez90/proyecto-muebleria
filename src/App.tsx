import { AuthProvider } from "./components/Authentication/authContext";
import { CartProvider } from "./context/cartContext";
import { FavoriteProvider } from "./context/favoriteContext";
import { AppRoutes } from "./routes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <AuthProvider>
      <FavoriteProvider>
        <CartProvider>
          <AppRoutes />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                borderRadius: "12px",
                background: "#333",
                color: "#fff",
              },
            }}
          />
        </CartProvider>
      </FavoriteProvider>
    </AuthProvider>
  );
}

export default App;
