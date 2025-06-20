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

interface Employee {
  id: string;
  username: string;
}

type EmployeesResponse = Employee[];

async function getEmployees(): Promise<EmployeesResponse> {
  const response = await api.get("/employee");
  return response.data;
}

interface SelectEmployeesFormInputProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  enabled?: boolean; // Controls when to fetch data
}

export const SelectEmployeesFormInput = forwardRef<
  HTMLButtonElement,
  SelectEmployeesFormInputProps
>(
  (
    {
      value,
      onValueChange,
      placeholder = "Wybierz pracownika",
      className,
      disabled = false,
      enabled = true
    },
    ref
  ) => {
    const {
      data: employees,
      isLoading: employeesLoading,
      isError: employeesError
    } = useQuery({
      queryKey: ["employees"],
      queryFn: getEmployees,
      enabled
    });

    return (
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger ref={ref} className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {employeesLoading && (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              Ładowanie pracowników...
            </div>
          )}
          {employeesError && (
            <div className="px-2 py-1.5 text-sm text-destructive">
              Błąd podczas ładowania pracowników
            </div>
          )}
          {employees && employees.length === 0 && (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              Brak dostępnych pracowników
            </div>
          )}
          {employees?.map((employee) => (
            <SelectItem key={employee.id} value={employee.id}>
              {employee.username}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
);

SelectEmployeesFormInput.displayName = "SelectEmployeesFormInput";
