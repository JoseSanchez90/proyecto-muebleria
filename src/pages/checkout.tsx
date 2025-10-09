// import { useState, useEffect } from 'react';
// import { useCart } from '@/context/cartContext';
// import { useAuth } from '@/components/Authentication/authContext';
// import { supabase } from '@/lib/supabaseClient';
// import { Card } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// import { Label } from '@/components/ui/label';
// import { Link, useNavigate } from 'react-router-dom';
// import { ArrowLeft, CreditCard, MapPin, Shield } from 'lucide-react';
// import { toast } from 'sonner';

// interface UserAddress {
//   id: string;
//   type: 'shipping' | 'billing';
//   full_name: string;
//   address: string;
//   city: string;
//   state: string;
//   zip_code: string;
//   country: string;
//   phone: string;
//   is_default: boolean;
// }

// export default function Checkout() {
//   const { cartItems, getTotalPrice, clearCart } = useCart();
//   const { user } = useAuth();
//   const navigate = useNavigate();
  
//   const [loading, setLoading] = useState(false);
//   const [userAddresses, setUserAddresses] = useState<UserAddress[]>([]);
//   const [selectedShippingAddress, setSelectedShippingAddress] = useState<string>('');
//   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('credit_card');
  
//   // Estados para nueva dirección
//   const [newAddress, setNewAddress] = useState({
//     full_name: '',
//     address: '',
//     city: '',
//     state: '',
//     zip_code: '',
//     phone: '',
//     save_address: false
//   });

//   // Cargar direcciones del usuario
//   const loadUserAddresses = async () => {
//     if (!user) return;

//     try {
//       const { data, error } = await supabase
//         .from('user_addresses')
//         .select('*')
//         .eq('user_id', user.id)
//         .order('is_default', { ascending: false });

//       if (error) throw error;
//       setUserAddresses(data || []);

//       // Seleccionar dirección por defecto si existe
//       const defaultAddress = data?.find(addr => addr.is_default);
//       if (defaultAddress) {
//         setSelectedShippingAddress(defaultAddress.id);
//       }
//     } catch (error) {
//       console.error('Error cargando direcciones:', error);
//     }
//   };

//   useEffect(() => {
//     if (user) {
//       loadUserAddresses();
//     }
//   }, [user]);

//   // Redirigir si el carrito está vacío
//   useEffect(() => {
//     if (cartItems.length === 0) {
//       navigate('/carrito');
//     }
//   }, [cartItems, navigate]);

//   const subtotal = getTotalPrice();
//   const shippingCost = 15.00; // Costo de envío fijo
//   const total = subtotal + shippingCost;

//   const handlePlaceOrder = async () => {
//     if (!user) {
//       toast.error('Debes iniciar sesión para realizar el pedido');
//       return;
//     }

//     if (!selectedShippingAddress && !newAddress.full_name) {
//       toast.error('Selecciona o agrega una dirección de envío');
//       return;
//     }

//     setLoading(true);

//     try {
//       let shippingAddress;

//       // Usar dirección existente o crear nueva
//       if (selectedShippingAddress) {
//         const address = userAddresses.find(addr => addr.id === selectedShippingAddress);
//         shippingAddress = address;
//       } else {
//         shippingAddress = {
//           full_name: newAddress.full_name,
//           address: newAddress.address,
//           city: newAddress.city,
//           state: newAddress.state,
//           zip_code: newAddress.zip_code,
//           country: 'Perú',
//           phone: newAddress.phone
//         };

//         // Guardar nueva dirección si el usuario quiere
//         if (newAddress.save_address && user) {
//           const { error } = await supabase
//             .from('user_addresses')
//             .insert({
//               user_id: user.id,
//               type: 'shipping',
//               ...shippingAddress,
//               is_default: userAddresses.length === 0 // Primera dirección como default
//             });

//           if (error) throw error;
//         }
//       }

//       // Crear el pedido
//       const { data: order, error: orderError } = await supabase
//         .from('orders')
//         .insert({
//           user_id: user.id,
//           total: total,
//           items_count: cartItems.reduce((sum, item) => sum + item.quantity, 0),
//           status: 'pending',
//           shipping_address: shippingAddress,
//           payment_method: selectedPaymentMethod,
//           payment_status: 'pending',
//           shipping_method: 'standard',
//           shipping_cost: shippingCost
//         })
//         .select()
//         .single();

