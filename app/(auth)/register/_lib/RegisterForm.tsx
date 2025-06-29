"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import handleApiError from "@/lib/handleApiError";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email jest wymagany")
      .email("Nieprawidłowy format email"),
    password: z.string().min(5, "Hasło musi mieć co najmniej 8 znaków"),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są zgodne",
    path: ["confirmPassword"]
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const registerApiRequest = async (data: RegisterFormData) => {
  try {
    await api.post("/Identity", {
      email: data.email,
      password: data.password,
      username: data.email
    });
    return "Rejestracja przebiegła pomyślnie!";
  } catch (error) {
    const message = handleApiError(error);
    return message;
  }
};

const useRegisterMutation = () => {
  return useMutation<string, Error, RegisterFormData>({
    mutationFn: registerApiRequest,
    retry: false
  });
};

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const registerMutation = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerMutation.mutateAsync(data);
      reset();
      toast.success("Rejestracja przebiegła pomyślnie!", {
        description: "Możesz się teraz zalogować używając swoich danych."
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Wystąpił błąd";
      setError("root", {
        type: "manual",
        message: "Wystąpił błąd podczas rejestracji"
      });
      toast.error("Błąd rejestracji", {
        description: "Spróbuj ponownie później." + message
      });
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Rejestracja</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Wprowadź swoje dane poniżej, aby utworzyć konto
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

        <div className="grid gap-3">
          <Label htmlFor="confirmPassword">Potwierdź hasło</Label>
          <Input
            {...register("confirmPassword")}
            id="confirmPassword"
            type="password"
            placeholder="Potwierdź hasło"
            className={errors.confirmPassword ? "border-destructive" : ""}
          />
          {errors.confirmPassword && (
            <p className="text-destructive text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={isSubmitting || registerMutation.isPending}
        >
          {isSubmitting || registerMutation.isPending
            ? "Rejestrowanie..."
            : "Zarejestruj się"}
        </Button>
      </div>

      <div className="text-center text-sm">
        Masz już konto?{" "}
        <a href="/login" className="underline underline-offset-4">
          Zaloguj się
        </a>
      </div>
    </form>
  );
}
