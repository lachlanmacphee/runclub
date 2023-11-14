import { useState } from "react";
import { usePocket } from "@/contexts";
import { mobileLinks } from "@/lib/constants";

// Components
import { buttonVariants } from "../ui/button";
import { MobileLink } from "@/components/navbar/mobileLink";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Icons
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

export function MobileNavMenu() {
  const { user } = usePocket();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger
        className={
          buttonVariants({ variant: "outline", size: "icon" }) + " xl:hidden"
        }
      >
        <HamburgerMenuIcon className="h-[1.2rem] w-[1.2rem]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {mobileLinks.map((link) => (
          <MobileLink
            key={link.path}
            path={link.path}
            label={link.label}
            isLoggedIn={!!user}
            setter={setDropdownOpen}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
