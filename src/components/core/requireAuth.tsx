import type { ReactNode } from "react";
import { Redirect, useLocation } from "wouter";

import { usePocket } from "../../contexts";
import { useAccessiblePages } from "@/hooks/useAccessiblePages";

export const RequireAuth = ({ children }: { children?: ReactNode }) => {
  const { user } = usePocket();
  const { getPages } = useAccessiblePages();
  const [pathname] = useLocation();

  if (!user || !getPages().findIndex((page) => pathname === page.path)) {
    return <Redirect to="/" replace />;
  }

  return <>{children}</>;
};
