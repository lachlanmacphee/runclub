import { Link } from "react-router-dom";
import { usePocket } from "@/contexts";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function Navbar() {
  const { logout } = usePocket();

  return (
    <div className="flex h-[50px] justify-between p-2 bg-base-100">
      <Link to="/dashboard" className="normal-case text-xl">
        Gunn Runners
      </Link>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link to="/dashboard">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Dashboard
              </NavigationMenuLink>
            </Link>
            <Link to="/pastruns">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Past Runs
              </NavigationMenuLink>
            </Link>
            <Link to="/newrun">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                New Runs
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex gap-2">
        <div className="w-10 rounded-full">
          <img src="https://yt3.googleusercontent.com/-CFTJHU7fEWb7BYEb6Jh9gm1EpetvVGQqtof0Rbh-VQRIznYYKJxCaqv_9HeBcmJmIsp2vOO9JU=s900-c-k-c0x00ffffff-no-rj" />
        </div>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
