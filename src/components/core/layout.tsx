import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../navbar/navbar";
import { Footer } from "./footer";

export const Layout = () => {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  return (
    <>
      <Navbar />
      <div className={`${isHome ? "" : "p-6"} min-h-[calc(100vh-72px)]`}>
        <Outlet />
      </div>
      <Footer />
    </>
  );
};
