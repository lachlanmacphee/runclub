import { Navigate, Outlet, useLocation } from "react-router-dom";

import { usePocket } from "../../contexts";
import { useAccessiblePages } from "@/hooks/useAccessiblePages";

export const RequireAuth = () => {
  const { user } = usePocket();
  const { getPages } = useAccessiblePages();
  const { pathname } = useLocation();

  if (!user || !getPages().findIndex((page) => pathname === page.path)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
