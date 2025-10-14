import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense, lazy } from "react";
import MainLayout from "@/components/layout/mainLayout";
import Favorites from "@/pages/favorites";
import Orders from "@/pages/orders";
import Loader from "@/components/common/loader";
// import Checkout from "@/pages/checkout";

// Lazy load de las páginas
const Home = lazy(() => import("@/pages/home"))
const Cart = lazy(() => import("@/pages/cart"))
const Profile = lazy(() => import("@/pages/profile"))
const ProductDetail = lazy(() => import("@/pages/productDetail"))
const Sofa = lazy(() => import("@/pages/sofa"))
const Mesa = lazy(() => import("@/pages/mesa"))
const Silla = lazy(() => import("@/pages/silla"))
const Iluminacion = lazy(() => import("@/pages/iluminacion"))
const Decoracion = lazy(() => import("@/pages/decoracion"))
const NotFound = lazy(() => import("@/pages/notFound"))

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/carrito", element: <Cart /> },
      { path: "/perfil", element: <Profile /> },
      { path: "/productos/:id", element: <ProductDetail /> },
      // { path: "/verificacion-de-pago", element: <Checkout /> },
      { path: "/mis-favoritos", element: <Favorites /> },
      { path: "/mis-pedidos", element: <Orders /> },
      { path: "/sofas", element: <Sofa /> },
      { path: "/sillas", element: <Silla /> },
      { path: "/mesas", element: <Mesa /> },
      { path: "/iluminacion", element: <Iluminacion /> },
      { path: "/decoracion", element: <Decoracion /> },
      { path: "*", element: <NotFound /> },
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
