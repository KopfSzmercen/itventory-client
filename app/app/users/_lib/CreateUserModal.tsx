"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createUserSchema = z.object({
  username: z
    .string()
    .min(1, "Nazwa użytkownika jest wymagana")
    .min(3, "Nazwa użytkownika musi mieć co najmniej 3 znaki"),
  email: z
    .string()
    .min(1, "Email jest wymagany")
    .email("Nieprawidłowy format email"),
  password: z
    .string()
    .min(1, "Hasło jest wymagane")
    .min(6, "Hasło musi mieć co najmniej 6 znaków")
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
}

async function createUser(userData: CreateUserRequest): Promise<void> {
  await api.post("/identity", userData);
}

export function CreateUserModal() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  });

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success("Sukces", {
        description: "Użytkownik został pomyślnie utworzony"
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      reset();
      setOpen(false);
    },
    onError: (error: any) => {
      if (error.response?.status === 400 && error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;

        if (serverErrors.username) {
          setError("username", {
            type: "server",
            message: serverErrors.username[0]
          });
        }
        if (serverErrors.email) {
          setError("email", {
            type: "server",
            message: serverErrors.email[0]
          });
        }
        if (serverErrors.password) {
          setError("password", {
            type: "server",
            message: serverErrors.password[0]
          });
        }
      } else {
        toast.error("Błąd", {
          description:
            error.response?.data?.message ||
            "Wystąpił błąd podczas tworzenia użytkownika"
        });
      }
    }
  });

  const onSubmit = async (data: CreateUserFormData) => {
    createUserMutation.mutate(data);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Dodaj użytkownika
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dodaj nowego użytkownika</DialogTitle>
          <DialogDescription>
            Wypełnij formularz poniżej, aby utworzyć nowe konto użytkownika.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Nazwa użytkownika</Label>
            <Input
              {...register("username")}
              id="username"
              type="text"
              placeholder="np. jankowalski"
              className={errors.username ? "border-destructive" : ""}
            />
            {errors.username && (
              <p className="text-destructive text-sm">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              {...register("email")}
              id="email"
              type="email"
              placeholder="jan.kowalski@firma.com"
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-destructive text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-2">
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

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createUserMutation.isPending}
            >
              Anuluj
            </Button>
            <Button type="submit" disabled={createUserMutation.isPending}>
              {createUserMutation.isPending
                ? "Tworzenie..."
                : "Utwórz użytkownika"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
