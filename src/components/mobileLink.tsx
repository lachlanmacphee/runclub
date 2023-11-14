import { Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";

// Components
import { DropdownMenuItem } from "./ui/dropdown-menu";

export function MobileLink({
  path,
  label,
  isLoggedIn,
  setter,
}: {
  path: string;
  label: string;
  isLoggedIn: boolean;
  setter: Dispatch<SetStateAction<boolean>>;
}) {
  if (!isLoggedIn && path == "/newrun") {
    return null;
  }
  return (
    <DropdownMenuItem>
      <Link to={path} onClick={() => setter(false)}>
        {label}
      </Link>
    </DropdownMenuItem>
  );
}
