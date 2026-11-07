import type { ReactNode } from "react";
import { useLocation } from "wouter";
import { Navbar } from "../navbar/navbar";
import { Footer } from "./footer";

export const Layout = ({ children }: { children?: ReactNode }) => {
  const [pathname] = useLocation();
  const isHome = pathname === "/";
  return (
    <>
      <Navbar />
      <div className={`${isHome ? "" : "p-6"} min-h-[calc(100vh-72px)]`}>
        {children}
      </div>
      <Footer />
    </>
  );
};
