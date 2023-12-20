import { Navigate, Outlet, useLocation } from "react-router-dom";

import { usePocket } from "../contexts";

export const RequireAuth = () => {
  const { user } = usePocket();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (
    user?.role === "member" &&
    ["/newrun", "/volunteer"].includes(location.pathname)
  ) {
    return <Navigate to="/" replace />;
  }

  if (user?.role !== "admin" && location.pathname === "/manage") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
