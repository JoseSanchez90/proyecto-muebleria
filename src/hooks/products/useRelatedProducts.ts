import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
  categoria: string;
  stock: number;
}

export const useRelatedProducts = (category: string | undefined, excludeId: string | undefined) => {
  return useQuery<Producto[]>({
    queryKey: ['related-products', category, excludeId],
    queryFn: async (): Promise<Producto[]> => {
      if (!category) return [];

      let query = supabase
        .from('productos')
        .select('*')
        .eq('categoria', category)
        .limit(4);

      if (excludeId) {
        query = query.neq('id', excludeId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
    enabled: !!category,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};