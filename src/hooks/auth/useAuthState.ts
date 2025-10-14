// hooks/auth/useAuthState.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import { useEffect, useRef } from "react";

export const useAuthState = () => {
  const queryClient = useQueryClient();
  const authListenerSet = useRef(false);

  // Query para obtener el usuario actual
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["auth", "user"],
    queryFn: async (): Promise<User | null> => {
      console.log("useAuthState: Obteniendo sesión...");
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Error obteniendo sesión:", error);
        throw error;
      }

      console.log("useAuthState: Sesión obtenida", session?.user?.email);
      return session?.user || null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });

  // Escuchar cambios de autenticación
  useEffect(() => {
    // Evitar múltiples listeners
    if (authListenerSet.current) {
      return;
    }

    authListenerSet.current = true;
    console.log("🎧 Configurando listener de auth (solo una vez)...");

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔐 Auth state changed:", event);

      // Actualizar el cache de React Query
      queryClient.setQueryData(["auth", "user"], session?.user || null);

      // Invalidar queries dependientes del usuario
      if (
        event === "SIGNED_IN" ||
        event === "SIGNED_OUT" ||
        event === "USER_UPDATED"
      ) {
        console.log("🔄 Invalidando queries dependientes...");
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        queryClient.invalidateQueries({ queryKey: ["favorites"] });
      }
    });

    return () => {
      console.log("🧹 Limpiando listener de auth...");
      subscription.unsubscribe();
      authListenerSet.current = false; // Permitir nuevo listener si se desmonta
    };
  }, [queryClient]);

  return {
    user: user || null,
    isLoading,
    error,
  };
};