//       if (orderError) throw orderError;

//       // Crear items del pedido
//       const orderItems = cartItems.map(item => ({
//         order_id: order.id,
//         product_id: item.id,
//         product_name: item.nombre,
//         product_image: item.imagen_url,
//         price: item.precio,
//         quantity: item.quantity
//       }));

//       const { error: itemsError } = await supabase
//         .from('order_items')
//         .insert(orderItems);

//       if (itemsError) throw itemsError;

//       // Limpiar carrito y redirigir
//       clearCart();
//       toast.success('¡Pedido realizado con éxito!');
//       navigate('/mis-pedidos');

//     } catch (error) {
//       console.error('Error realizando pedido:', error);
//       toast.error('Error al realizar el pedido');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (cartItems.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-500 text-lg mb-4">Tu carrito está vacío</p>
//           <Link to="/">
//             <Button>Seguir comprando</Button>
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <Link to="/carrito" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
//             <ArrowLeft className="w-4 h-4" />
//             Volver al carrito
//           </Link>
//           <h1 className="text-4xl font-bold text-black">Finalizar compra</h1>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Columna izquierda - Información de envío y pago */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Dirección de envío */}
//             <Card className="bg-white border border-gray-200 rounded-2xl p-6">
//               <div className="flex items-center gap-3 mb-6">
//                 <MapPin className="w-6 h-6 text-blue-600" />
//                 <h2 className="text-xl font-bold text-black">Dirección de envío</h2>
//               </div>

//               {/* Direcciones guardadas */}
//               {userAddresses.length > 0 && (
//                 <div className="mb-6">
//                   <Label className="text-sm font-medium text-gray-700 mb-3 block">
//                     Selecciona una dirección guardada
//                   </Label>
//                   <RadioGroup value={selectedShippingAddress} onValueChange={setSelectedShippingAddress}>
//                     {userAddresses.map((address) => (
//                       <div key={address.id} className="flex items-center space-x-2 mb-3">
//                         <RadioGroupItem value={address.id} id={address.id} />
//                         <Label htmlFor={address.id} className="flex-1 cursor-pointer">
//                           <div className="border border-gray-200 rounded-lg p-3 hover:border-blue-500">
//                             <p className="font-medium">{address.full_name}</p>
//                             <p className="text-sm text-gray-600">{address.address}</p>
//                             <p className="text-sm text-gray-600">
//                               {address.city}, {address.state} {address.zip_code}
//                             </p>
//                             <p className="text-sm text-gray-600">{address.phone}</p>
//                             {address.is_default && (
//                               <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded mt-1">
//                                 Predeterminada
//                               </span>
//                             )}
//                           </div>
//                         </Label>
//                       </div>
//                     ))}
//                   </RadioGroup>
//                 </div>
//               )}

//               {/* Nueva dirección */}
//               <div className="border-t pt-6">
//                 <Label className="text-sm font-medium text-gray-700 mb-4 block">
//                   {userAddresses.length > 0 ? 'O agrega una nueva dirección' : 'Agrega tu dirección de envío'}
//                 </Label>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <Input
//                     placeholder="Nombre completo"
//                     value={newAddress.full_name}
//                     onChange={(e) => setNewAddress(prev => ({ ...prev, full_name: e.target.value }))}
//                   />
//                   <Input
//                     placeholder="Teléfono"
//                     value={newAddress.phone}
//                     onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
//                   />
//                   <Input
//                     placeholder="Dirección"
//                     value={newAddress.address}
//                     onChange={(e) => setNewAddress(prev => ({ ...prev, address: e.target.value }))}
//                     className="md:col-span-2"
//                   />
//                   <Input
//                     placeholder="Ciudad"
//                     value={newAddress.city}
//                     onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
//                   />
//                   <Input
//                     placeholder="Provincia"
//                     value={newAddress.state}
//                     onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
//                   />
//                   <Input
//                     placeholder="Código postal"
//                     value={newAddress.zip_code}
//                     onChange={(e) => setNewAddress(prev => ({ ...prev, zip_code: e.target.value }))}
//                   />
//                 </div>

