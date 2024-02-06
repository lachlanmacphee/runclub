import { usePocket } from "@/contexts";
import { ROLES, NAV_ROUTES } from "@/lib/constants";
import { useCallback } from "react";

export function useAccessiblePages() {
  const { user } = usePocket();

  const getPages = useCallback(() => {
    // If the user is not signed in, only show the public pages
    if (!user) {
      return NAV_ROUTES.filter((route) => !route.minRole);
    }

    // If a user is a member, show the public pages and member pages
    if (user.role === ROLES.MEMBER) {
      return NAV_ROUTES.filter(
        (route) => !route.minRole || route.minRole === ROLES.MEMBER
      );
    }

    // If a user is a moderator, show the public pages, member pages, and volunteer pages
    if (user.role === ROLES.MODERATOR) {
      return NAV_ROUTES.filter(
        (route) =>
          !route.minRole ||
          route.minRole === ROLES.MEMBER ||
          route.minRole === ROLES.MODERATOR
      );
    }

    // If a user is an admin, show all pages
    if (user.role === ROLES.ADMIN) {
      return NAV_ROUTES;
    }

    return NAV_ROUTES.filter((route) => !route.minRole);
  }, [user]);

  return { getPages };
}
