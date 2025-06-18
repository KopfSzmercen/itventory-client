"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useActionState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { authenticate } from "./actions";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email jest wymagany")
    .email("Nieprawidłowy format email"),
  password: z.string().min(1, "Hasło jest wymagane")
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [state, formAction] = useActionState(authenticate, undefined);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  // Handle server-side errors
  React.useEffect(() => {
    if (state?.error) {
      toast.error("Błąd logowania", {
        description: state.error
      });
    }
    if (state?.errors) {
      if (state.errors.email) {
        setError("email", {
          type: "server",
          message: state.errors.email[0]
        });
      }
      if (state.errors.password) {
        setError("password", {
          type: "server",
          message: state.errors.password[0]
        });
      }
    }
  }, [state, setError]);

  const onSubmit = async (data: LoginFormData) => {
    startTransition(() => {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      formAction(formData);
    });
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Logowanie</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Wprowadź swoje dane poniżej, aby się zalogować
        </p>
      </div>

      {/* Display form-level errors */}
      {errors.root && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
          {errors.root.message}
        </div>
      )}

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            {...register("email")}
            id="email"
            type="email"
            placeholder="m@przyklad.com"
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && (
            <p className="text-destructive text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="grid gap-3">
          <Label htmlFor="password">Hasło</Label>
          <Input
            {...register("password")}
            id="password"
            type="password"
            placeholder="Wprowadź hasło"
            className={errors.password ? "border-destructive" : ""}
          />
          {errors.password && (
            <p className="text-destructive text-sm">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={isPending}
        >
          {isPending ? "Logowanie..." : "Zaloguj się"}
        </Button>
      </div>

      <div className="text-center text-sm">
        Nie masz konta?{" "}
        <a href="/register" className="underline underline-offset-4">
          Zarejestruj się
        </a>
      </div>
    </form>
  );
}
