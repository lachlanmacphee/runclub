import { useAccessiblePages } from "@/hooks/useAccessiblePages";

// Components
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { DesktopLink } from "./desktopLink";

export function DesktopNavMenu({ notifications }: { notifications: string[] }) {
  const { getPages } = useAccessiblePages();

  return (
    <NavigationMenu className="hidden 2xl:block">
      <NavigationMenuList>
        {getPages().map((page) => (
          <DesktopLink
            key={page.path}
            path={page.path}
            label={page.label}
            notification={notifications.includes(page.label)}
          />
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
