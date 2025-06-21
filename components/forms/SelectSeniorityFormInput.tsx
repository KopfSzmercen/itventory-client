"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { forwardRef } from "react";

interface SelectSeniorityFormInputProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const seniorityOptions = [
  { value: "Manager", label: "Manager" },
  { value: "Junior", label: "Junior" },
  { value: "Regular", label: "Regular" },
  { value: "Senior", label: "Senior" },
  { value: "Architect", label: "Architect" }
];

export const SelectSeniorityFormInput = forwardRef<
  HTMLButtonElement,
  SelectSeniorityFormInputProps
>(
  (
    {
      value,
      onValueChange,
      placeholder = "Wybierz staż",
      className,
      disabled = false
    },
    ref
  ) => {
    return (
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger ref={ref} className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {seniorityOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
);

SelectSeniorityFormInput.displayName = "SelectSeniorityFormInput";
