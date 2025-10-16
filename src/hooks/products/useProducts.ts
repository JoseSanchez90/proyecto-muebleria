// hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image: string;
  category?: string;
  mas_vendido: boolean;
  lo_ultimo: boolean;
  nuevo: boolean;
  stock: number;
  created_at: string;
}

export const useProducts = () => {
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      
      // Mapear los datos según tu estructura real
      return data?.map(item => ({
        id: item.id,
        name: item.nombre, // ← importante: tu columna se llama "nombre"
        description: item.descripcion,
        price: Number(item.precio), // Convertir a número
        image: item.imagen_url, // ← importante: tu columna se llama "imagen_url"
        category: item.categoria,
        mas_vendido: item.mas_vendido,
        lo_ultimo: item.lo_ultimo,
        nuevo: item.nuevo,
        stock: item.stock,
        created_at: item.created_at
      })) || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    products,
    isLoading,
    error
  };
};