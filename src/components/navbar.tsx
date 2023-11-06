import { Link } from "react-router-dom";
import { usePocket } from "@/contexts";

import {
  NavigationMenu,
  NavigationMenuItem,
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
    <div className="flex justify-between py-4 px-8 items-center bg-base-100">
      <Link to="/dashboard" className="normal-case font-bold text-2xl">
        Gunn Runners
      </Link>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link to="/dashboard" className={navigationMenuTriggerStyle()}>
              Dashboard
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/pastruns" className={navigationMenuTriggerStyle()}>
              Past Runs
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/newrun" className={navigationMenuTriggerStyle()}>
              New Runs
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex gap-3">
        <Avatar>
          <AvatarImage src="https://yt3.googleusercontent.com/-CFTJHU7fEWb7BYEb6Jh9gm1EpetvVGQqtof0Rbh-VQRIznYYKJxCaqv_9HeBcmJmIsp2vOO9JU=s900-c-k-c0x00ffffff-no-rj" />
          <AvatarFallback>avtr</AvatarFallback>
        </Avatar>
        <ModeToggle />
        <Button onClick={logout} variant="outline" size="icon">
          <LogOut className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </div>
    </div>
  );
}
