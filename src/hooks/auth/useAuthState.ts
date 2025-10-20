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

  // Escuchar cambios de autenticación - SOLO UNA VEZ GLOBALMENTE
  useEffect(() => {
    if (globalAuthListenerSet) {
      console.log("Listener global ya está configurado, omitiendo...");
      return;
    }

    globalAuthListenerSet = true;
    authListenerSet.current = true;
    
    console.log("Configurando listener GLOBAL de auth...");

    // Configurar el listener una sola vez - SIN guardar la referencia
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);

      // Usar setQueryData de manera más eficiente
      queryClient.setQueryData(["auth", "user"], session?.user || null);

      // Invalidar queries dependientes SOLO cuando sea necesario
      if (event === "SIGNED_OUT") {
        console.log("Invalidando queries por SIGNED_OUT");
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["cart"] }),
          queryClient.invalidateQueries({ queryKey: ["profile"] }),
          queryClient.invalidateQueries({ queryKey: ["favorites"] }),
        ]);
        // Limpiar cache específico
        queryClient.removeQueries({ queryKey: ["cart"] });
        queryClient.removeQueries({ queryKey: ["profile"] });
      } 
      else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        console.log("Actualizando queries por:", event);
        // Para SIGNED_IN, las queries se actualizarán naturalmente
        // No es necesario invalidar inmediatamente
      }
    });

    return () => {
      // Solo limpiar si este es el componente que creó el listener
      if (authListenerSet.current) {
        console.log("Componente principal con useAuthState desmontado");
        // Pero mantenemos el listener global activo para toda la app
      }
    };
  }, [queryClient]);

  return {
    user: user || null,
    isLoading,
    error,
  };
};