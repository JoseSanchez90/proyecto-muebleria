import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth/useAuth";
import { supabase } from "@/lib/supabaseClient";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";

type OrderStatus = "all" | "processing" | "shipped" | "delivered";

interface OrderItem {
  id: string;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  order_items: OrderItem[];
}

export default function Orders() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<OrderStatus>("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar pedidos del usuario
  const loadOrders = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
    *,
    order_items (*)
  `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setOrders(data || []);
    } catch (error) {
      console.error("Error cargando pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const getStatusLabel = (status: string) => {
    const labels = {
      processing: "En proceso",
      shipped: "Enviado",
      delivered: "Entregado",
      cancelled: "Cancelado",
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      processing: "text-blue-600 bg-blue-50",
      shipped: "text-green-600 bg-green-50",
      delivered: "text-gray-600 bg-gray-50",
      cancelled: "text-red-600 bg-red-50",
    };
    return colors[status as keyof typeof colors] || "text-gray-600 bg-gray-50";
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      processing: <Clock className="w-4 h-4" />,
      shipped: <Truck className="w-4 h-4" />,
      delivered: <CheckCircle className="w-4 h-4" />,
      cancelled: <Package className="w-4 h-4" />,
    };
    return (
      icons[status as keyof typeof icons] || <Package className="w-4 h-4" />
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-PE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((order) => order.status === activeTab);

  const tabs = [
    { id: "all", label: "Todos los pedidos" },
    { id: "processing", label: "En proceso" },
    { id: "shipped", label: "Enviados" },
    { id: "delivered", label: "Entregados" },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 flex items-center justify-center">
        <div className="max-w-7xl mx-auto">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Acceso requerido</h2>
          <p className="text-gray-600">Inicia sesión para ver tus pedidos</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="container mx-auto px-4 max-w-5xl 2xl:max-w-6xl">
        <h1 className="text-3xl 2xl:text-4xl font-bold text-black mb-12">
          Mi historial de pedidos
        </h1>

        {/* Tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as OrderStatus)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "bg-blue-100 text-blue-700"
                  : "bg-white text-gray-600 hover:bg-blue-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Lista de pedidos */}
        <div className="items-center space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="bg-gray-100 p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">
                {activeTab === "all"
                  ? "No tienes pedidos realizados"
                  : "No tienes pedidos en esta categoría"}
              </p>
              <p className="text-gray-400 text-sm">
                {activeTab === "all"
                  ? "Comienza a comprar y encuentra tus productos favoritos"
                  : "Los pedidos aparecerán aquí según su estado"}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <Card
                key={order.id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6 md:p-8">
                  {/* Header del pedido */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div className="space-y-2">
                      <h2 className="text-xl font-bold text-black">
                        Pedido #{order.order_number}
                      </h2>
                      <p className="text-sm text-gray-600">
                        Fecha: {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-2 md:mt-0">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          order.status === "shipped"
                            ? "bg-green-600"
                            : order.status === "delivered"
                            ? "bg-gray-600"
                            : order.status === "cancelled"
                            ? "bg-red-600"
                            : "bg-blue-600"
                        }`}
                      ></span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )} flex items-center gap-1`}
                      >
                        {getStatusIcon(order.status)}
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                  </div>

                  {/* Productos del pedido */}
                  <div className="space-y-4">
                    {order.order_items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">
                            {item.product_name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Cantidad: {item.quantity}
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            S/ {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer del pedido */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 pt-6 border-t border-gray-200">
                    <p className="text-lg font-bold text-gray-900 mb-2 md:mb-0">
                      Total: S/ {order.total.toFixed(2)}
                    </p>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="border-2 border-black text-black hover:bg-black hover:text-white rounded-full font-medium"
                      >
                        Ver detalles
                      </Button>
                      <Button className="bg-black hover:bg-gray-800 text-white rounded-full font-medium">
                        Rastrear pedido
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
