import { AuthProvider } from "./components/Authentication/authContext";
import { AppRoutes } from "./routes";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              borderRadius: "12px",
              background: "#fff",
              color: "#444",
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
