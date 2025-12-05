// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "token"; // must match backend

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;

  const isLoginRoute = pathname === "/login";

  // Allow Next static assets through (handled by config.matcher below too)
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // Not logged in → only /login is allowed
  if (!token && !isLoginRoute) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Logged in → going to /login should bounce to /products
  if (token && isLoginRoute) {
    const productsUrl = new URL("/products", req.url);
    return NextResponse.redirect(productsUrl);
  }

  // Everything else is fine
  return NextResponse.next();
}

export const config = {
  // Run on every route except static assets
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
