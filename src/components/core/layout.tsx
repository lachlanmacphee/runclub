import { Outlet } from "react-router-dom";
import { Navbar } from "../navbar/navbar";
import { Footer } from "./footer";

export const Layout = () => {
  return (
    <>
      <Navbar />
      <div className="p-6 min-h-[calc(100vh-72px)]">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};
