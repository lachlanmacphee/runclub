import { Navigate, Outlet } from "react-router-dom";

import { usePocket } from "../contexts";

export const RequireAuth = () => {
  const { user } = usePocket();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
