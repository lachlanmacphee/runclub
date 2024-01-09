import { Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";

// Components
import { DropdownMenuItem } from "../ui/dropdown-menu";

export function MobileLink({
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
      <Link to={path} className="w-full" onClick={() => setter(false)}>
        {label}
      </Link>
    </DropdownMenuItem>
  );
}
