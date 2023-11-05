import { Link } from "react-router-dom";
import { usePocket } from "@/contexts";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { ModeToggle } from "./mode-toggle";

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
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/pastruns">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Past Runs
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/newrun">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                New Runs
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex gap-2">
        <Avatar>
          <AvatarImage src="https://yt3.googleusercontent.com/-CFTJHU7fEWb7BYEb6Jh9gm1EpetvVGQqtof0Rbh-VQRIznYYKJxCaqv_9HeBcmJmIsp2vOO9JU=s900-c-k-c0x00ffffff-no-rj" />
          <AvatarFallback>avtr</AvatarFallback>
        </Avatar>
        <ModeToggle />
        <Button onClick={logout} variant="outline" size="icon">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
