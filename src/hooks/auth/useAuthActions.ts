// hooks/auth/useAuthActions.ts
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';

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

export const useAuthActions = () => {
  // ✅ SIGN UP MUTATION
  const signUpMutation = useMutation({
    mutationFn: async (formData: SignUpFormData) => {
      console.log('🔄 Iniciando registro...', {
        email: formData.email,
        name: formData.name
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
        console.error('❌ Error en auth.signUp:', authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error('No se pudo crear el usuario');
      }

      console.log('✅ Usuario auth creado:', authData.user.id);

      // 2. Crear perfil en la tabla profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
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
        console.error('❌ Error creando perfil:', profileError);
        
        // Si falla crear el perfil, eliminar el usuario auth
        await supabase.auth.admin.deleteUser(authData.user.id);
        
        throw profileError;
      }

      console.log('✅ Perfil creado exitosamente');
      return authData;
    },
    onSuccess: () => {
      toast.success('¡Cuenta creada exitosamente! Revisa tu email para verificar tu cuenta.');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error('❌ Error en signUp mutation:', error);
      
      let errorMessage = 'Error al crear la cuenta';
      
      if (error.message.includes('Email rate limit exceeded')) {
        errorMessage = 'Demasiados intentos. Por favor, espera unos minutos.';
      } else if (error.message.includes('User already registered')) {
        errorMessage = 'Este email ya está registrado.';
      } else if (error.message.includes('Password should be at least')) {
        errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      } else if (error.message.includes('Invalid email')) {
        errorMessage = 'El formato del email no es válido.';
      }
      
      toast.error(errorMessage);
    },
  });

  // ✅ SIGN IN MUTATION (por si también lo necesitas)
  const signInMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast('¡Bienvenido a Munfort!', {
        icon: "👋"
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      let errorMessage = 'Error al iniciar sesión';
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Email o contraseña incorrectos.';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Por favor, verifica tu email antes de iniciar sesión.';
      }
      
      toast.error(errorMessage);
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
    
    // Reset mutations
    resetSignUp: signUpMutation.reset,
    resetSignIn: signInMutation.reset,
  };
};