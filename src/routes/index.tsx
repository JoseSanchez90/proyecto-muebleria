import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense, lazy } from "react";
import MainLayout from "@/components/layout/mainLayout";
import Favorites from "@/pages/favorites";
import Orders from "@/pages/orders";
import Loader from "@/components/common/loader";

// Lazy load de las páginas
const Home = lazy(() => import("@/pages/home"))
const Cart = lazy(() => import("@/pages/cart"))
const Profile = lazy(() => import("@/pages/profile"))
const Checkout = lazy(() => import("@/pages/checkout"))
const PaymentSuccess = lazy (() => import("@/pages/payment-success"))
const Products = lazy(() => import("@/pages/products"))
const ProductDetail = lazy(() => import("@/pages/productDetail"))
const Sofa = lazy(() => import("@/pages/sofa"))
const Mesa = lazy(() => import("@/pages/mesa"))
const Silla = lazy(() => import("@/pages/silla"))
const Decoracion = lazy(() => import("@/pages/decoracion"))
const About = lazy(() => import("@/pages/about"))
const ShippingPolicies = lazy(() => import("@/pages/shippingPolicies"))
const TermsAndConditions = lazy(() => import("@/pages/termsAndConditions"))
const ReturnsAndRefundsPolicy = lazy(() => import("@/pages/returnsAndRefundsPolicy"))

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/carrito", element: <Cart /> },
      { path: "/perfil", element: <Profile /> },
      { path: "/productos", element: <Products /> },
      { path: "/productos/:id", element: <ProductDetail /> },
      { path: "/checkout", element: <Checkout /> },
      { path: "/payment-success", element: <PaymentSuccess /> },
      { path: "/mis-favoritos", element: <Favorites /> },
      { path: "/mis-pedidos", element: <Orders /> },
      { path: "/sobre-nosotros", element: <About /> },
      { path: "/politicas-envio", element: <ShippingPolicies /> },
      { path: "/terminos-condiciones", element: <TermsAndConditions /> },
      { path: "/politicas-devoluciones", element: <ReturnsAndRefundsPolicy /> },
      { path: "/sofas", element: <Sofa /> },
      { path: "/sillas", element: <Silla /> },
      { path: "/mesas", element: <Mesa /> },
      { path: "/decoracion", element: <Decoracion /> },
    ],
  },
]);

export function AppRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}
