
import { supabase } from './supabaseClient';

interface CartItem {
  id: string;
  nombre: string;
  imagen_url: string;
  precio: number;
  quantity: number;
}

export const createOrder = async (userId: string, cartItems: CartItem[], total: number) => {
  try {
    // Calcular items_count
    const itemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    // Crear el pedido (order_number se genera automáticamente por el trigger)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total: total,
        items_count: itemsCount,
        status: 'pending' // Usa 'pending' en lugar de 'processing'
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Crear los items del pedido
    const orderItems = cartItems.map(item => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.nombre,
      product_image: item.imagen_url,
      price: item.precio,
      quantity: item.quantity
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return { success: true, orderNumber: order.order_number };
  } catch (error) {
    console.error('Error creando pedido:', error);
    return { success: false, error };
  }
};