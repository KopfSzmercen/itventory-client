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

      // Allow access to login and register pages when not authenticated
      if (!isAuthenticated && (isOnLogin || isOnRegister)) {
        return true;
      }

      // Redirect to login if not authenticated and trying to access protected routes
      if (!isAuthenticated) {
        return false;
      }

      // Redirect to home if authenticated and trying to access login/register
      if (isAuthenticated && (isOnLogin || isOnRegister)) {
        return Response.redirect(new URL("/", nextUrl));
      }

      return true;
    }
  },
  providers: [],
  debug: true
} satisfies NextAuthConfig;
