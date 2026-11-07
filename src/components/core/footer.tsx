import Whatsapp from "@/components/icons/Whatsapp";
import { Facebook, Instagram } from "lucide-react";
import { Link } from "wouter";
import { buttonVariants } from "../ui/button";

const SocialLinks = () => (
  <>
    <a href="https://www.facebook.com/groups/1147699358622893/">
      <Facebook className="w-8 h-8" />
    </a>
    <a href="https://www.instagram.com/gunn.runners/">
      <Instagram className="w-8 h-8" />
    </a>
    <a href="https://chat.whatsapp.com/HLf0ViSAJD77iGmuWGMORV">
      <Whatsapp className="w-8 h-8 dark:fill-white" />
    </a>
  </>
);

export function Footer() {
  return (
    <footer className="gap-4 mb-4 mx-8 flex flex-wrap justify-between items-center">
      <div className="flex sm:hidden w-full justify-center gap-4">
        <SocialLinks />
      </div>
      <p>&copy; Gunn Runners</p>
      <div className="hidden sm:flex justify-center gap-4">
        <SocialLinks />
      </div>
      <Link href="/privacy" className={buttonVariants({ variant: "link" })}>
        Privacy Policy
      </Link>
    </footer>
  );
}
