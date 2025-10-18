// components/Products.tsx
import { useState, useMemo } from "react";
import { useProducts } from "@/hooks/products/useProducts";
import { useCart } from "@/hooks/cart/useCart";
import {
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Heart,
  Filter,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/utils/formatters";
import { useFavorites } from "@/hooks/favorites/useFavorites";
import { useAuth } from "@/hooks/auth/useAuth";
import { IoShareSocialSharp } from "react-icons/io5";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image: string;
  category?: string;
  mas_vendido: boolean;
  lo_ultimo: boolean;
  nuevo: boolean;
  stock: number;
  created_at: string;
}

// Tipos para los filtros
interface Filters {
  categories: string[];
  priceRange: [number, number];
  sortBy: "price-asc" | "price-desc" | "name" | "newest";
}

function Products() {
  const { products, isLoading, error } = useProducts();
  const { addToCart, isAdding } = useCart();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { toggleFavorite, isFavorite, isToggling } = useFavorites();
  const { user } = useAuth();
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 20;

  // Estado para los filtros
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    priceRange: [0, 10000], // Rango inicial amplio
    sortBy: "newest",
  });

  // Obtener categorías únicas de los productos
  const categories = useMemo(() => {
    const allCategories = products
      .map((product) => product.category)
      .filter(Boolean) as string[];
    return [...new Set(allCategories)].sort();
  }, [products]);

  // Obtener precios mínimo y máximo para el rango
  const priceRange = useMemo(() => {
    if (products.length === 0) return [0, 1000];
    const prices = products.map((p) => p.price);
    return [Math.min(...prices), Math.max(...prices)];
  }, [products]);

  // Aplicar filtros y ordenamiento
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Filtrar por categorías
    if (filters.categories.length > 0) {
      filtered = filtered.filter(
        (product) =>
          product.category && filters.categories.includes(product.category)
      );
    }

    // Filtrar por rango de precio
    filtered = filtered.filter(
      (product) =>
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1]
    );

    // Ordenar
    switch (filters.sortBy) {
      case "price-asc":
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
        filtered = [...filtered].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
    }

    return filtered;
  }, [products, filters]);

  // Manejar cambios en los filtros
  const handleCategoryChange = (category: string) => {
    setFilters((prev) => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories: newCategories };
    });
    setCurrentPage(1); // Resetear a primera página al cambiar filtros
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    // Asegurar que min no sea mayor que max y viceversa
    const adjustedMin = Math.min(Math.max(min, priceRange[0]), priceRange[1]);
    const adjustedMax = Math.max(Math.min(max, priceRange[1]), priceRange[0]);

    setFilters((prev) => ({
      ...prev,
      priceRange: [adjustedMin, adjustedMax],
    }));
    setCurrentPage(1);
  };

  const handleSortChange = (sortBy: Filters["sortBy"]) => {
    setFilters((prev) => ({ ...prev, sortBy }));
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      priceRange: priceRange as [number, number],
      sortBy: "newest",
    });
    setCurrentPage(1);
  };

  const handleComprar = (product: Product, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    const cartProduct = {
      id: product.id,
      nombre: product.name,
      descripcion: product.description || "",
      precio: product.price,
      imagen_url: product.image,
      categoria: product.category || "",
      stock: product.stock,
    };

    addToCart({ product: cartProduct, quantity: 1 });

    toast.custom((t) => (
      <div
        className={`${
          t.visible ? "animate-custom-enter" : "animate-custom-leave"
        } max-w-xs w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-gray-300 ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-2">
          <div className="flex items-center justify-center">
            <div className="flex-shrink-0 pt-0.5">
              <img
                className="h-14 w-14 rounded-sm object-cover"
                src={product.image}
                alt={product.name}
              />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900 line-clamp-1">
                {product.name}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                ¡Agregado al carrito!
              </p>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  // función para manejar favoritos con stopPropagation
  const handleToggleFavorite = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(productId);
  };

  // Función para compartir producto - Versión simplificada
  const handleShareProduct = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();

    const productUrl = `${window.location.origin}/productos/${product.id}`;

    const textToCopy = `${productUrl}`;

    try {
      // Intentar usar la Clipboard API moderna primero
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback para navegadores antiguos
        const tempInput = document.createElement("input");
        tempInput.value = textToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
      }

      toast.success("¡Enlace copiado al portapapeles!");
    } catch (error) {
      console.error("Error al copiar al portapapeles:", error);
      toast.error("Error al copiar el enlace");
    }
  };

  // Cálculos de paginación con productos filtrados
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredAndSortedProducts.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderPageNumbers = () => {
    const pages = [];

    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => goToPage(currentPage - 1)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
      );
    }

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(
          <button
            key={i}
            onClick={() => goToPage(i)}
            className={`w-8 h-8 flex items-center justify-center rounded-full font-medium transition-colors cursor-pointer ${
              currentPage === i
                ? "bg-orange-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {i}
          </button>
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push(
          <span
            key={`ellipsis-${i}`}
            className="w-10 h-10 flex items-center justify-center text-gray-400"
          >
            ...
          </span>
        );
      }
    }

    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => goToPage(currentPage + 1)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      );
    }

    return pages;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="container mx-auto px-4 max-w-5xl 2xl:max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl 2xl:text-4xl font-bold text-black mb-2">
              Nuestros Productos
            </h1>
            <p className="text-gray-600">
              Descubre nuestra colección de muebles y decoración
            </p>
          </div>
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-xl">Cargando productos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="container mx-auto px-4 max-w-5xl 2xl:max-w-7xl text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-800 mb-2">
              Error al cargar productos
            </h2>
            <p className="text-red-600">
              Por favor, intenta de nuevo más tarde.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="container mx-auto px-4 max-w-7xl 2xl:max-w-[90rem]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl 2xl:text-4xl font-bold text-black mb-2">
            Nuestros Productos
          </h1>
          <p className="text-gray-600">
            Descubre nuestra colección de muebles y decoración
          </p>
        </div>

        {/* Filtros móviles */}
        <div className="lg:hidden mb-6">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
            variant="outline"
          >
            <Filter className="w-4 h-4" />
            Filtros
            {(filters.categories.length > 0 ||
              filters.priceRange[0] > priceRange[0] ||
              filters.priceRange[1] < priceRange[1]) && (
              <span className="bg-orange-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                !
              </span>
            )}
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de filtros */}
          <div
            className={`
            lg:w-80 bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit lg:sticky lg:top-4
            ${showFilters ? "block" : "hidden lg:block"}
          `}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
              <Button
                onClick={clearAllFilters}
                variant="ghost"
                size="sm"
                className="bg-orange-500 text-white hover:text-white hover:bg-orange-600 transition-all duration-300 cursor-pointer"
              >
                Limpiar
              </Button>
              <Button
                onClick={() => setShowFilters(false)}
                variant="ghost"
                size="sm"
                className="lg:hidden"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Filtro por categoría con shadcn/ui - Versión mejorada */}
            <div className="mb-8">
              <h3 className="font-medium text-gray-900 mb-4">Categorías</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {categories.map((category) => (
                  <div key={category} className="w-fit flex items-center gap-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={filters.categories.includes(category)}
                      onCheckedChange={() => handleCategoryChange(category)}
                      className="data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                    />
                    <Label
                      htmlFor={`category-${category}`}
                      className="text-sm text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
                    >
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Filtro por rango de precio con shadcn/ui - Versión con inputs */}
            <div className="mb-8">
              <h3 className="font-medium text-gray-900 mb-4">
                Rango de Precio
              </h3>
              <div className="space-y-6">
                {/* Inputs numéricos */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label
                      htmlFor="min-price"
                      className="text-xs text-gray-500 block mb-1"
                    >
                      Mínimo
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                        S/
                      </span>
                      <input
                        id="min-price"
                        type="number"
                        value={filters.priceRange[0]}
                        onChange={(e) =>
                          handlePriceRangeChange(
                            Number(e.target.value),
                            filters.priceRange[1]
                          )
                        }
                        min={priceRange[0]}
                        max={filters.priceRange[1]}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <Label
                      htmlFor="max-price"
                      className="text-xs text-gray-500 block mb-1"
                    >
                      Máximo
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                        S/
                      </span>
                      <input
                        id="max-price"
                        type="number"
                        value={filters.priceRange[1]}
                        onChange={(e) =>
                          handlePriceRangeChange(
                            filters.priceRange[0],
                            Number(e.target.value)
                          )
                        }
                        min={filters.priceRange[0]}
                        max={priceRange[1]}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Slider */}
                <div className="px-2">
                  <Slider
                    value={filters.priceRange}
                    min={priceRange[0]}
                    max={priceRange[1]}
                    step={1}
                    onValueChange={(value) =>
                      handlePriceRangeChange(value[0], value[1])
                    }
                    className="[&_[role=slider]]:bg-orange-600 [&_[role=slider]]:border-orange-600 [&_[role=slider]]:hover:bg-orange-700 [&_[role=slider]]:focus:bg-orange-700"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>S/ {formatPrice(priceRange[0])}</span>
                    <span>S/ {formatPrice(priceRange[1])}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ordenamiento con shadcn/ui - Versión con cards */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-4">Ordenar por</h3>
              <RadioGroup
                value={filters.sortBy}
                onValueChange={(value) =>
                  handleSortChange(value as Filters["sortBy"])
                }
                className="grid gap-2"
              >
                {[
                  {
                    value: "newest",
                    label: "Más recientes",
                    description: "Productos más nuevos primero",
                  },
                  {
                    value: "price-asc",
                    label: "Precio: Menor a Mayor",
                    description: "Rango de precio ascendente",
                  },
                  {
                    value: "price-desc",
                    label: "Precio: Mayor a Menor",
                    description: "Rango de precio descendente",
                  },
                  {
                    value: "name",
                    label: "Nombre A-Z",
                    description: "Orden alfabético",
                  },
                ].map((option) => (
                  <Label
                    htmlFor={`sort-${option.value}`}
                    key={option.value}
                    className={`
          flex flex-col items-start p-3 rounded-lg border-2 cursor-pointer transition-all
          ${
            filters.sortBy === option.value
              ? "border-orange-600 bg-orange-50"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }
        `}
                  >
                    <div className="flex items-center space-x-2 w-full">
                      <RadioGroupItem
                        value={option.value}
                        id={`sort-${option.value}`}
                        className="text-orange-600 border-gray-300 data-[state=checked]:border-orange-600"
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-900">
                          {option.label}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            {/* Contador de resultados */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                {filteredAndSortedProducts.length} producto
                {filteredAndSortedProducts.length !== 1 ? "s" : ""} encontrado
                {filteredAndSortedProducts.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-xl text-gray-500 mb-4">
                  No hay productos que coincidan con los filtros
                </p>
                <Button onClick={clearAllFilters} variant="outline">
                  Limpiar filtros
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 2xl:gap-8 mb-12">
                  {currentProducts.map((product) => (
                    <div
                      key={product.id}
                      className="border border-gray-300 bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all group flex flex-col"
                      onMouseEnter={() => setHoveredId(product.id)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      {/* código del producto */}
                      <div
                        className="aspect-square w-full h-48 2xl:h-60 overflow-hidden relative cursor-pointer"
                        onClick={() => navigate(`/productos/${product.id}`)}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            console.error(
                              "Error al cargar imagen:",
                              product.image
                            );
                            e.currentTarget.src =
                              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%239ca3af"%3EImagen no disponible%3C/text%3E%3C/svg%3E';
                          }}
                        />

                        {/* Overlay con botones */}
                        <div
                          className={`hidden lg:flex absolute inset-0 bg-black/40 flex-col items-center justify-center gap-4 transition-opacity duration-300 ${
                            hoveredId === product.id
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        >
                          <Button
                            onClick={(e) => handleShareProduct(product, e)}
                            className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-orange-600 hover:text-white transition-all duration-300 flex items-center gap-2 shadow-lg cursor-pointer"
                          >
                            <IoShareSocialSharp className="w-4 h-4" />
                            Compartir enlace
                          </Button>
                          <Button
                            onClick={(e) => handleComprar(product, e)}
                            disabled={product.stock === 0 || isAdding}
                            className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-orange-600 hover:text-white transition-all duration-300 flex items-center gap-2 shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            {isAdding ? "Agregando..." : "Agregar al carrito"}
                          </Button>
                          <Button
                            onClick={(e) => handleToggleFavorite(product.id, e)}
                            disabled={isToggling || !user}
                            className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-orange-600 hover:text-white transition-all duration-300 flex items-center gap-2 shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                isFavorite(product.id)
                                  ? "fill-red-500 text-red-500"
                                  : "text-gray-400 hover:text-red-500"
                              }`}
                            />
                            Añadir a Favoritos
                          </Button>
                        </div>

                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-2">
                          {product.mas_vendido && (
                            <span className="bg-purple-600 px-2 py-1 rounded-full text-xs font-semibold text-white">
                              Más Vendido
                            </span>
                          )}
                          {product.lo_ultimo && (
                            <span className="bg-[#211C84] px-2 py-1 rounded-full text-xs font-semibold text-white">
                              Lo último
                            </span>
                          )}
                          {product.nuevo && (
                            <span className="bg-green-500 px-2 py-1 rounded-full text-xs font-semibold text-white">
                              Nuevo
                            </span>
                          )}
                        </div>

                        {/* Badge de categoría */}
                        {product.category && (
                          <div className="absolute top-2 right-2">
                            <span className="bg-orange-500 px-2 py-1 rounded-full text-xs font-semibold text-white">
                              {product.category}
                            </span>
                          </div>
                        )}

                        {/* Indicador de stock */}
                        {product.stock === 0 && (
                          <div className="absolute bottom-3 left-3">
                            <span className="bg-red-500 px-2 py-1 rounded-full text-xs font-semibold text-white">
                              Agotado
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Información del producto */}
                      <div className="flex flex-col justify-between flex-1 p-4 min-h-[120px]">
                        <div className="flex-1 min-h-[48px] max-h-[48px] overflow-hidden">
                          <h3
                            className="font-semibold text-md cursor-pointer text-gray-800 hover:text-orange-600 transition-colors line-clamp-2"
                            onClick={() => navigate(`/productos/${product.id}`)}
                          >
                            {product.name}
                          </h3>
                        </div>

                        <div className="mt-auto pt-3">
                          <div className="flex items-center justify-between">
                            <span className="text-md 2xl:text-lg font-bold text-gray-900">
                              S/ {formatPrice(product.price)}
                            </span>
                            {product.stock < 10 && product.stock > 0 && (
                              <span className="flex lg:flex-col text-xs text-orange-600 font-medium">
                                <p>Quedan {product.stock}</p>
                                <p>unidades</p>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Botón de comprar para móvil */}
                      <div className="p-4 pt-0 md:hidden">
                        <Button
                          size="lg"
                          onClick={(e) => handleComprar(product, e)}
                          disabled={product.stock === 0 || isAdding}
                          className="w-full bg-orange-600 text-white hover:bg-orange-700 cursor-pointer"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {isAdding
                            ? "Agregando..."
                            : product.stock === 0
                            ? "Agotado"
                            : "Agregar al carrito"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <>
                    <div className="flex items-center justify-center gap-2">
                      {renderPageNumbers()}
                    </div>

                    {/* Page Info */}
                    <div className="text-center mt-4 text-sm text-gray-500">
                      Mostrando {startIndex + 1}-
                      {Math.min(endIndex, filteredAndSortedProducts.length)} de{" "}
                      {filteredAndSortedProducts.length} productos
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
