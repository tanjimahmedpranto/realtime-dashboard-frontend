import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/products", "/analytics"];
const COOKIE_NAME = "token"; // must match backend cookie name

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;

  const isProtected = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  // Not logged in but trying to access protected route
  if (isProtected && !token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Already logged in, visiting root -> go to /products
  if (pathname === "/" && token) {
    return NextResponse.redirect(new URL("/products", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/products/:path*", "/analytics/:path*", "/login"],
};
