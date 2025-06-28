import axios from "axios";
import { auth, signOut } from "@/auth";
import { getSession } from "next-auth/react";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BACKEND_ROOT_URL + "/itventory" ||
    "http://localhost:5104/itventory",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use(
  async (config) => {
    try {
      let session;

      if (typeof window !== "undefined") {
        session = await getSession();
      } else {
        // Server-side: use auth() function
        session = await auth();
      }

      if (session?.user?.token) {
        config.headers.Authorization = `Bearer ${session.user.token}`;
      } else {
        console.log("No token found in session");
      }
    } catch (error) {
      console.warn("Failed to get session for API request:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      try {
        if (typeof window !== "undefined") {
          // Client-side: use signOut from next-auth/react
          const { signOut: clientSignOut } = await import("next-auth/react");
          await clientSignOut({ redirect: false });
          window.location.href = "/";
        } else {
          // Server-side: use signOut from auth.ts
          await signOut({ redirect: false });
        }
      } catch (signOutError) {
        console.error("Failed to sign out on 401 error:", signOutError);
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
