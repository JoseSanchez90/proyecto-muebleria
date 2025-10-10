
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

export interface UserProfile {
  id: string;
  name: string;
  last_name: string;
  email?: string;
  phone: string;
  dni: string;
  birthdate: string;
  address: string;
  reference: string;
  department: string;
  province: string;
  district: string;
  avatar_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export const useProfile = (userId: string | undefined) => {
  return useQuery<UserProfile | null>({
    queryKey: ['profile', userId], 
    queryFn: async (): Promise<UserProfile | null> => {
      // ✅ Early return más estricto
      if (!userId || userId === 'undefined') {
        console.log('🟡 useProfile: No userId válido');
        return null;
      }

      console.log('🟡 useProfile: Ejecutando query para:', userId);
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('🔴 useProfile - Error Supabase:', error);
          // ✅ No lanzar error para usuarios no encontrados, retornar null
          if (error.code === 'PGRST116') { // No encontrado
            return null;
          }
          throw error;
        }

        console.log('🟢 useProfile - Datos obtenidos:', data);
        return data;
      } catch (error) {
        console.error('🔴 useProfile - Error general:', error);
        throw error;
      }
    },
    enabled: !!userId && userId !== 'undefined', // ✅ Condición más estricta
    staleTime: 10 * 60 * 1000, // 10 minutos
    retry: 1,
    refetchOnWindowFocus: false, // ✅ Evitar refetch automático
  });
};