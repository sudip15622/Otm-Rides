// proxy.ts — only this file needs changing
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = [
  "/profile",
  "/trips",
  "/account-settings",
  "/hosting",
  "/become-a-host",
];

const AUTH_ROUTES = ["/login-signup"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Must match the exact cookie name your NestJS backend sets
  const hasSession = request.cookies.has("refresh_token");

  // Exact prefix match — /profile matches, but /profiles or / does not
  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  const isAuth = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  if (!hasSession && isProtected) {
    const loginUrl = new URL("/login-signup", request.url);
    loginUrl.searchParams.set(
      "returnTo",
      request.nextUrl.pathname + request.nextUrl.search,
    );
    return NextResponse.redirect(loginUrl);
  }

  if (hasSession && isAuth) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
