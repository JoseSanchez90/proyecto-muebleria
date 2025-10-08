import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User, Session } from "@supabase/supabase-js";

// Tipado extendido para el registro con datos adicionales
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Función para cargar el perfil del usuario
    const loadUserProfile = async (userId: string) => {
      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("name, last_name, avatar_url") // ← AGREGAR avatar_url aquí
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Error loading profile:", error);
          return null;
        }
        return profile;
      } catch (error) {
        console.error("Error in loadUserProfile:", error);
        return null;
      }
    };
    
    // Función para establecer el usuario con su perfil
    const setUserWithProfile = async (session: Session | null) => {
      if (session?.user) {
        const profile = await loadUserProfile(session.user.id);
        const userWithMetadata = {
          ...session.user,
          user_metadata: {
            ...session.user.user_metadata,
            ...(profile || {}),
          },
        };
        setUser(userWithMetadata);
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    // 1. Obtener sesión inicial
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
          setLoading(false);
          return;
        }

        console.log("Initial session:", session);
        await setUserWithProfile(session);
      } catch (error) {
        console.error("Error in initializeAuth:", error);
        setLoading(false);
      }
    };

    initializeAuth();

    // 2. Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);

      // Solo procesar si el componente está montado
      if (!mounted) return;

      await setUserWithProfile(session);
    });

    return () => {
      subscription.unsubscribe();
      setMounted(false);
    };
  }, [mounted]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // La sesión se establecerá automáticamente via onAuthStateChange
      return { error: null };
    } catch (error) {
      console.error("Sign in error:", error);
      return { error: error as Error };
    } finally {
      setLoading(false);
    }
  };

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

      // Insertar el perfil adicional
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
      });

      if (insertError) {
        console.error("Error al guardar el perfil:", insertError);
        // No hagas logout aquí, deja que el usuario permanezca logueado
        return { error: insertError };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Evitar renderizado hasta que esté montado
  if (!mounted) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
