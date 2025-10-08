import { useState } from "react";
import {
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";

type CategoryMenuItemProps = {
  title: string;
  items: { label: string; path: string; key: string }[];
  images: Record<string, string>;
  defaultImage: string;
};

export function CategoryMenuItem({
  title,
  items,
  images,
  defaultImage,
}: CategoryMenuItemProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const currentImage = hovered ? images[hovered] : defaultImage;

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="cursor-pointer">{title}</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid grid-cols-3 gap-2 w-[300px]">
          {/* Lista de subcategorías */}
          <div className="flex flex-col">
            {items.map((item) => (
              <li key={item.key || null}>
                <NavigationMenuLink 
                  href={item.path}
                  onMouseEnter={() => setHovered(item.key)}
                  onMouseLeave={() => setHovered(null)}
                  >
                    {item.label}
                </NavigationMenuLink>
              </li>
            ))}
          </div>

          {/* Imagen dinámica */}
          <div className="col-span-2 flex items-center justify-center">
            <img
              src={currentImage}
              alt={hovered || title}
              className="w-48 h-40 object-cover rounded-md transition-all duration-300"
            />
          </div>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
