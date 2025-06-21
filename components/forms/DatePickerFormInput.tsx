"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

interface DatePickerFormInputProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DatePickerFormInput(props: DatePickerFormInputProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!props.value}
          className={`data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal ${props.className}`}
        >
          <CalendarIcon />
          {props.value ? (
            format(props.value, "PPP")
          ) : (
            <span>{props.placeholder || "Wybierz datę"}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={props.value}
          onSelect={props.onChange}
          disabled={props.disabled}
        />
      </PopoverContent>
    </Popover>
  );
}
