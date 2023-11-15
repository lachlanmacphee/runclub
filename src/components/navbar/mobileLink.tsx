import { Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";
import { User } from "@/lib/types";

// Components
import { DropdownMenuItem } from "../ui/dropdown-menu";

export function MobileLink({
  path,
  label,
  user,
  setter,
}: {
  path: string;
  label: string;
  user: User | null;
  setter: Dispatch<SetStateAction<boolean>>;
}) {
  if (user?.role === "member" && path == "/newrun") {
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
