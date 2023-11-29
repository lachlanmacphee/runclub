import { Facebook, Instagram } from "lucide-react";
import { FaMeetup } from "react-icons/fa";
import { Link } from "react-router-dom";
import { buttonVariants } from "./ui/button";

const Links = () => (
  <>
    <Link to="">
      <Facebook className="w-8 h-8" />
    </Link>
    <Link to="">
      <Instagram className="w-8 h-8" />
    </Link>
    <Link to="">
      <FaMeetup className="w-8 h-8" />
    </Link>
  </>
);

export function Footer() {
  return (
    <footer className="gap-4 mb-4 mx-8 flex flex-wrap justify-between items-center">
      <div className="flex sm:hidden w-full justify-center gap-4">
        <Links />
      </div>
      <p className="font-bold">&copy; Gunn Runners</p>
      <div className="hidden sm:flex justify-center gap-4">
        <Links />
      </div>
      <Link to="/privacy" className={buttonVariants({ variant: "link" })}>
        Privacy Policy
      </Link>
    </footer>
  );
}
