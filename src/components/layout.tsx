import { Outlet } from "react-router-dom";
import { Navbar } from "./navbar";

export const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};
