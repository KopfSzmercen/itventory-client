"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { forwardRef } from "react";

const domains = [
  { value: "northAmerica", label: "Ameryka Północna" },
  { value: "europe", label: "Europa" },
  { value: "asia", label: "Azja" },
  { value: "local", label: "Lokalny" }
];

interface DomainSelectFormInputProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const DomainSelectFormInput = forwardRef<
  HTMLButtonElement,
  DomainSelectFormInputProps
>(
  (
    {
      value,
      onValueChange,
      placeholder = "Wybierz domenę",
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
          {domains.map((domain) => (
            <SelectItem key={domain.value} value={domain.value}>
              {domain.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
);

DomainSelectFormInput.displayName = "DomainSelectFormInput";

export default DomainSelectFormInput;
