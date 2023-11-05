import { Navigate, Outlet } from "react-router-dom";

import { usePocket } from "../contexts";
import { Navbar } from "./navbar";

export const RequireAuth = () => {
  const { user } = usePocket();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};
