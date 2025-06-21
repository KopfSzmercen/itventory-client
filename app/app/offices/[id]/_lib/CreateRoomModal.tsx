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
import { getOfficeRoomsQueryOptions } from "@/app/app/offices/[id]/_lib/OfficeRoomsTable";
import { useSearchParams } from "next/navigation";

const createRoomSchema = z.object({
  name: z
    .string()
    .min(1, "Nazwa pokoju jest wymagana")
    .min(2, "Nazwa pokoju musi mieć co najmniej 2 znaki"),
  floor: z
    .number({ invalid_type_error: "Piętro musi być liczbą" })
    .int("Piętro musi być liczbą całkowitą")
    .min(0, "Piętro nie może być ujemne")
    .max(10, "Piętro nie może przekraczać 10"),
  area: z
    .number({ invalid_type_error: "Powierzchnia musi być liczbą" })
    .min(5, "Powierzchnia pokoju musi wynosić co najmniej 5 m²")
    .max(2000, "Powierzchnia pokoju nie może przekraczać 1000 m²"),
  capacity: z
    .number({ invalid_type_error: "Pojemność musi być liczbą" })
    .int("Pojemność musi być liczbą całkowitą")
    .min(0, "Pojemność nie może być ujemna"),
  personResponsible: z.string()
});

type CreateRoomFormData = z.infer<typeof createRoomSchema>;

interface CreateRoomRequest {
  officeId: string;
  name: string;
  floor: number;
  area: number;
  capacity: number;
  personResponsible?: string;
}

async function createRoom(roomData: CreateRoomRequest): Promise<void> {
  await api.post("/room", roomData);
}

interface CreateRoomModalProps {
  officeId: string;
}

export function CreateRoomModal({ officeId }: CreateRoomModalProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const roomName = searchParams.get("RoomName") || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    control
  } = useForm<CreateRoomFormData>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: "",
      floor: 0,
      area: 0,
      capacity: 0,
      personResponsible: ""
    }
  });

  const createRoomMutation = useMutation({
    mutationFn: createRoom,
    onSuccess: () => {
      toast.success("Sukces", {
        description: "Pokój został pomyślnie utworzony"
      });
      queryClient.invalidateQueries({
        queryKey: getOfficeRoomsQueryOptions(officeId, roomName).queryKey
      });
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
        if (serverErrors.floor) {
          setError("floor", {
            type: "server",
            message: serverErrors.floor[0]
          });
        }
        if (serverErrors.area) {
          setError("area", {
            type: "server",
            message: serverErrors.area[0]
          });
        }
        if (serverErrors.capacity) {
          setError("capacity", {
            type: "server",
            message: serverErrors.capacity[0]
          });
        }
        if (serverErrors.personResponsible) {
          setError("personResponsible", {
            type: "server",
            message: serverErrors.personResponsible[0]
          });
        }
      } else {
        toast.error("Błąd", {
          description:
            error.response?.data?.message ||
            "Wystąpił błąd podczas tworzenia pokoju"
        });
      }
    }
  });

  const onSubmit = async (data: CreateRoomFormData) => {
    const roomData: CreateRoomRequest = {
      officeId,
      name: data.name,
      floor: data.floor,
      area: data.area,
      capacity: data.capacity,
      ...(data.personResponsible && {
        personResponsible: data.personResponsible
      })
    };
    createRoomMutation.mutate(roomData);
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
          Dodaj pokój
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dodaj nowy pokój</DialogTitle>
          <DialogDescription>
            Wypełnij formularz poniżej, aby utworzyć nowy pokój w biurze.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nazwa pokoju</Label>
            <Input
              {...register("name")}
              id="name"
              type="text"
              placeholder="np. Sala konferencyjna A, Biuro 101"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="floor">Piętro</Label>
              <Input
                {...register("floor", { valueAsNumber: true })}
                id="floor"
                type="number"
                min="0"
                placeholder="0"
                className={errors.floor ? "border-destructive" : ""}
              />
              {errors.floor && (
                <p className="text-destructive text-sm">
                  {errors.floor.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="capacity">Pojemność</Label>
              <Input
                {...register("capacity", { valueAsNumber: true })}
                id="capacity"
                type="number"
                min="0"
                placeholder="10"
                className={errors.capacity ? "border-destructive" : ""}
              />
              {errors.capacity && (
                <p className="text-destructive text-sm">
                  {errors.capacity.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="area">Powierzchnia (m²)</Label>
            <Input
              {...register("area", { valueAsNumber: true })}
              id="area"
              type="number"
              min="0"
              step="0.1"
              placeholder="25.5"
              className={errors.area ? "border-destructive" : ""}
            />
            {errors.area && (
              <p className="text-destructive text-sm">{errors.area.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="personResponsible">Osoba odpowiedzialna</Label>
            <Controller
              name="personResponsible"
              control={control}
              render={({ field }) => (
                <SelectEmployeesFormInput
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Wybierz osobę odpowiedzialną"
                  className={
                    errors.personResponsible ? "border-destructive" : ""
                  }
                  enabled={open}
                />
              )}
            />
            {errors.personResponsible && (
              <p className="text-destructive text-sm">
                {errors.personResponsible.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createRoomMutation.isPending}
            >
              Anuluj
            </Button>
            <Button type="submit" disabled={createRoomMutation.isPending}>
              {createRoomMutation.isPending ? "Tworzenie..." : "Utwórz pokój"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
