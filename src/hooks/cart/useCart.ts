// hooks/cart/useCart.ts
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/Authentication/authContext";

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  created_at: string;
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

// ✅ TIPO PARA CARRITO LOCAL
interface LocalCartItem {
  product_id: string;
  quantity: number;
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
  
  // ✅ ESTADO PARA CARRITO LOCAL
  const [localCart, setLocalCart] = useState<LocalCartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('localCart');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // ✅ SINCRONIZAR CARRITO LOCAL CON USUARIO AL LOGEARSE
  useEffect(() => {
    if (user?.id && localCart.length > 0) {
      console.log('🔄 Sincronizando carrito local con usuario...', localCart);
      syncLocalCartWithUser();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // Solo cuando el usuario cambia de null a logueado

  // ✅ PERSISTIR CARRITO LOCAL EN localStorage
  useEffect(() => {
    localStorage.setItem('localCart', JSON.stringify(localCart));
  }, [localCart]);

  // ✅ FUNCIÓN PARA SINCRONIZAR CARRITO LOCAL CON SUPABASE
  const syncLocalCartWithUser = async () => {
    try {
      console.log('🔄 Iniciando sincronización de carrito local...');
      
      for (const localItem of localCart) {
        // Verificar si ya existe en el carrito del usuario
        const { data: existingItem } = await supabase
          .from('cart_items')
          .select('quantity')
          .eq('user_id', user!.id)
          .eq('product_id', localItem.product_id)
          .single();

        if (existingItem) {
          // Sumar cantidades
          const newQuantity = existingItem.quantity + localItem.quantity;
          await supabase
            .from('cart_items')
            .update({ quantity: newQuantity })
            .eq('user_id', user!.id)
            .eq('product_id', localItem.product_id);
          console.log(`✅ Producto ${localItem.product_id} actualizado: ${newQuantity}`);
        } else {
          // Crear nuevo item
          await supabase
            .from('cart_items')
            .insert({
              user_id: user!.id,
              product_id: localItem.product_id,
              quantity: localItem.quantity,
            });
          console.log(`✅ Producto ${localItem.product_id} agregado: ${localItem.quantity}`);
        }
      }
      
      // Limpiar carrito local después de sincronizar
      setLocalCart([]);
      console.log('✅ Carrito local sincronizado y limpiado');
      
      // Invalidar queries para refrescar
      queryClient.invalidateQueries({ queryKey: ["cart", user!.id] });
      
    } catch (error) {
      console.error('❌ Error sincronizando carrito:', error);
    }
  };

  // ✅ OBTENER CARRITO DEL USUARIO (si está logueado)
  const { data: userCart = [], isLoading } = useQuery({
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
        .order("created_at", { ascending: true });

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

  // ✅ AGREGAR AL CARRITO - HÍBRIDO (local + usuario)
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
      console.log("➕ Agregando/incrementando producto:", product.id);
      console.log("👤 Usuario:", user ? "logueado" : "no logueado");

      // ✅ SI EL USUARIO ESTÁ LOGUEADO - Guardar en Supabase
      if (user?.id) {
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

        console.log("✅ Producto agregado/actualizado en Supabase:", data);
        return { 
          type: 'user', 
          action: 'upsert', 
          data: data as CartItem, 
          productId: product.id, 
          newQuantity 
        };

      } else {
        // ✅ SI EL USUARIO NO ESTÁ LOGUEADO - Guardar en localStorage
        const existingItemIndex = localCart.findIndex(
          item => item.product_id === product.id
        );

        let updatedCart: LocalCartItem[];
        if (existingItemIndex >= 0) {
          updatedCart = localCart.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
          console.log(`🔄 Producto existente en carrito local, nueva cantidad: ${updatedCart[existingItemIndex].quantity}`);
        } else {
          const newItem: LocalCartItem = {
            product_id: product.id,
            quantity: 1,
            products: product
          };
          updatedCart = [...localCart, newItem];
          console.log("🆕 Nuevo producto agregado al carrito local");
        }

        setLocalCart(updatedCart);
        return { 
          type: 'local', 
          action: 'upsert', 
          data: updatedCart,
          productId: product.id
        };
      }
    },
    onMutate: async (product) => {
      // ✅ ACTUALIZACIÓN OPTIMISTA PARA AMBOS CASOS
      if (user?.id) {
        // Para usuario logueado - actualizar cache de React Query
        await queryClient.cancelQueries({ queryKey: ['cart', user.id] });
        const previousCart = queryClient.getQueryData(['cart', user.id]);

        queryClient.setQueryData(['cart', user.id], (old: CartItem[] | undefined) => {
          if (!old) return old;

          const existingItemIndex = old.findIndex(item => item.product_id === product.id);

          if (existingItemIndex >= 0) {
            return old.map((item, index) =>
              index === existingItemIndex
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
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

        return { previousCart, type: 'user' };
      } else {
        // Para usuario no logueado - el estado local ya se actualiza en mutationFn
        return { type: 'local' };
      }
    },
    onError: (error, _variables, context) => {
      // ✅ REVERTIR EN CASO DE ERROR (solo para usuario logueado)
      if (context?.type === 'user' && context.previousCart) {
        queryClient.setQueryData(['cart', user?.id], context.previousCart);
      }
      console.error("❌ Error en addToCart mutation:", error);
    },
    onSettled: () => {
      // ✅ SINCRONIZAR CON EL SERVIDOR (solo para usuario logueado)
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ["cart", user.id] });
      }
      // Para 'local' no necesita invalidar, ya que se actualiza el estado local
    },
  });

  // ✅ ACTUALIZAR CANTIDAD - HÍBRIDO
  const updateQuantityMutation = useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => {
      if (user?.id) {
        // Usuario logueado - Supabase
        if (quantity <= 0) {
          const { error } = await supabase
            .from("cart_items")
            .delete()
            .eq("user_id", user.id)
            .eq("product_id", productId);
          if (error) throw error;
          return { type: 'user', action: 'delete', productId };
        } else {
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
          return { type: 'user', action: 'update', data: data as CartItem, productId, quantity };
        }
      } else {
        // Usuario no logueado - localStorage
        if (quantity <= 0) {
          const updatedCart = localCart.filter(item => item.product_id !== productId);
          setLocalCart(updatedCart);
          return { type: 'local', action: 'delete', productId };
        } else {
          const updatedCart = localCart.map(item =>
            item.product_id === productId
              ? { ...item, quantity }
              : item
          );
          setLocalCart(updatedCart);
          return { type: 'local', action: 'update', productId, quantity };
        }
      }
    },
    onMutate: async (variables) => {
      if (user?.id) {
        await queryClient.cancelQueries({ queryKey: ['cart', user.id] });
        const previousCart = queryClient.getQueryData(['cart', user.id]);

        queryClient.setQueryData(['cart', user.id], (old: CartItem[] | undefined) => {
          if (!old) return old;
          if (variables.quantity <= 0) {
            return old.filter(item => item.product_id !== variables.productId);
          } else {
            return old.map(item =>
              item.product_id === variables.productId
                ? { ...item, quantity: variables.quantity }
                : item
            );
          }
        });

        return { previousCart, type: 'user' };
      } else {
        // Para local, ya se maneja en mutationFn
        return { type: 'local' };
      }
    },
    onError: (error, _variables, context) => {
      if (context?.type === 'user' && context.previousCart) {
        queryClient.setQueryData(['cart', user?.id], context.previousCart);
      }
      console.error("❌ Error actualizando cantidad:", error);
    },
    onSettled: () => {
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ["cart", user.id] });
      }
    },
  });

  // ✅ ELIMINAR DEL CARRITO - HÍBRIDO
  const removeFromCartMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (user?.id) {
        const { error } = await supabase
          .from("cart_items")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productId);
        if (error) throw error;
        return { type: 'user', action: 'delete', productId };
      } else {
        const updatedCart = localCart.filter(item => item.product_id !== productId);
        setLocalCart(updatedCart);
        return { type: 'local', action: 'delete', productId };
      }
    },
    onMutate: async (productId) => {
      if (user?.id) {
        await queryClient.cancelQueries({ queryKey: ['cart', user.id] });
        const previousCart = queryClient.getQueryData(['cart', user.id]);

        queryClient.setQueryData(['cart', user.id], (old: CartItem[] | undefined) => {
          if (!old) return old;
          return old.filter(item => item.product_id !== productId);
        });

        return { previousCart, type: 'user' };
      } else {
        return { type: 'local' };
      }
    },
    onError: (error, _variables, context) => {
      if (context?.type === 'user' && context.previousCart) {
        queryClient.setQueryData(['cart', user?.id], context.previousCart);
      }
      console.error("❌ Error eliminando del carrito:", error);
    },
    onSettled: () => {
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ["cart", user.id] });
      }
    },
  });

  // ✅ VACIAR CARRITO - HÍBRIDO
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (user?.id) {
        const { error } = await supabase
          .from("cart_items")
          .delete()
          .eq("user_id", user.id);
        if (error) throw error;
        return { type: 'user' };
      } else {
        setLocalCart([]);
        return { type: 'local' };
      }
    },
    onMutate: async () => {
      if (user?.id) {
        await queryClient.cancelQueries({ queryKey: ['cart', user.id] });
        const previousCart = queryClient.getQueryData(['cart', user.id]);
        queryClient.setQueryData(['cart', user.id], []);
        return { previousCart, type: 'user' };
      } else {
        return { type: 'local' };
      }
    },
    onError: (error, _variables, context) => {
      if (context?.type === 'user' && context.previousCart) {
        queryClient.setQueryData(['cart', user?.id], context.previousCart);
      }
      console.error("❌ Error vaciando carrito:", error);
    },
    onSettled: () => {
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ["cart", user.id] });
      }
    },
  });

  // ✅ OBTENER ITEMS VISIBLES (híbrido)
  const getVisibleItems = (): (CartItem | LocalCartItem)[] => {
    if (user?.id) {
      return userCart;
    } else {
      // Convertir localCart a formato similar a CartItem para consistencia
      return localCart.map(item => ({
        id: `local-${item.product_id}`,
        product_id: item.product_id,
        quantity: item.quantity,
        created_at: new Date().toISOString(),
        products: item.products
      })) as CartItem[];
    }
  };

  // ✅ CÁLCULOS DERIVADOS (híbridos)
  const visibleItems = getVisibleItems();
  const totalItems = visibleItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = visibleItems.reduce(
    (sum, item) => sum + (item.products.precio || 0) * item.quantity,
    0
  );

  return {
    // Datos
    items: visibleItems,
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

    // Info adicional para UI
    isUsingLocalCart: !user?.id,
    localCartCount: localCart.reduce((sum, item) => sum + item.quantity, 0),
    userCartCount: userCart.reduce((sum, item) => sum + item.quantity, 0),

    // Errores
    error:
      addToCartMutation.error ||
      updateQuantityMutation.error ||
      removeFromCartMutation.error,
  };
};