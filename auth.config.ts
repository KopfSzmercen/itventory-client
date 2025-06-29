import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
    signOut: "/"
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      // Check if user is authenticated
      const isAuthenticated = !!auth?.user;
      const isOnLogin = nextUrl.pathname.startsWith("/login");
      const isOnRegister = nextUrl.pathname.startsWith("/register");
      const isOnHome = nextUrl.pathname === "/";

      // Allow access to login and register pages when not authenticated
      if (!isAuthenticated && (isOnLogin || isOnRegister || isOnHome)) {
        return true;
      }

      // Redirect to login if not authenticated and trying to access protected routes
      if (!isAuthenticated) {
        return false;
      }

      // Redirect to app if authenticated and trying to access login/register
      if (isAuthenticated && (isOnLogin || isOnRegister)) {
        return Response.redirect(new URL("/app", nextUrl));
      }

      return true;
    }
  },
  providers: [],
  debug: true
} satisfies NextAuthConfig;
