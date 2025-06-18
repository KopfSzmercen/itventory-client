"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Nieprawidłowy format email"),
  password: z.string().min(1, "Hasło jest wymagane")
});

export type ActionState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  error?: string;
};

export async function authenticate(
  prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState | undefined> {
  const validatedFields = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors
    };
  }

  const { email, password } = validatedFields.data;
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/"
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Nieprawidłowe dane logowania." };
        default:
          return { error: "Wystąpił błąd podczas logowania." };
      }
    }
    throw error;
  }
}
