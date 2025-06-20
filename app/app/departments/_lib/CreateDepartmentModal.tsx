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
import { SelectEmployeesFormInput } from "@/components/forms/SelectEmployeesFormInput";
import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createDepartmentSchema = z.object({
  name: z
    .string()
    .min(1, "Nazwa działu jest wymagana")
    .min(2, "Nazwa działu musi mieć co najmniej 2 znaki"),
  managerId: z.string().min(1, "Manager jest wymagany")
});

type CreateDepartmentFormData = z.infer<typeof createDepartmentSchema>;

interface CreateDepartmentRequest {
  name: string;
  managerId: string;
}

async function createDepartment(
  departmentData: CreateDepartmentRequest
): Promise<void> {
  await api.post("/department", departmentData);
}

export function CreateDepartmentModal() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    control
  } = useForm<CreateDepartmentFormData>({
    resolver: zodResolver(createDepartmentSchema),
    defaultValues: {
      name: "",
      managerId: ""
    }
  });

  const createDepartmentMutation = useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      toast.success("Sukces", {
        description: "Dział został pomyślnie utworzony"
      });
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      reset();
      setOpen(false);
    },
    onError: (error: any) => {
      if (error.response?.status === 400 && error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;

        if (serverErrors.name) {
          setError("name", {
            type: "server",
            message: serverErrors.name[0]
          });
        }
        if (serverErrors.managerId) {
          setError("managerId", {
            type: "server",
            message: serverErrors.managerId[0]
          });
        }
      } else {
        toast.error("Błąd", {
          description:
            error.response?.data?.message ||
            "Wystąpił błąd podczas tworzenia działu"
        });
      }
    }
  });

  const onSubmit = async (data: CreateDepartmentFormData) => {
    createDepartmentMutation.mutate(data);
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
          Dodaj dział
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dodaj nowy dział</DialogTitle>
          <DialogDescription>
            Wypełnij formularz poniżej, aby utworzyć nowy dział.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nazwa działu</Label>
            <Input
              {...register("name")}
              id="name"
              type="text"
              placeholder="np. IT, HR, Księgowość"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="managerId">Manager działu</Label>
            <Controller
              name="managerId"
              control={control}
              render={({ field }) => (
                <SelectEmployeesFormInput
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Wybierz managera"
                  className={errors.managerId ? "border-destructive" : ""}
                  enabled={open}
                />
              )}
            />
            {errors.managerId && (
              <p className="text-destructive text-sm">
                {errors.managerId.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createDepartmentMutation.isPending}
            >
              Anuluj
            </Button>
            <Button type="submit" disabled={createDepartmentMutation.isPending}>
              {createDepartmentMutation.isPending
                ? "Tworzenie..."
                : "Utwórz dział"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
