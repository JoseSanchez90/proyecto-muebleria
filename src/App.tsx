import { AuthProvider } from "./components/Authentication/authContext";
import { CartProvider } from "./context/cartContext";
import { AppRoutes } from "./routes";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </AuthProvider>
  )
}

export default App;
