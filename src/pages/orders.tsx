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
      processing: <Clock className="w-3 h-3 sm:w-4 sm:h-4" />,
      shipped: <Truck className="w-3 h-3 sm:w-4 sm:h-4" />,
      delivered: <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />,
      cancelled: <Package className="w-3 h-3 sm:w-4 sm:h-4" />,
    };
    return (
      icons[status as keyof typeof icons] || (
        <Package className="w-3 h-3 sm:w-4 sm:h-4" />
      )
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
    { id: "all", label: "Todos" },
    { id: "processing", label: "En proceso" },
    { id: "shipped", label: "Enviados" },
    { id: "delivered", label: "Entregados" },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-7xl mx-auto text-center">
          <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900">
            Acceso requerido
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Inicia sesión para ver tus pedidos
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">
            Cargando pedidos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl 2xl:max-w-6xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Mi historial de pedidos
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 sm:gap-3 mb-6 sm:mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as OrderStatus)}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer flex-shrink-0 ${
                activeTab === tab.id
                  ? "bg-blue-100 text-blue-700"
                  : "bg-white text-gray-600 hover:bg-blue-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Lista de pedidos */}
        <div className="space-y-4 sm:space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl sm:rounded-2xl py-40 p-6 sm:p-8 lg:p-12 text-center">
              <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-base sm:text-lg mb-2">
                {activeTab === "all"
                  ? "No tienes pedidos realizados"
                  : "No tienes pedidos en esta categoría"}
              </p>
              <p className="text-gray-400 text-sm sm:text-base">
                {activeTab === "all"
                  ? "Comienza a comprar y encuentra tus productos favoritos"
                  : "Los pedidos aparecerán aquí según su estado"}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <Card
                key={order.id}
                className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4 sm:p-6 lg:p-8">
                  {/* Header del pedido */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
                    <div className="space-y-1 sm:space-y-2">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                        Pedido #{order.order_number}
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Fecha: {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
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
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )} flex items-center gap-1 flex-shrink-0`}
                      >
                        {getStatusIcon(order.status)}
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                  </div>

                  {/* Productos del pedido */}
                  <div className="space-y-3 sm:space-y-4">
                    {order.order_items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                            {item.product_name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600">
                            Cantidad: {item.quantity}
                          </p>
                          <p className="text-sm sm:text-base font-medium text-gray-900">
                            S/ {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer del pedido */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 gap-3">
                    <p className="text-base sm:text-lg font-bold text-gray-900">
                      Total: S/ {order.total.toFixed(2)}
                    </p>
                    <div className="flex gap-2 sm:gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full font-medium text-xs sm:text-sm"
                      >
                        Ver detalles
                      </Button>
                      <Button
                        size="sm"
                        className="bg-gray-900 hover:bg-gray-800 text-white rounded-full font-medium text-xs sm:text-sm"
                      >
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
