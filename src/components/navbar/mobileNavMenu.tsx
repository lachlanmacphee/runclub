import { useState } from "react";

// Components
import { buttonVariants } from "../ui/button";
import { MobileLink } from "@/components/navbar/mobileLink";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

// Icons
import { Menu } from "lucide-react";
import { useAccessiblePages } from "@/hooks/useAccessiblePages";

export function MobileNavMenu({ notifications }: { notifications: string[] }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { getPages } = useAccessiblePages();

  return (
    <Drawer open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DrawerTrigger
        className={
          buttonVariants({ variant: "outline", size: "icon" }) + " 2xl:hidden"
        }
      >
        <Menu className="h-[1.2rem] w-[1.2rem]" />
      </DrawerTrigger>
      <DrawerContent className="pb-4 px-4">
        <DrawerHeader>
          <DrawerTitle className="text-center">Menu</DrawerTitle>
        </DrawerHeader>
        <div className="grid grid-cols-2 gap-4">
          {getPages().map((page) => (
            <MobileLink
              key={page.path}
              path={page.path}
              label={page.label}
              notification={notifications.includes(page.label)}
              setter={setDropdownOpen}
            />
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
