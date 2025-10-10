// hooks/cart/useCart.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/Authentication/authContext";

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  // Datos del producto (joins)
  products: {
    id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen_url: string;
    categoria: string;
    stock: number;
  };
}

export const useCart = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // ✅ OBTENER CARRITO - CON ORDEN CONSISTENTE
  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ["cart", user?.id],
    queryFn: async (): Promise<CartItem[]> => {
      if (!user?.id) return [];

      console.log("🛒 Cargando carrito para usuario:", user.id);

      const { data, error } = await supabase
        .from("cart_items")
        .select(
          `
          *,
          products:product_id (
            id,
            nombre,
            descripcion,
            precio,
            imagen_url,
            categoria,
            stock
          )
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: true }); // ✅ ORDEN CONSISTENTE

      if (error) {
        console.error("❌ Error cargando carrito:", error);
        throw error;
      }

      console.log("✅ Carrito cargado:", data?.length || 0, "items");
      return (data as CartItem[]) || [];
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });

  // ✅ AGREGAR AL CARRITO - CON ACTUALIZACIÓN OPTIMISTA
  const addToCartMutation = useMutation({
    mutationFn: async (product: {
      id: string;
      nombre: string;
      descripcion: string;
      precio: number;
      imagen_url: string;
      categoria: string;
      stock: number;
    }) => {
      if (!user?.id) throw new Error("Usuario no autenticado");

      console.log("➕ Agregando/incrementando producto:", product.id);

      // Obtener cantidad actual
      const { data: currentItems, error: checkError } = await supabase
        .from("cart_items")
        .select("quantity")
        .eq("user_id", user.id)
        .eq("product_id", product.id);

      if (checkError) {
        console.error("❌ Error verificando cantidad actual:", checkError);
        throw checkError;
      }

      const currentQuantity = currentItems?.[0]?.quantity || 0;
      const newQuantity = currentQuantity + 1;

      console.log(`🔄 Cantidad actual: ${currentQuantity}, nueva: ${newQuantity}`);

      // Upsert con la nueva cantidad
      const { data, error } = await supabase
        .from("cart_items")
        .upsert(
          {
            user_id: user.id,
            product_id: product.id,
            quantity: newQuantity,
          },
          {
            onConflict: "user_id,product_id",
          }
        )
        .select(
          `
          *,
          products:product_id (
            id,
            nombre,
            descripcion,
            precio,
            imagen_url,
            categoria,
            stock
          )
        `
        )
        .single();

      if (error) {
        console.error("❌ Error en upsert:", error);
        throw error;
      }

      console.log("✅ Producto agregado/actualizado:", data);
      return { action: 'upsert', data: data as CartItem, productId: product.id, newQuantity };
    },
    onMutate: async (product) => {
      // Cancelar queries en progreso
      await queryClient.cancelQueries({ queryKey: ['cart', user?.id] });

      // Snapshot del estado anterior
      const previousCart = queryClient.getQueryData(['cart', user?.id]);

      // Actualización optimista
      queryClient.setQueryData(['cart', user?.id], (old: CartItem[] | undefined) => {
        if (!old) return old;

        const existingItemIndex = old.findIndex(item => item.product_id === product.id);

        if (existingItemIndex >= 0) {
          // Incrementar cantidad si ya existe
          return old.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          // Agregar nuevo item al final
          const newItem: CartItem = {
            id: `temp-${Date.now()}`,
            product_id: product.id,
            quantity: 1,
            created_at: new Date().toISOString(),
            products: product
          };
          return [...old, newItem];
        }
      });

      return { previousCart };
    },
    onError: (error, _variables, context) => {
      // Revertir en caso de error
      if (context?.previousCart) {
        queryClient.setQueryData(['cart', user?.id], context.previousCart);
      }
      console.error("❌ Error en addToCart mutation:", error);
    },
    onSettled: () => {
      // Sincronizar con el servidor
      queryClient.invalidateQueries({ queryKey: ["cart", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["cart-count", user?.id] });
    },
  });

  // ✅ ACTUALIZAR CANTIDAD - CON ACTUALIZACIÓN OPTIMISTA
  const updateQuantityMutation = useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => {
      if (!user?.id) throw new Error("Usuario no autenticado");

      if (quantity <= 0) {
        // Eliminar si cantidad es 0
        const { error } = await supabase
          .from("cart_items")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productId);

        if (error) throw error;
        return { action: 'delete', productId };
      } else {
        // Actualizar cantidad
        const { data, error } = await supabase
          .from("cart_items")
          .update({ quantity })
          .eq("user_id", user.id)
          .eq("product_id", productId)
          .select(
            `
            *,
            products:product_id (
              id,
              nombre,
              descripcion,
              precio,
              imagen_url,
              categoria,
              stock
            )
          `
          )
          .single();

        if (error) throw error;
        return { action: 'update', data: data as CartItem, productId, quantity };
      }
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['cart', user?.id] });
      const previousCart = queryClient.getQueryData(['cart', user?.id]);

      // Actualización optimista
      queryClient.setQueryData(['cart', user?.id], (old: CartItem[] | undefined) => {
        if (!old) return old;

        if (variables.quantity <= 0) {
          // Eliminar item
          return old.filter(item => item.product_id !== variables.productId);
        } else {
          // Actualizar cantidad manteniendo la posición
          return old.map(item =>
            item.product_id === variables.productId
              ? { ...item, quantity: variables.quantity }
              : item
          );
        }
      });

      return { previousCart };
    },
    onError: (error, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(['cart', user?.id], context.previousCart);
      }
      console.error("❌ Error actualizando cantidad:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["cart-count", user?.id] });
    },
  });

  // ✅ ELIMINAR DEL CARRITO - CON ACTUALIZACIÓN OPTIMISTA
  const removeFromCartMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!user?.id) throw new Error("Usuario no autenticado");

      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);

      if (error) throw error;
      return { action: 'delete', productId };
    },
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ['cart', user?.id] });
      const previousCart = queryClient.getQueryData(['cart', user?.id]);

      queryClient.setQueryData(['cart', user?.id], (old: CartItem[] | undefined) => {
        if (!old) return old;
        return old.filter(item => item.product_id !== productId);
      });

      return { previousCart };
    },
    onError: (error, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(['cart', user?.id], context.previousCart);
      }
      console.error("❌ Error eliminando del carrito:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["cart-count", user?.id] });
    },
  });

  // ✅ VACIAR CARRITO
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("Usuario no autenticado");

      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['cart', user?.id] });
      const previousCart = queryClient.getQueryData(['cart', user?.id]);

      queryClient.setQueryData(['cart', user?.id], []);

      return { previousCart };
    },
    onError: (error, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(['cart', user?.id], context.previousCart);
      }
      console.error("❌ Error vaciando carrito:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["cart-count", user?.id] });
    },
  });

  // ✅ CÁLCULOS DERIVADOS
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.products?.precio || 0) * item.quantity,
    0
  );

  return {
    // Datos
    items: cartItems,
    isLoading,

    // Acciones
    addToCart: addToCartMutation.mutate,
    updateQuantity: updateQuantityMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    clearCart: clearCartMutation.mutate,

    // Estados de carga
    isAdding: addToCartMutation.isPending,
    isUpdating: updateQuantityMutation.isPending,
    isRemoving: removeFromCartMutation.isPending,
    isClearing: clearCartMutation.isPending,

    // Totales
    totalItems,
    totalPrice,

    // Errores
    error:
      addToCartMutation.error ||
      updateQuantityMutation.error ||
      removeFromCartMutation.error,
  };
};