import { usePocket } from "@/contexts";

// Components
import { Link } from "react-router-dom";
import { buttonVariants } from "../ui/button";
import { User2 } from "lucide-react";

export function AvatarIconModal() {
  const { user } = usePocket();

  if (!user) return null;

  return (
    <Link
      to="/account"
      className={buttonVariants({ variant: "ghost", size: "icon" })}
    >
      <User2 className="h-[1.2rem] w-[1.2rem]" />
    </Link>
  );
}
