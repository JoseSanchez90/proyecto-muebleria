// hooks/useOrders.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

export interface Order {
  id: string;
  created_at: string;
  total: number;
  status: string;
  items_count: number;
}

export const useOrders = (userId: string | undefined) => {
  return useQuery<Order[]>({ // ✅ Tipo genérico
    queryKey: ['orders', userId],
    queryFn: async () => {
      if (!userId) throw new Error('No user ID');
      
      console.log('🔄 useOrders: Cargando pedidos para', userId);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ useOrders: Error cargando pedidos', error);
        throw error;
      }
      
      console.log('✅ useOrders: Pedidos cargados:', data?.length || 0);
      return data || [];
    },
    enabled: !!userId,
  });
};