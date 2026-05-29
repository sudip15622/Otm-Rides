// proxy.ts — only this file needs changing
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import { isAuthRoute, isProtectedRoute } from "@/lib/routes";
import { isAuthRoute, isProtectedRoute } from "./lib/routes";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Must match the exact cookie name your NestJS backend sets
  const hasSession = request.cookies.has("refresh_token");

  // Exact prefix match — /profile matches, but /profiles or / does not
  const isProtected = isProtectedRoute(pathname);
  const isAuth = isAuthRoute(pathname);

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