//                 {user && (
//                   <div className="flex items-center space-x-2 mt-4">
//                     <input
//                       type="checkbox"
//                       id="save_address"
//                       checked={newAddress.save_address}
//                       onChange={(e) => setNewAddress(prev => ({ ...prev, save_address: e.target.checked }))}
//                       className="rounded border-gray-300"
//                     />
//                     <Label htmlFor="save_address" className="text-sm text-gray-600">
//                       Guardar esta dirección para futuras compras
//                     </Label>
//                   </div>
//                 )}
//               </div>
//             </Card>

//             {/* Método de pago */}
//             <Card className="bg-white border border-gray-200 rounded-2xl p-6">
//               <div className="flex items-center gap-3 mb-6">
//                 <CreditCard className="w-6 h-6 text-blue-600" />
//                 <h2 className="text-xl font-bold text-black">Método de pago</h2>
//               </div>

//               <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
//                 <div className="space-y-4">
//                   <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-500">
//                     <RadioGroupItem value="credit_card" id="credit_card" />
//                     <Label htmlFor="credit_card" className="flex-1 cursor-pointer">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="font-medium">Tarjeta de crédito/débito</p>
//                           <p className="text-sm text-gray-600">Paga con tu tarjeta Visa, Mastercard o American Express</p>
//                         </div>
//                         <div className="flex gap-2">
//                           <span className="text-xs bg-gray-100 px-2 py-1 rounded">Visa</span>
//                           <span className="text-xs bg-gray-100 px-2 py-1 rounded">MC</span>
//                           <span className="text-xs bg-gray-100 px-2 py-1 rounded">AMEX</span>
//                         </div>
//                       </div>
//                     </Label>
//                   </div>

//                   <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-500">
//                     <RadioGroupItem value="paypal" id="paypal" />
//                     <Label htmlFor="paypal" className="flex-1 cursor-pointer">
//                       <p className="font-medium">PayPal</p>
//                       <p className="text-sm text-gray-600">Paga rápido y seguro con tu cuenta PayPal</p>
//                     </Label>
//                   </div>

//                   <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-500">
//                     <RadioGroupItem value="cash" id="cash" />
//                     <Label htmlFor="cash" className="flex-1 cursor-pointer">
//                       <p className="font-medium">Pago contra entrega</p>
//                       <p className="text-sm text-gray-600">Paga cuando recibas tu pedido</p>
//                     </Label>
//                   </div>
//                 </div>
//               </RadioGroup>
//             </Card>
//           </div>

//           {/* Columna derecha - Resumen del pedido */}
//           <div className="space-y-6">
//             <Card className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-6">
//               <h3 className="text-lg font-bold text-black mb-4">Resumen del pedido</h3>
              
//               {/* Productos */}
//               <div className="space-y-3 mb-4">
//                 {cartItems.map((item) => (
//                   <div key={item.id} className="flex gap-3">
//                     <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
//                       <img
//                         src={item.imagen_url}
//                         alt={item.nombre}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-medium text-gray-900 truncate">
//                         {item.nombre}
//                       </p>
//                       <p className="text-sm text-gray-600">
//                         Cantidad: {item.quantity}
//                       </p>
//                     </div>
//                     <p className="text-sm font-medium text-gray-900">
//                       S/ {(item.precio * item.quantity).toFixed(2)}
//                     </p>
//                   </div>
//                 ))}
//               </div>

//               {/* Totales */}
//               <div className="space-y-2 border-t pt-4">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Subtotal</span>
//                   <span>S/ {subtotal.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Envío</span>
//                   <span>S/ {shippingCost.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-lg font-bold border-t pt-2">
//                   <span>Total</span>
//                   <span>S/ {total.toFixed(2)}</span>
//                 </div>
//               </div>

//               {/* Botón de compra */}
//               <Button
//                 onClick={handlePlaceOrder}
//                 disabled={loading}
//                 className="w-full mt-6 bg-black hover:bg-gray-800 text-white py-3 rounded-full font-semibold"
//               >
//                 {loading ? (
//                   <div className="flex items-center gap-2">
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     Procesando pedido...
//                   </div>
//                 ) : (
//                   `Realizar pedido - S/ ${total.toFixed(2)}`
//                 )}
//               </Button>

//               {/* Garantías */}
//               <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
//                 <Shield className="w-4 h-4" />
//                 <span>Compra 100% segura y protegida</span>
//               </div>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }