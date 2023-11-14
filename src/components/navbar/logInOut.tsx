import { Button } from "../ui/button";
import { LogIn, LogOut } from "lucide-react";
import { buttonVariants } from "../ui/button";
import { usePocket } from "@/contexts";
import { Link } from "react-router-dom";

export function LogInOut() {
  const { user, logout } = usePocket();

  if (user) {
    return (
      <Button onClick={logout} variant="outline" size="icon">
        <LogOut className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    );
  }

  return (
    <Link
      to="/login"
      className={buttonVariants({ variant: "outline", size: "icon" })}
    >
      <LogIn className="h-[1.2rem] w-[1.2rem]" />
    </Link>
  );
}
