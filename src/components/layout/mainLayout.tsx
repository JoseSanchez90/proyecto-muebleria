import { Outlet } from "react-router-dom";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ScrollToTop from "../ui/scrollToTop";

interface MainLayoutProps {
  admin?: boolean; // opcional: para distinguir si es layout de admin o cliente
}

export default function MainLayout({ admin }: MainLayoutProps) {
  return (
    <>
      <ScrollToTop />
      <div className="w-full min-h-screen flex flex-col bg-background text-foreground">
        {/* Header visible solo para el público */}
        {!admin && <Header />}

        {/* Contenido principal */}
        <main>
          <Outlet /> {/* Aquí se renderizan las páginas según la ruta */}
        </main>

        {/* Footer visible solo para el público */}
        {!admin && <Footer />}
      </div>
    </>
  );
}
