import { Link } from "react-router-dom";
import { usePocket } from "@/contexts";

// Components
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function DesktopNavMenu() {
  const { user } = usePocket();

  return (
    <NavigationMenu className="hidden xl:block">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/" className={navigationMenuTriggerStyle()}>
            Home
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/runs" className={navigationMenuTriggerStyle()}>
            Runs
          </Link>
        </NavigationMenuItem>
        {user && user?.role !== "member" && (
          <NavigationMenuItem>
            <Link to="/newrun" className={navigationMenuTriggerStyle()}>
              New Run
            </Link>
          </NavigationMenuItem>
        )}
        <NavigationMenuItem>
          <Link to="/faqs" className={navigationMenuTriggerStyle()}>
            FAQs
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/contact" className={navigationMenuTriggerStyle()}>
            Contact Us
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
