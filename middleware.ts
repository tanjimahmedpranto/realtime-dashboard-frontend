// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/products", "/analytics"];
const COOKIE_NAME = "token";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // In production the backend is on a different domain,
  // so we cannot reliably read the auth cookie here.
  // We skip cookie-based protection and let the backend
  // enforce auth via 401 responses instead.
  if (process.env.NODE_ENV === "production") {
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // DEVELOPMENT ONLY: cookie-based protection when frontend + backend share localhost
  const token = req.cookies.get(COOKIE_NAME)?.value;

  const isProtected = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtected && !token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/" && token) {
    return NextResponse.redirect(new URL("/products", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/products/:path*", "/analytics/:path*", "/login"]
};
