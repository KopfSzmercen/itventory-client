"use client";

import {
  DatePickerFormInput,
  SelectAreasFormInput,
  SelectDepartmentsFormInput,
  SelectEmployeesFormInput,
  SelectRoomsFormInput,
  SelectSeniorityFormInput
} from "@/components/forms";
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
import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { getEmployeeQueryOptions } from "./EmployeeDetails";

const editEmployeeSchema = z.object({
  name: z.string().min(1, "Imię jest wymagane"),
  lastName: z.string().min(1, "Nazwisko jest wymagane"),
  area: z.string().min(1, "Obszar jest wymagany"),
  positionName: z.string().min(1, "Stanowisko jest wymagane"),
  seniority: z.string().min(1, "Staż jest wymagany"),
  managerId: z.string().optional(),
  departmentId: z.string().optional(),
  hireDate: z.date().optional(),
  birthDate: z.date().optional(),
  roomId: z.string().optional()
});

type EditEmployeeFormData = z.infer<typeof editEmployeeSchema>;

interface EditEmployeeRequest {
  name: string;
  lastName: string;
  area: string;
  positionName: string;
  seniority: string;
  managerId?: string;
  departmentId?: string;
  hireDate?: string;
  birthDate?: string;
  roomId?: string;
}

async function updateEmployee(
  employeeId: string,
  employeeData: EditEmployeeRequest
): Promise<void> {
  await api.put(`/employee/${employeeId}`, employeeData);
}

