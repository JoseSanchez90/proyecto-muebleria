// src/context/CartContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { ReactNode } from "react";
import Loader from "@/components/common/loader";

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
  categoria: string;
  stock: number;
}

interface CartItem extends Producto {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (producto: Producto) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotal: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingCart, setLoadingCart] = useState(false);

  // 🔹 Obtener usuario actual y escuchar cambios de sesión
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUserId(data.user.id);
    };
    getUser();

    // Escuchar login / logout / refresh
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const id = session?.user?.id ?? null;
        setUserId((prev) => (prev !== id ? id : prev));
      }
    );

    return () => subscription?.subscription.unsubscribe();
  }, []);

  // 🔹 Cargar carrito del usuario autenticado
  useEffect(() => {
    const loadCart = async () => {
      if (!userId) {
        console.log("⛔ No hay usuario activo, no cargar carrito.");
        return;
      }

      setLoadingCart(true);
      try {
        console.log("🛒 Cargando carrito para usuario:", userId);
        const { data, error } = await supabase
          .from("cart_items")
          .select("*")
          .eq("user_id", userId);

        if (error) throw error;
        if (data && data.length > 0) {
          setItems(data);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error("Error al cargar carrito:", err);
      } finally {
        setLoadingCart(false);
      }
    };

    loadCart();
  }, [userId]);

  // 🔹 Agregar producto
  const addToCart = async (producto: Producto) => {
    setItems((prev) => {
      const exists = prev.find((item) => item.id === producto.id);
      if (exists) {
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...producto, quantity: 1 }];
    });

    if (!userId) {
      console.warn("⚠️ Producto agregado localmente (usuario no logueado)");
      return;
    }

    const { error } = await supabase.from("cart_items").upsert(
      {
        user_id: userId,
        product_id: producto.id,
        quantity: 1,
      },
      { onConflict: "user_id,product_id" }
    );

    if (error) console.error("Error al agregar al carrito:", error);
  };

  // 🔹 Eliminar producto
  const removeFromCart = async (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));

    if (!userId) return;

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", id);

    if (error) console.error("Error al eliminar del carrito:", error);
  };

  // 🔹 Actualizar cantidad
  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(id);

    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );

    if (!userId) return;

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("user_id", userId)
      .eq("product_id", id);

    if (error) console.error("Error al actualizar cantidad:", error);
  };

  // 🔹 Vaciar carrito (solo cuando el usuario realmente cierra sesión)
  const clearCart = async () => {
    console.log("🧹 Limpiando carrito...");
    setItems([]);

    if (!userId) return;

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", userId);

    if (error) console.error("Error al limpiar carrito:", error);
  };

  const getTotal = () => items.reduce((t, i) => t + i.precio * i.quantity, 0);
  const getTotalItems = () => items.reduce((t, i) => t + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getTotalItems,
      }}
    >
      {loadingCart ? <Loader /> : children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
