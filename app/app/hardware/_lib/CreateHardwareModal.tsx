"use client";

import {
  DatePickerFormInput,
  ProducentAndModelFormInput,
  SelectDepartmentsFormInput,
  SelectEmployeesFormInput,
  SelectRoomsFormInput
} from "@/components/forms";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createHardwareSchema = z.object({
  primaryUserId: z.string().min(1, "Użytkownik jest wymagany"),
  defaultDomain: z.string().min(1, "Domena jest wymagana"),
  hardwareType: z.string().min(1, "Typ sprzętu jest wymagany"),
  description: z.string().min(1, "Opis jest wymagany"),
  worth: z.number().min(0, "Wartość musi być większa lub równa 0"),
  producentId: z.string().min(1, "Producent jest wymagany"),
  modelId: z.string().min(1, "Model jest wymagany"),
  modelYear: z
    .number()
    .min(1900, "Rok produkcji musi być większy niż 1900")
    .max(
      new Date().getFullYear() + 1,
      "Rok produkcji nie może być w przyszłości"
    ),
  serialNumber: z.string().min(1, "Numer seryjny jest wymagany"),
  purchasedDate: z.date(),
  roomId: z.string().min(1, "Pokój jest wymagany"),
  departmentId: z.string().min(1, "Dział jest wymagany")
});

type CreateHardwareFormData = z.infer<typeof createHardwareSchema>;

interface CreateHardwareRequest {
  primaryUserId: string;
  defaultDomain: string;
  hardwareType: string;
  description: string;
  worth: number;
  producentId: string;
  modelId: string;
  modelYear: number;
  serialNumber: string;
  purchasedDate: string;
  roomId: string;
  departmentId: string;
}

async function createHardware(
  hardwareData: CreateHardwareRequest
): Promise<void> {
  await api.post("/hardware", hardwareData);
}

const hardwareTypes = [
  { value: "personal", label: "Prywatny" },
  { value: "shared", label: "Współdzielony" },
  { value: "server", label: "Serwer" },
  { value: "network", label: "Sieciowy" },
  { value: "peripheral", label: "Peryferyjny" }
];

const domains = [
  { value: "northAmerica", label: "Ameryka Północna" },
  { value: "europe", label: "Europa" },
  { value: "asia", label: "Azja" },
  { value: "local", label: "Lokalny" }
];

export function CreateHardwareModal() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset
  } = useForm<CreateHardwareFormData>({
    resolver: zodResolver(createHardwareSchema),
    defaultValues: {
      worth: 0,
      modelYear: new Date().getFullYear(),
      purchasedDate: new Date()
    }
  });

  const createHardwareMutation = useMutation({
    mutationFn: createHardware,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hardware"] });
      toast.success("Sprzęt został dodany pomyślnie");
      setOpen(false);
      reset();
    },
    //eslint-disable-next-line
    onError: (error: any) => {
      toast.error("Wystąpił błąd podczas dodawania sprzętu");
      console.error("Error creating hardware:", error);
    }
  });

  const onSubmit = (data: CreateHardwareFormData) => {
    const requestData: CreateHardwareRequest = {
      ...data,
      purchasedDate: data.purchasedDate.toISOString().split("T")[0]
    };
    createHardwareMutation.mutate(requestData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Dodaj sprzęt
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Dodaj nowy sprzęt</DialogTitle>
          <DialogDescription>
            Wypełnij formularz, aby dodać nowy sprzęt do systemu.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="hardwareType">Typ sprzętu</Label>
              <Controller
                name="hardwareType"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Wybierz typ sprzętu" />
                    </SelectTrigger>
                    <SelectContent>
                      {hardwareTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.hardwareType && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.hardwareType.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="defaultDomain">Region</Label>
              <Controller
                name="defaultDomain"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Wybierz domenę" />
                    </SelectTrigger>
                    <SelectContent>
                      {domains.map((domain) => (
                        <SelectItem key={domain.value} value={domain.value}>
                          {domain.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.defaultDomain && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.defaultDomain.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Opis</Label>
            <Input
              id="description"
              {...register("description")}
              placeholder="Opis sprzętu"
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="serialNumber">Numer seryjny</Label>
              <Input
                id="serialNumber"
                {...register("serialNumber")}
                placeholder="Numer seryjny"
              />
              {errors.serialNumber && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.serialNumber.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="worth">Wartość (zł)</Label>
              <Input
                id="worth"
                type="number"
                step="0.01"
                {...register("worth", { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.worth && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.worth.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="modelYear">Rok produkcji</Label>
              <Input
                id="modelYear"
                type="number"
                {...register("modelYear", { valueAsNumber: true })}
                placeholder="2024"
              />
              {errors.modelYear && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.modelYear.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="purchasedDate">Data zakupu</Label>
              <Controller
                name="purchasedDate"
                control={control}
                render={({ field }) => (
                  <DatePickerFormInput
                    className="w-full"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Wybierz datę zakupu"
                  />
                )}
              />
              {errors.purchasedDate && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.purchasedDate.message}
                </p>
              )}
            </div>
          </div>

          <Controller
            name="producentId"
            control={control}
            render={({ field: producentField }) => (
              <Controller
                name="modelId"
                control={control}
                render={({ field: modelField }) => (
                  <ProducentAndModelFormInput
                    producentValue={producentField.value}
                    modelValue={modelField.value}
                    onProducentChange={(value) => {
                      producentField.onChange(value);
                      modelField.onChange("");
                    }}
                    onModelChange={modelField.onChange}
                  />
                )}
              />
            )}
          />
          {(errors.producentId || errors.modelId) && (
            <div className="space-y-1">
              {errors.producentId && (
                <p className="text-sm text-red-500">
                  {errors.producentId.message}
                </p>
              )}
              {errors.modelId && (
                <p className="text-sm text-red-500">{errors.modelId.message}</p>
              )}
            </div>
          )}

          <div>
            <Label htmlFor="primaryUserId">Użytkownik główny</Label>
            <Controller
              name="primaryUserId"
              control={control}
              render={({ field }) => (
                <SelectEmployeesFormInput
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Wybierz użytkownika"
                  className="w-full"
                />
              )}
            />
            {errors.primaryUserId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.primaryUserId.message}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="departmentId">Dział</Label>
              <Controller
                name="departmentId"
                control={control}
                render={({ field }) => (
                  <SelectDepartmentsFormInput
                    className="w-full"
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Wybierz dział"
                  />
                )}
              />
              {errors.departmentId && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.departmentId.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="roomId">Pokój</Label>
              <Controller
                name="roomId"
                control={control}
                render={({ field }) => (
                  <SelectRoomsFormInput
                    className="w-full"
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Wybierz pokój"
                  />
                )}
              />
              {errors.roomId && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.roomId.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Anuluj
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Dodawanie..." : "Dodaj sprzęt"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
