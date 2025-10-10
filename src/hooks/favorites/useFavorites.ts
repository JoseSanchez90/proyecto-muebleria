// hooks/favorites/useFavorites.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/components/Authentication/authContext';
import toast from 'react-hot-toast';

export const useFavorites = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // ✅ OBTENER FAVORITOS
  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async (): Promise<string[]> => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('favoritos')
        .select('product_id')
        .eq('user_id', user.id);

      if (error) throw error;
      return data?.map(item => item.product_id) || [];
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // ✅ AGREGAR FAVORITO
  const addFavoriteMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!user?.id) throw new Error('Usuario no autenticado');

      const { error } = await supabase
        .from('favoritos')
        .insert({ user_id: user.id, product_id: productId });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
    },
    onError: (error) => {
      console.error('Error agregando favorito:', error);
      toast.error('Error al agregar favorito');
    },
  });

  // ✅ ELIMINAR FAVORITO
  const removeFavoriteMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!user?.id) throw new Error('Usuario no autenticado');

      const { error } = await supabase
        .from('favoritos')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
    },
    onError: (error) => {
      console.error('Error eliminando favorito:', error);
      toast.error('Error al eliminar favorito');
    },
  });

  // ✅ ALTERNAR FAVORITO
  const toggleFavoriteMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!user?.id) throw new Error('Usuario no autenticado');

      const isCurrentlyFavorite = favorites.includes(productId);

      if (isCurrentlyFavorite) {
        // Eliminar favorito
        const { error } = await supabase
          .from('favoritos')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);

        if (error) throw error;
        return 'removed';
      } else {
        // Agregar favorito
        const { error } = await supabase
          .from('favoritos')
          .insert({ user_id: user.id, product_id: productId });

        if (error) throw error;
        return 'added';
      }
    },
    onSuccess: (action) => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
      
      if (action === 'added') {
        toast.success('Producto agregado a favoritos');
      } else {
        toast.success('Producto removido de favoritos');
      }
    },
    onError: (error) => {
      console.error('Error al alternar favorito:', error);
      toast.error('Error al actualizar favoritos');
    },
  });

  // ✅ VERIFICAR SI ES FAVORITO
  const isFavorite = (productId: string) => {
    return favorites.includes(productId);
  };

  return {
    // Datos
    favorites,
    isLoading,
    
    // Acciones
    addFavorite: addFavoriteMutation.mutate,
    removeFavorite: removeFavoriteMutation.mutate,
    toggleFavorite: toggleFavoriteMutation.mutate,
    
    // Estados de carga
    isAdding: addFavoriteMutation.isPending,
    isRemoving: removeFavoriteMutation.isPending,
    isToggling: toggleFavoriteMutation.isPending,
    
    // Utilidades
    isFavorite,
    
    // Errores
    error: addFavoriteMutation.error || removeFavoriteMutation.error || toggleFavoriteMutation.error,
  };
};