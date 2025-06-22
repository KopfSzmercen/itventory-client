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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { DatePickerFormInput } from "@/components/forms/DatePickerFormInput";
import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const addVersionSchema = z.object({
  versionNumber: z
    .string()
    .min(1, "Numer wersji jest wymagany")
    .min(1, "Numer wersji musi mieć co najmniej 1 znak"),
  price: z
    .number({
      required_error: "Cena jest wymagana",
      invalid_type_error: "Cena musi być liczbą"
    })
    .min(0, "Cena nie może być ujemna"),
  published: z.date({
    required_error: "Data publikacji jest wymagana"
  }),
  licenseType: z.enum(["perUser", "perComputer", "floating"], {
    required_error: "Typ licencji jest wymagany"
  })
});

type AddVersionFormData = z.infer<typeof addVersionSchema>;

interface AddVersionRequest {
  softwareId: string;
  versionNumber: string;
  price: number;
  published: string;
  licenseType: "perUser" | "perComputer" | "floating";
}

async function addSoftwareVersion(
  versionData: AddVersionRequest
): Promise<void> {
  await api.put("/software/version", versionData);
}

interface AddSoftwareVersionModalProps {
  softwareId: string;
}

export function AddSoftwareVersionModal({
  softwareId
}: AddSoftwareVersionModalProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    control,
    setValue,
    watch
  } = useForm<AddVersionFormData>({
    resolver: zodResolver(addVersionSchema),
    defaultValues: {
      versionNumber: "",
      price: 0,
      published: new Date(),
      licenseType: "perUser"
    }
  });

  const addVersionMutation = useMutation({
    mutationFn: addSoftwareVersion,
    onSuccess: () => {
      toast.success("Sukces", {
        description: "Wersja została pomyślnie dodana"
      });
      // Invalidate both software list and specific software queries
      queryClient.invalidateQueries({ queryKey: ["software"] });
      queryClient.invalidateQueries({ queryKey: ["software", softwareId] });
      reset();
      setOpen(false);
    },
    //eslint-disable-next-line
    onError: (error: any) => {
      if (error.response?.status === 400 && error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;

        if (serverErrors.versionNumber) {
          setError("versionNumber", {
            type: "server",
            message: serverErrors.versionNumber[0]
          });
        }
        if (serverErrors.price) {
          setError("price", {
            type: "server",
            message: serverErrors.price[0]
          });
        }
        if (serverErrors.published) {
          setError("published", {
            type: "server",
            message: serverErrors.published[0]
          });
        }
        if (serverErrors.licenseType) {
          setError("licenseType", {
            type: "server",
            message: serverErrors.licenseType[0]
          });
        }
      } else {
        toast.error("Błąd", {
          description:
            error.response?.data?.message ||
            "Wystąpił błąd podczas dodawania wersji"
        });
      }
    }
  });

  const onSubmit = async (data: AddVersionFormData) => {
    const requestData: AddVersionRequest = {
      softwareId,
      versionNumber: data.versionNumber,
      price: data.price,
      published: data.published.toISOString().split("T")[0], // Format as YYYY-MM-DD
      licenseType: data.licenseType
    };

    addVersionMutation.mutate(requestData);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      reset();
    }
  };

  const licenseTypeOptions = [
    { value: "perUser", label: "Per User" },
    { value: "perComputer", label: "Per Computer" },
    { value: "floating", label: "Floating" }
  ];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Dodaj wersję
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dodaj nową wersję</DialogTitle>
          <DialogDescription>
            Dodaj nową wersję do oprogramowania. Wypełnij wszystkie wymagane
            pola.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="versionNumber">Numer wersji</Label>
            <Input
              id="versionNumber"
              placeholder="np. 1.0.0"
              {...register("versionNumber")}
            />
            {errors.versionNumber && (
              <p className="text-sm text-red-500">
                {errors.versionNumber.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Cena (PLN)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Data publikacji</Label>
            <Controller
              name="published"
              control={control}
              render={({ field }) => (
                <DatePickerFormInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Wybierz datę publikacji"
                />
              )}
            />
            {errors.published && (
              <p className="text-sm text-red-500">{errors.published.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Typ licencji</Label>
            <Controller
              name="licenseType"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz typ licencji" />
                  </SelectTrigger>
                  <SelectContent>
                    {licenseTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.licenseType && (
              <p className="text-sm text-red-500">
                {errors.licenseType.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Anuluj
            </Button>
            <Button
              type="submit"
              disabled={addVersionMutation.isPending}
              className="min-w-[120px]"
            >
              {addVersionMutation.isPending ? "Dodawanie..." : "Dodaj wersję"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
