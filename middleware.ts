import { authConfig } from "@/auth.config";
import NextAuth from "next-auth";

const PUBLIC_ROUTES = ["/", "/login", "/register"];
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);

  // Allow public routes
  if (isPublicRoute) {
    return;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return Response.redirect(new URL("/login", nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
};
