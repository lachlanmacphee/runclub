import { Link } from "react-router-dom";

// Components
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useAccessiblePages } from "@/hooks/useAccessiblePages";

export function DesktopNavMenu() {
  const { getPages } = useAccessiblePages();

  return (
    <NavigationMenu className="hidden xl:block">
      <NavigationMenuList>
        {getPages().map((page) => (
          <NavigationMenuItem key={page.path}>
            <Link to={page.path} className={navigationMenuTriggerStyle()}>
              {page.label}
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
