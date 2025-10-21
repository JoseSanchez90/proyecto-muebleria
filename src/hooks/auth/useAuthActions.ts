// hooks/auth/useAuthActions.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";

interface SignUpFormData {
  name: string;
  lastName: string;
  email: string;
  dni: string;
  phone: string;
  birthdate?: string;
  address?: string;
  reference?: string;
  department?: string;
  province?: string;
  district?: string;
  password: string;
}

export const useAuthActions = () => {
  const queryClient = useQueryClient();

  // SIGN UP MUTATION
  const signUpMutation = useMutation({
    mutationFn: async (formData: SignUpFormData) => {
      console.log("Iniciando registro...", {
        email: formData.email,
        name: formData.name,
      });

      // 1. Crear usuario en Auth de Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
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

      if (authError) {
        console.error("Error en auth.signUp:", authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error("No se pudo crear el usuario");
      }

      console.log("Usuario auth creado:", authData.user.id);

      // 2. Crear perfil en la tabla profiles
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
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

      if (profileError) {
        console.error("Error creando perfil:", profileError);
        // Si falla crear el perfil, eliminar el usuario auth
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw profileError;
      }
      console.log("Perfil creado exitosamente");

      // Invalidar la query del perfil para forzar recarga
      queryClient.invalidateQueries({
        queryKey: ["profile", authData.user.id],
      });
      console.log("Query de perfil invalidada para recarga");

      return authData;
    },
    onSuccess: () => {
      toast.success(
        "¡Cuenta creada exitosamente! Revisa tu email para verificar tu cuenta."
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error("Error en signUp mutation:", error);

      let errorMessage = "Error al crear la cuenta";

      if (error.message.includes("Email rate limit exceeded")) {
        errorMessage = "Demasiados intentos. Por favor, espera unos minutos.";
      } else if (error.message.includes("User already registered")) {
        errorMessage = "Este email ya está registrado.";
      } else if (error.message.includes("Password should be at least")) {
        errorMessage = "La contraseña debe tener al menos 6 caracteres.";
      } else if (error.message.includes("Invalid email")) {
        errorMessage = "El formato del email no es válido.";
      }

      toast.error(errorMessage);
    },
  });

  // SIGN IN MUTATION - ACTUALIZADA CON NOMBRE PERSONALIZADO
  const signInMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: async (data) => {
      console.log("✅ Login exitoso, forzando actualización...");

      // FORZAR ACTUALIZACIÓN DEL CACHE DEL USUARIO
      queryClient.setQueryData(["auth", "user"], data.user);

      // SOLO invalidar cart - las otras queries se actualizarán automáticamente
      await queryClient.invalidateQueries({ queryKey: ["cart"] });

      // Obtener nombre del usuario de los metadatos
      const userName =
        data.user?.user_metadata?.name ||
        data.user?.email?.split("@")[0] ||
        "Usuario";

      toast(`¡Bienvenido ${userName}!`, {
        icon: "😄",
        style: {
          background: "#FF9340",
          color: "#fff",
          fontWeight: "bold",
        },
      });
    },
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      let errorMessage = "Error al iniciar sesión";

      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Email o contraseña incorrectos.";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Por favor, verifica tu email antes de iniciar sesión.";
      }

      toast.error(errorMessage);
    },
    retry: false,
  });

  // SIGN OUT MUTATION - VERSIÓN MEJORADA
  const signOutMutation = useMutation({
    mutationFn: async () => {
      console.log("🚪 Ejecutando signOut en Supabase...");
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Error en supabase.auth.signOut:", error);
        throw error;
      }

      console.log("SignOut ejecutado correctamente en Supabase");
      return true;
    },
    onSuccess: async () => {
      console.log("Limpiando cache después del signOut...");

      // 1. PRIMERO limpiar el cache local
      queryClient.setQueryData(["auth", "user"], null);

      // 2. LUEGO invalidar las queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["auth", "user"] }),
        queryClient.invalidateQueries({ queryKey: ["cart"] }),
        queryClient.invalidateQueries({ queryKey: ["profile"] }),
        queryClient.invalidateQueries({ queryKey: ["favorites"] }),
      ]);

      // 3. Remover queries específicas para forzar recarga completa
      queryClient.removeQueries({ queryKey: ["cart"] });
      queryClient.removeQueries({ queryKey: ["profile"] });

      console.log("Cache limpiado exitosamente después del signOut");

      toast(`¡Nos vemos pronto!`, {
        icon: "😊",
        style: {
          background: "#FF7000",
          color: "#fff",
          fontWeight: "bold",
        },
      });
    },
    onError: (error) => {
      console.error("Error en signOut mutation:", error);

      // Forzar limpieza incluso si hay error
      queryClient.setQueryData(["auth", "user"], null);
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });

      toast.error("Error al cerrar sesión, pero se limpió el estado local");
    },
  });

  return {
    // Sign Up
    signUp: signUpMutation.mutate,
    isSigningUp: signUpMutation.isPending,
    signUpError: signUpMutation.error,

    // Sign In
    signIn: signInMutation.mutate,
    isSigningIn: signInMutation.isPending,
    signInError: signInMutation.error,

    // Sign Out - NUEVO
    signOut: signOutMutation.mutate,
    isSigningOut: signOutMutation.isPending,
    signOutError: signOutMutation.error,

    // Reset mutations
    resetSignUp: signUpMutation.reset,
    resetSignIn: signInMutation.reset,
    resetSignOut: signOutMutation.reset,
  };
};
