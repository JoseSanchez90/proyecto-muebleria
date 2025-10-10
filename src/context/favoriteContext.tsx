import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/Authentication/authContext";
import toast from "react-hot-toast";

interface FavoriteContextType {
  favorites: string[]; // Array de product_ids
  loading: boolean;
  addFavorite: (productId: string) => Promise<void>;
  removeFavorite: (productId: string) => Promise<void>;
  toggleFavorite: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(
  undefined
);

export function FavoriteProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  // Cargar favoritos del usuario
  const loadFavorites = async () => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("favoritos")
        .select("product_id")
        .eq("user_id", user.id);

      if (error) throw error;

      const favoriteIds = data?.map((item) => item.product_id) || [];
      setFavorites(favoriteIds);
    } catch (error) {
      console.error("Error cargando favoritos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Recargar favoritos cuando cambia el usuario
  useEffect(() => {
    loadFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Agregar a favoritos
  const addFavorite = async (productId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("favoritos")
        .insert({ user_id: user.id, product_id: productId });

      if (error) throw error;

      setFavorites((prev) => [...prev, productId]);
    } catch (error) {
      console.error("Error agregando favorito:", error);
    }
  };

  // Eliminar de favoritos
  const removeFavorite = async (productId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("favoritos")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);

      if (error) throw error;

      setFavorites((prev) => prev.filter((id) => id !== productId));
    } catch (error) {
      console.error("Error eliminando favorito:", error);
    }
  };

  // Alternar favorito
  const toggleFavorite = async (productId: string) => {
    if (!user) {
      toast.error("Debes iniciar sesión para agregar favoritos");
      return;
    }

    if (toggling === productId) return; // Evitar clicks múltiples

    setToggling(productId);

    try {
      if (isFavorite(productId)) {
        await removeFavorite(productId);
        toast.success("Producto removido de favoritos");
      } else {
        await addFavorite(productId);
        toast.success("Producto agregado a favoritos");
      }
    } catch (error) {
      console.error("Error al alternar favorito:", error);
      toast.error("Error al actualizar favoritos");
    } finally {
      setToggling(null);
    }
  };

  // Verificar si es favorito
  const isFavorite = (productId: string) => {
    return favorites.includes(productId);
  };

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        loading,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFavorites() {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoriteProvider");
  }
  return context;
}