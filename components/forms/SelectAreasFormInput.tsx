"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { forwardRef } from "react";

interface SelectAreasFormInputProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const areaOptions = [
  { value: "Accountings", label: "Accountings" },
  { value: "IT", label: "IT" },
  { value: "SupplyChain", label: "SupplyChain" },
  { value: "PMO", label: "PMO" },
  { value: "Manufacturing", label: "Manufacturing" }
];

export const SelectAreasFormInput = forwardRef<
  HTMLButtonElement,
  SelectAreasFormInputProps
>(
  (
    {
      value,
      onValueChange,
      placeholder = "Wybierz obszar",
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
          {areaOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
);

SelectAreasFormInput.displayName = "SelectAreasFormInput";
