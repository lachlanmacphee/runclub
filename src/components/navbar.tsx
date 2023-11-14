import { Link } from "react-router-dom";
import { usePocket } from "@/contexts";

// Components
import { DesktopNavMenu } from "./desktopNavMenu";
import { MobileNavMenu } from "./mobileNavMenu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "./mode-toggle";

// Icons
import { LogInOut } from "./logInOut";

export function Navbar() {
  const { user } = usePocket();

  return (
    <div className="flex justify-between py-4 px-8 items-center">
      <Link to="/" className="normal-case w-[190px] font-bold text-2xl">
        Gunn Runners
      </Link>
      <DesktopNavMenu />
      <div className="flex gap-3 justify-end w-[190px]">
        {user && (
          <Avatar>
            <AvatarImage src={user.avatar} />
            <AvatarFallback>Avatar</AvatarFallback>
          </Avatar>
        )}
        <ModeToggle />
        <LogInOut />
        <MobileNavMenu />
      </div>
    </div>
  );
}
