// hooks/auth/useAuth.ts
import { useAuthState } from '@/hooks/auth/useAuthState';
import { useAuthActions } from '@/hooks/auth/useAuthActions';

// Hook combinado para mantener compatibilidad con tu código existente
export const useAuth = () => {
  const { user, isLoading } = useAuthState();
  const { 
    signIn, 
    signOut, 
    signUp,
    isSigningIn, 
    isSigningOut,
    isSigningUp,
    signInError,
    signUpError,
    resetSignUp,
    resetSignIn
  } = useAuthActions();

  // Mantener la misma interfaz que tu AuthContext original
  return {
    // Estado (igual que antes)
    user,
    loading: isLoading,
    isAuthenticated: !!user,
    
    // Acciones (igual que antes)
    signIn: async (email: string, password: string) => {
      try {
        await signIn({ email, password });
        return { error: null };
      } catch (error) {
        return { error };
      }
    },
    signOut: async () => {
      await signOut();
    },
    
    // Acciones adicionales de tu useAuthActions
    signUp,
    isSigningUp,
    signUpError,
    resetSignUp,
    
    // Estados adicionales útiles
    isSigningIn,
    isSigningOut,
    signInError,
    resetSignIn,
  };
};