import { Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";

// Components
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { Circle } from "lucide-react";

export function MobileLink({
  path,
  label,
  notification,
  setter,
}: {
  path: string;
  label: string;
  notification: boolean;
  setter: Dispatch<SetStateAction<boolean>>;
}) {
  if (notification)
    return (
      <DropdownMenuItem>
        <Link
          to={path}
          className="w-full flex items-center gap-1"
          onClick={() => setter(false)}
        >
          <span>{label}</span>
          <Circle className="w-1 h-1 fill-red-500 stroke-red-500 animate-ping" />
        </Link>
      </DropdownMenuItem>
    );

  return (
    <DropdownMenuItem>
      <Link to={path} className="w-full" onClick={() => setter(false)}>
        {label}
      </Link>
    </DropdownMenuItem>
  );
}
