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
  mas_vendido?: boolean;
  nuevo?: boolean;
}

export const useProductDetail = (productId: string | undefined) => {
  return useQuery<Producto | null>({
    queryKey: ['product', productId],
    queryFn: async (): Promise<Producto | null> => {
      if (!productId) return null;

      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // No encontrado
        throw error;
      }

      return data;
    },
    enabled: !!productId,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};