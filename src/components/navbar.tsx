import { Dispatch, SetStateAction, useState } from "react";
import { Link } from "react-router-dom";
import { usePocket } from "@/contexts";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "./ui/button";
import { LogIn, LogOut } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { mobileLinks } from "@/constants";

function MobileLink({
  path,
  label,
  setter,
}: {
  path: string;
  label: string;
  setter: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <DropdownMenuItem>
      <Link to={path} onClick={() => setter(false)}>
        {label}
      </Link>
    </DropdownMenuItem>
  );
}

export function Navbar() {
  const { user, logout } = usePocket();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="flex justify-between py-4 px-8 items-center">
      <Link to="/" className="normal-case w-[180px] font-bold text-2xl">
        Gunn Runners
      </Link>
      <NavigationMenu className="hidden lg:block">
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
            <Link to="/contactus" className={navigationMenuTriggerStyle()}>
              Contact Us
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex gap-3 justify-end w-[180px]">
        {user && (
          <Avatar>
            <AvatarImage src="https://yt3.googleusercontent.com/-CFTJHU7fEWb7BYEb6Jh9gm1EpetvVGQqtof0Rbh-VQRIznYYKJxCaqv_9HeBcmJmIsp2vOO9JU=s900-c-k-c0x00ffffff-no-rj" />
            <AvatarFallback>Avatar</AvatarFallback>
          </Avatar>
        )}
        <ModeToggle />
        {!user && (
          <Link
            to="/login"
            className={buttonVariants({ variant: "outline", size: "icon" })}
          >
            <LogIn className="h-[1.2rem] w-[1.2rem]" />
          </Link>
        )}
        {user && (
          <Button onClick={logout} variant="outline" size="icon">
            <LogOut className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        )}
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger className="lg:hidden">
            <Button variant="outline" size="icon">
              <HamburgerMenuIcon className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {mobileLinks.map((link) => (
              <MobileLink
                key={link.path}
                path={link.path}
                label={link.label}
                setter={setDropdownOpen}
              />
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
