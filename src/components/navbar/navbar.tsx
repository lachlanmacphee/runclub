import { Link } from "react-router-dom";

// Components
import { DesktopNavMenu } from "./desktopNavMenu";
import { MobileNavMenu } from "./mobileNavMenu";
import { AvatarIconModal } from "./avatar";
import { ModeToggle } from "./mode-toggle";
import { LogInOut } from "./logInOut";

export function Navbar() {
  return (
    <div className="flex justify-between py-4 px-8 items-center">
      <Link to="/" className="normal-case font-bold text-2xl">
        Gunn Runners
      </Link>
      <DesktopNavMenu />
      <div className="flex gap-3 justify-end">
        <AvatarIconModal />
        <span className="hidden xl:block">
          <ModeToggle />
        </span>
        <LogInOut />
        <MobileNavMenu />
      </div>
    </div>
  );
}
