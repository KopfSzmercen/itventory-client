"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SelectEmployeesFormInput,
  DomainSelectFormInput
} from "@/components/forms";
import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2Icon } from "lucide-react";

const addLogonSchema = z.object({
  userId: z.string().min(1, "Użytkownik jest wymagany"),
  domain: z.string().min(1, "Domena jest wymagana"),
  ipAddress: z
    .string()
    .min(1, "Adres IP jest wymagany")
    .regex(
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      "Nieprawidłowy format adresu IP"
    )
});

type AddLogonFormData = z.infer<typeof addLogonSchema>;

interface AddLogonRequest {
  hardwareId: string;
  userId: string;
  domain: string;
  ipAddress: string;
}

async function addLogon(data: AddLogonRequest): Promise<void> {
  await api.post("/hardware/logons", data);
}

interface AddLogonModalProps {
  hardwareId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddLogonModal({
  hardwareId,
  open,
  onOpenChange
}: AddLogonModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm<AddLogonFormData>({
    resolver: zodResolver(addLogonSchema),
    defaultValues: {
      userId: "",
      domain: "",
      ipAddress: ""
    }
  });

  const addLogonMutation = useMutation({
    mutationFn: addLogon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hardware", hardwareId] });
      queryClient.invalidateQueries({ queryKey: ["hardware"] });
      toast.success("Logowanie zostało dodane pomyślnie");
      onOpenChange(false);
      reset();
    },
    onError: (error: any) => {
      toast.error("Wystąpił błąd podczas dodawania logowania");
      console.error("Error adding logon:", error);
    }
  });

  const onSubmit = (data: AddLogonFormData) => {
    const requestData: AddLogonRequest = {
      hardwareId,
      ...data
    };
    addLogonMutation.mutate(requestData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Dodaj logowanie</DialogTitle>
          <DialogDescription>
            Dodaj nowe logowanie do tego sprzętu.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userId">Użytkownik</Label>
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

          <div className="space-y-2">
            <Label htmlFor="domain">Region</Label>
            <Controller
              name="domain"
              control={control}
              render={({ field }) => (
                <DomainSelectFormInput
                  className="w-full"
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Wybierz domenę"
                />
              )}
            />
            {errors.domain && (
              <p className="text-sm text-red-500 mt-1">
                {errors.domain.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ipAddress">Adres IP</Label>
            <Input
              id="ipAddress"
              {...register("ipAddress")}
              placeholder="192.168.1.1"
            />
            {errors.ipAddress && (
              <p className="text-sm text-red-500 mt-1">
                {errors.ipAddress.message}
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
            <Button type="submit" disabled={addLogonMutation.isPending}>
              {addLogonMutation.isPending && (
                <Loader2Icon className="animate-spin" />
              )}
              Dodaj logowanie
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