interface EditEmployeeModalProps {
  employeeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditEmployeeModal({
  employeeId,
  open,
  onOpenChange
}: EditEmployeeModalProps) {
  const queryClient = useQueryClient();

  const { data: employee } = useSuspenseQuery(
    getEmployeeQueryOptions(employeeId)
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    control
  } = useForm<EditEmployeeFormData>({
    resolver: zodResolver(editEmployeeSchema),
    defaultValues: {
      name: employee.name || "",
      lastName: employee.lastName || "",
      area: employee.area || "",
      positionName: employee.positionName || "",
      seniority: employee.seniority || "",
      managerId: employee.managerId || undefined,
      departmentId: employee.departmentId || undefined,
      hireDate: employee.hireDate ? new Date(employee.hireDate) : undefined,
      birthDate: employee.birthDate ? new Date(employee.birthDate) : undefined,
      roomId: employee.roomId || undefined
    }
  });

  const updateEmployeeMutation = useMutation({
    mutationFn: (data: EditEmployeeFormData) => {
      const requestData: EditEmployeeRequest = {
        name: data.name,
        lastName: data.lastName,
        area: data.area,
        positionName: data.positionName,
        seniority: data.seniority,
        managerId: data.managerId || undefined,
        departmentId: data.departmentId || undefined,
        hireDate: data.hireDate
          ? data.hireDate.toISOString().split("T")[0]
          : undefined,
        birthDate: data.birthDate
          ? data.birthDate.toISOString().split("T")[0]
          : undefined,
        roomId: data.roomId || undefined
      };
      return updateEmployee(employeeId, requestData);
    },
    onSuccess: () => {
      toast.success("Sukces", {
        description: "Dane pracownika zostały pomyślnie zaktualizowane"
      });
      queryClient.invalidateQueries({ queryKey: ["employee", employeeId] });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      onOpenChange(false);
    },
    onError: (error: unknown) => {
      const apiError = error as {
        response?: {
          status?: number;
          data?: { errors?: Record<string, string[]>; message?: string };
        };
      };
      if (
        apiError.response?.status === 400 &&
        apiError.response?.data?.errors
      ) {
        const serverErrors = apiError.response.data.errors;

        Object.keys(serverErrors).forEach((field) => {
          setError(field as keyof EditEmployeeFormData, {
            type: "server",
            message: serverErrors[field][0]
          });
        });
      } else {
        toast.error("Błąd", {
          description:
            apiError.response?.data?.message ||
            "Wystąpił błąd podczas aktualizacji danych pracownika"
        });
      }
    }
  });

  const onSubmit = async (data: EditEmployeeFormData) => {
    updateEmployeeMutation.mutate(data);
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edytuj dane pracownika</DialogTitle>
          <DialogDescription>
            Zaktualizuj informacje o pracowniku {employee.username}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Imię</Label>
              <Input
                {...register("name")}
                id="name"
                type="text"
                placeholder="Jan"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-destructive text-sm">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lastName">Nazwisko</Label>
              <Input
                {...register("lastName")}
                id="lastName"
                type="text"
                placeholder="Kowalski"
                className={errors.lastName ? "border-destructive" : ""}
              />
              {errors.lastName && (
                <p className="text-destructive text-sm">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Professional Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="area">Obszar</Label>
              <Controller
                name="area"
                control={control}
                render={({ field }) => (
                  <SelectAreasFormInput
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Wybierz obszar"
                    className={
                      errors.area
                        ? "border-destructive md:min-w-[200px]"
                        : "md:min-w-[200px]"
                    }
                  />
                )}
              />
              {errors.area && (
                <p className="text-destructive text-sm">
                  {errors.area.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="positionName">Stanowisko</Label>
              <Input
                {...register("positionName")}
                id="positionName"
                type="text"
                placeholder="Programista"
                className={errors.positionName ? "border-destructive" : ""}
              />
              {errors.positionName && (
                <p className="text-destructive text-sm">
                  {errors.positionName.message}
                </p>
              )}
            </div>
          </div>

          {/* Seniority */}
          <div className="min-w-[200px] grid gap-2">
            <Label htmlFor="seniority">Staż</Label>
            <Controller
              name="seniority"
              control={control}
              render={({ field }) => (
                <SelectSeniorityFormInput
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Wybierz staż"
                  className={
                    errors.seniority
                      ? "border-destructive min-w-[200px]"
                      : "min-w-[200px]"
                  }
                />
              )}
            />
            {errors.seniority && (
              <p className="text-destructive text-sm">
                {errors.seniority.message}
              </p>
            )}
          </div>

          {/* Manager and Department */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="managerId">Bezpośredni przełożony</Label>
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

            <div className="grid gap-2">
              <Label htmlFor="departmentId">Dział</Label>
              <Controller
                name="departmentId"
                control={control}
                render={({ field }) => (
                  <SelectDepartmentsFormInput
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Wybierz dział"
                    className={errors.departmentId ? "border-destructive" : ""}
                    enabled={open}
                  />
                )}
              />
              {errors.departmentId && (
                <p className="text-destructive text-sm">
                  {errors.departmentId.message}
                </p>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="birthDate">Data urodzenia</Label>
              <Controller
                name="birthDate"
                control={control}
                render={({ field }) => (
                  <DatePickerFormInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Wybierz datę urodzenia"
                    className={errors.birthDate ? "border-destructive" : ""}
                  />
                )}
              />
              {errors.birthDate && (
                <p className="text-destructive text-sm">
                  {errors.birthDate.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="hireDate">Data zatrudnienia</Label>
              <Controller
                name="hireDate"
                control={control}
                render={({ field }) => (
                  <DatePickerFormInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Wybierz datę zatrudnienia"
                    className={errors.hireDate ? "border-destructive" : ""}
                  />
                )}
              />
              {errors.hireDate && (
                <p className="text-destructive text-sm">
                  {errors.hireDate.message}
                </p>
              )}
            </div>
          </div>

          {/* Room */}
          <div className="grid gap-2">
            <Label htmlFor="roomId">Pomieszczenie</Label>
            <Controller
              name="roomId"
              control={control}
              render={({ field }) => (
                <SelectRoomsFormInput
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Wybierz pomieszczenie"
                  className={errors.roomId ? "border-destructive" : ""}
                  enabled={open}
                />
              )}
            />
            {errors.roomId && (
              <p className="text-destructive text-sm">
                {errors.roomId.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateEmployeeMutation.isPending}
            >
              Anuluj
            </Button>
            <Button type="submit" disabled={updateEmployeeMutation.isPending}>
              {updateEmployeeMutation.isPending
                ? "Aktualizuję..."
                : "Zapisz zmiany"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
