export const PROTECTED_ROUTES = [
  "/profile",
  "/trips",
  "/account-settings",
  "/hosting",
  "/become-a-host",
];

export const AUTH_ROUTES = ["/login-signup"];

export const isRouteMatch = (pathname: string, route: string) =>
  pathname === route || pathname.startsWith(route + "/");

export const isProtectedRoute = (pathname: string) =>
  PROTECTED_ROUTES.some((route) => isRouteMatch(pathname, route));

export const isAuthRoute = (pathname: string) =>
  AUTH_ROUTES.some((route) => isRouteMatch(pathname, route));
