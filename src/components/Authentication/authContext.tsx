import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User, Session } from "@supabase/supabase-js";
import Loader from "../common/loader";

interface SignUpFormData {
  name: string;
  lastName: string;
  email: string;
  dni: string;
  phone: string;
  birthdate: string;
  address: string;
  reference: string;
  department: string;
  province: string;
  district: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (formData: SignUpFormData) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🧠 Carga del perfil desde la tabla profiles
  const loadUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("name, last_name, avatar_url")
        .eq("id", userId)
        .single();

      if (error) {
        console.warn("No se pudo cargar perfil:", error);
        return null;
      }
      return profile;
    } catch (err) {
      console.error("Error en loadUserProfile:", err);
      return null;
    }
  };

  // 🧩 Combina la sesión de Supabase con los datos del perfil
  const setUserWithProfile = async (session: Session | null) => {
    if (session?.user) {
      const profile = await loadUserProfile(session.user.id);
      const userWithProfile = {
        ...session.user,
        user_metadata: {
          ...session.user.user_metadata,
          ...(profile || {}),
        },
      };
      setUser(userWithProfile as User);
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) console.error("Error al obtener sesión:", error);

        const session = data.session;
        await setUserWithProfile(session);

        // 🔁 Escuchar cambios de autenticación
        const { data: listener } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log("Auth state changed:", event);
            await setUserWithProfile(session);
          }
        );

        // 🕒 pequeña espera para sincronizar cookie y sesión (evita "logout fantasma")
        await new Promise((r) => setTimeout(r, 250));

        setLoading(false);

        return () => {
          listener.subscription.unsubscribe();
        };
      } catch (err) {
        console.error("Error inicializando AuthProvider:", err);
        setLoading(false);
      }
    };

    initAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔑 Iniciar sesión
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error: error ?? null };
    } catch (err) {
      return { error: err as Error };
    } finally {
      setLoading(false);
    }
  };

  // 🧾 Registro
  const signUp = async (formData: SignUpFormData) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            last_name: formData.lastName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error || !data.user) {
        return { error: error ?? new Error("No se pudo crear el usuario") };
      }

      // Inserta el perfil adicional
      const { error: insertError } = await supabase.from("profiles").insert({
        id: data.user.id,
        name: formData.name,
        last_name: formData.lastName,
        dni: formData.dni,
        phone: formData.phone,
        birthdate: formData.birthdate,
        address: formData.address,
        reference: formData.reference,
        department: formData.department,
        province: formData.province,
        district: formData.district,
        avatar_url: null,
      });

      if (insertError) {
        console.error("Error guardando perfil:", insertError);
        return { error: insertError };
      }

      return { error: null };
    } catch (err) {
      return { error: err as Error };
    } finally {
      setLoading(false);
    }
  };

  // 🚪 Cerrar sesión
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (err) {
      console.error("Error cerrando sesión:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🧭 Evita renderizar la app antes de tener sesión lista
  if (loading) {
    return <Loader />; // puedes usar tu <Loader /> aquí
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
}
