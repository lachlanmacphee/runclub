import { Outlet } from "react-router-dom";
import { Navbar } from "./navbar";

export const Layout = () => {
  return (
    <>
      <Navbar />
      <div className="p-8">
        <Outlet />
      </div>
    </>
  );
};
