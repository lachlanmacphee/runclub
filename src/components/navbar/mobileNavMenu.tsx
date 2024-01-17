import { useState } from "react";

// Components
import { buttonVariants } from "../ui/button";
import { MobileLink } from "@/components/navbar/mobileLink";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Icons
import { Menu } from "lucide-react";
import { useAccessiblePages } from "@/hooks/useAccessiblePages";

export function MobileNavMenu() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { getPages } = useAccessiblePages();

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger
        className={
          buttonVariants({ variant: "outline", size: "icon" }) + " 2xl:hidden"
        }
      >
        <Menu className="h-[1.2rem] w-[1.2rem]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mt-1">
        {getPages().map((page) => (
          <MobileLink
            key={page.path}
            path={page.path}
            label={page.label}
            setter={setDropdownOpen}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
