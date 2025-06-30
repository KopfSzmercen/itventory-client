import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth?.user;

  const isOnLogin = nextUrl.pathname.startsWith("/login");
  const isOnRegister = nextUrl.pathname.startsWith("/register");
  const isOnApp = nextUrl.pathname.startsWith("/app");
  const isOnHome = nextUrl.pathname === "/";

  // Redirect authenticated users away from login/register pages
  if (isAuthenticated && (isOnLogin || isOnRegister)) {
    return NextResponse.redirect(new URL("/app", nextUrl));
  }

  // Redirect unauthenticated users from app routes to login
  if (!isAuthenticated && isOnApp) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  // Match all paths except API routes, static files, and images
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ]
};
