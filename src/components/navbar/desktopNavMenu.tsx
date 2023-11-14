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
          <Link to="/latestrun" className={navigationMenuTriggerStyle()}>
            Latest Run
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/pastruns" className={navigationMenuTriggerStyle()}>
            Past Runs
          </Link>
        </NavigationMenuItem>
        {user && (
          <NavigationMenuItem>
            <Link to="/newrun" className={navigationMenuTriggerStyle()}>
              Create New Run
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
        <NavigationMenuItem>
          <Link to="/privacy" className={navigationMenuTriggerStyle()}>
            Privacy Policy
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
