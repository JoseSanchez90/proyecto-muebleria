// hooks/cart/useCartCount.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/components/Authentication/authContext';

export const useCartCount = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['cart-count', user?.id],
    queryFn: async (): Promise<number> => {
      if (!user?.id) return 0;

      const { data, error } = await supabase
        .from('cart_items')
        .select('quantity')
        .eq('user_id', user.id);

      if (error) throw error;
      return data?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutos para el contador
    refetchOnWindowFocus: true, // Refrescar cuando el usuario vuelve a la pestaña
  });
};