import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense, lazy } from "react";
import Loader from "@/components/common/loader";
import MainLayout from "@/components/layout/mainLayout";

// Lazy load de las páginas
const Home = lazy(() => import("@/pages/home"))
const Profile = lazy(() => import("@/pages/profile"));
const ProductDetail = lazy(() => import("@/pages/productDetail"))
const Sofa = lazy(() => import("@/pages/sofa"))
const Mesa = lazy(() => import("@/pages/mesa"))
const Silla = lazy(() => import("@/pages/silla"))
const Iluminacion = lazy(() => import("@/pages/iluminacion"))
const Decoracion = lazy(() => import("@/pages/decoracion"))
const Cart = lazy(() => import("@/pages/cart"))
const NotFound = lazy(() => import("@/pages/notFound"))

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/perfil", element: <Profile /> },
      { path: "/producto/:id", element: <ProductDetail /> },
      { path: "/sofas", element: <Sofa /> },
      { path: "/sillas", element: <Silla /> },
      { path: "/mesas", element: <Mesa /> },
      { path: "/iluminacion", element: <Iluminacion /> },
      { path: "/decoracion", element: <Decoracion /> },
      { path: "/carrito", element: <Cart /> },
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
