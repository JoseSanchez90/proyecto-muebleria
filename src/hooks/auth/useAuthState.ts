// hooks/auth/useAuthState.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import { useEffect, useRef } from "react";

// Variables globales para controlar el listener
let globalAuthListenerSet = false;

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
    staleTime: 5 * 60 * 1000, // Aumentar a 5 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
    refetchOnWindowFocus: false, // Evitar refetch al cambiar de pestaña
  });

  // ESCUCHAR CAMBIOS DE AUTENTICACIÓN - SOLO UNA VEZ GLOBALMENTE
  useEffect(() => {
    if (globalAuthListenerSet) {
      console.log("Listener global ya está configurado, omitiendo...");
      return;
    }

    globalAuthListenerSet = true;
    authListenerSet.current = true;

    console.log("Configurando listener GLOBAL de auth...");

    // CONFIGURAR EL LISTENER UNA SOLA VEZ
    supabase.auth.onAuthStateChange(async (event) => {
      console.log("Auth state changed:", event);

      // USAR setQueryData DE MANERA MÁS EFICIENTE
      // queryClient.setQueryData(["auth", "user"], session?.user || null);

      // INVALIDAR QUERIES DEPENDIENTES SOLO CUANDO SEA NECESARIO
      if (event === "SIGNED_OUT") {
        console.log("Invalidando queries por SIGNED_OUT");
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["cart"] }),
          queryClient.invalidateQueries({ queryKey: ["profile"] }),
          queryClient.invalidateQueries({ queryKey: ["favorites"] }),
        ]);
        // LIMPIAR CACHE ESPECÍFICO
        queryClient.removeQueries({ queryKey: ["cart"] });
        queryClient.removeQueries({ queryKey: ["profile"] });
      }
      // SE ELIMINO COMPLETAMENTE EL BLOQUE ELSE IF PARA SIGNED_IN
      // Las queries se actualizarán naturalmente a través de useCart
    });

    // return () => {
    //   // SOLO LIMPIAR SI ESTE ES EL COMPONENTE QUE CREÓ EL LISTENER
    //   if (authListenerSet.current) {
    //     console.log("Componente principal con useAuthState desmontado");
    //     // PERO MANTENEMOS EL LISTENER GLOBAL ACTIVO PARA TODA LA APP
    //   }
    // };
  }, [queryClient]);

  return {
    user: user || null,
    isLoading,
    error,
  };
};
