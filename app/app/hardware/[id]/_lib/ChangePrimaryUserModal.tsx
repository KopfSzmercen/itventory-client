"use client";

import { SelectEmployeesFormInput } from "@/components/forms";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const changePrimaryUserSchema = z.object({
  userId: z.string().min(1, "Użytkownik jest wymagany")
});

type ChangePrimaryUserFormData = z.infer<typeof changePrimaryUserSchema>;

interface ChangePrimaryUserRequest {
  hardwareId: string;
  userId: string;
}

async function changePrimaryUser(
  data: ChangePrimaryUserRequest
): Promise<void> {
  await api.put("/hardware/primary-user", data);
}

interface ChangePrimaryUserModalProps {
  hardwareId: string;
  currentUserId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChangePrimaryUserModal({
  hardwareId,
  currentUserId,
  open,
  onOpenChange
}: ChangePrimaryUserModalProps) {
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ChangePrimaryUserFormData>({
    resolver: zodResolver(changePrimaryUserSchema),
    defaultValues: {
      userId: currentUserId || ""
    }
  });

  const changePrimaryUserMutation = useMutation({
    mutationFn: changePrimaryUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hardware", hardwareId] });
      queryClient.invalidateQueries({ queryKey: ["hardware"] });
      toast.success("Użytkownik główny został zmieniony pomyślnie");
      onOpenChange(false);
      reset();
    },
    //eslint-disable-next-line
    onError: (error: any) => {
      toast.error("Wystąpił błąd podczas zmiany użytkownika głównego");
      console.error("Error changing primary user:", error);
    }
  });

  const onSubmit = (data: ChangePrimaryUserFormData) => {
    const requestData: ChangePrimaryUserRequest = {
      hardwareId,
      userId: data.userId
    };
    changePrimaryUserMutation.mutate(requestData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Zmień użytkownika głównego</DialogTitle>
          <DialogDescription>
            Wybierz nowego użytkownika głównego dla tego sprzętu.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userId">Nowy użytkownik główny</Label>
            <Controller
              name="userId"
              control={control}
              render={({ field }) => (
                <SelectEmployeesFormInput
                  className="w-full"
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Wybierz użytkownika"
                />
              )}
            />
            {errors.userId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.userId.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Anuluj
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Zmienianie..." : "Zmień użytkownika"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
