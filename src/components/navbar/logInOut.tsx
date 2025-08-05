import { Button } from "../ui/button";
import { User2, LogOut } from "lucide-react";
import { buttonVariants } from "../ui/button";
import { usePocket } from "@/contexts";
import { Link } from "react-router-dom";

export function LogInOut() {
  const { user, logout } = usePocket();

  if (user) {
    return (
      <Button onClick={logout} variant="ghost" size="icon">
        <LogOut className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    );
  }

  return (
    <Link
      to="/login"
      className={buttonVariants({ variant: "ghost", size: "icon" })}
    >
      <User2 className="h-[1.2rem] w-[1.2rem]" />
    </Link>
  );
}
