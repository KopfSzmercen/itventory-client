import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      type: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" }
      },

      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(5) })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const backendRootUrl = process.env.BACKEND_ROOT_URL!;

        try {
          const signInResponse = await fetch(`${backendRootUrl}/login`, {
            method: "POST",
            body: JSON.stringify({
              email: parsedCredentials.data?.email,
              password: parsedCredentials.data?.password
            }),
            headers: {
              "Content-Type": "application/json"
            }
          });

          if (!signInResponse.ok) return null;

          const signInResult = (await signInResponse.json()) as {
            accessToken: string;
          };

          const getMeResponse = await fetch(
            `${backendRootUrl}/itventory/Identity/me`,
            {
              headers: {
                Authorization: `Bearer ${signInResult.accessToken}`
              }
            }
          );

          if (!getMeResponse.ok) return null;

          const getMeResult = (await getMeResponse.json()) as {
            id: string;
            email: string;
            username: string;
          };

          return {
            id: getMeResult.id,
            email: getMeResult.email,
            username: getMeResult.username,
            token: signInResult.accessToken
          };
        } catch (e) {
          console.error("Error during sign in:", e);
          return null;
        }
      }
    })
  ],
  callbacks: {
    session: async ({ session, token }) => {
      // Add property to session, so it's available in the client
      session.user.username = token.username as string;
      session.user.token = token.token as string;
      session.user.email = token.email as string;
      return session;
    },
    jwt: async ({ token, user }) => {
      // Add property to token, so it's available in the client
      if (user) {
        token.username = user.username;
        token.email = user.email;
        token.token = user.token;
      }
      return token;
    }
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET
});
