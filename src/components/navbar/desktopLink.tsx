import { Link } from "react-router-dom";
import {
  NavigationMenuItem,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { Circle, Dot } from "lucide-react";

export function DesktopLink({
  path,
  label,
  notification,
}: {
  path: string;
  label: string;
  notification: boolean;
}) {
  if (notification)
    return (
      <NavigationMenuItem>
        <div className="relative">
          <Link to={path} className={navigationMenuTriggerStyle()}>
            {label}
          </Link>
          <Circle className="fill-red-500 stroke-red-500 w-2 h-2 absolute top-2 right-2" />
          <Circle className="fill-red-500 stroke-red-500 w-2 h-2 absolute top-2 right-2 animate-ping opacity-75" />
        </div>
      </NavigationMenuItem>
    );

  return (
    <NavigationMenuItem>
      <Link to={path} className={navigationMenuTriggerStyle()}>
        {label}
      </Link>
    </NavigationMenuItem>
  );
}
