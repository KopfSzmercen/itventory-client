"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { forwardRef } from "react";

interface Manager {
  id: string;
  fullName: string;
  seniority: string | null;
  positionName: string | null;
}

interface Department {
  id: string;
  name: string;
  manager: Manager;
}

type DepartmentsResponse = Department[];

async function getDepartments(): Promise<DepartmentsResponse> {
  const response = await api.get("/department");
  return response.data;
}

interface SelectDepartmentsFormInputProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  enabled?: boolean; // Controls when to fetch data
}

export const SelectDepartmentsFormInput = forwardRef<
  HTMLButtonElement,
  SelectDepartmentsFormInputProps
>(
  (
    {
      value,
      onValueChange,
      placeholder = "Wybierz dział",
      className,
      disabled = false,
      enabled = true
    },
    ref
  ) => {
    const {
      data: departments,
      isLoading: departmentsLoading,
      isError: departmentsError
    } = useQuery({
      queryKey: ["departments"],
      queryFn: getDepartments,
      enabled
    });

    return (
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger ref={ref} className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {departmentsLoading && (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              Ładowanie działów...
            </div>
          )}
          {departmentsError && (
            <div className="px-2 py-1.5 text-sm text-destructive">
              Błąd podczas ładowania działów
            </div>
          )}
          {departments && departments.length === 0 && (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              Brak dostępnych działów
            </div>
          )}
          {departments?.map((department) => (
            <SelectItem key={department.id} value={department.id}>
              {department.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
);

SelectDepartmentsFormInput.displayName = "SelectDepartmentsFormInput";
