import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login"
  },
  providers: [],
  debug: false
} satisfies NextAuthConfig;
