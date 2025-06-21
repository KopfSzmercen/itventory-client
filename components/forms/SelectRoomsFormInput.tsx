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

interface PersonResponsible {
  id: string;
  fullName: string;
  seniority: string;
  positionName: string;
}

interface Room {
  id: string;
  officeId: string;
  roomName: string;
  floor: number;
  area: number;
  capacity: number;
  personResponsibleId: string;
  personResponsible: PersonResponsible;
}

type RoomsResponse = Room[];

async function getRooms(): Promise<RoomsResponse> {
  const response = await api.get("/room");
  return response.data;
}

interface SelectRoomsFormInputProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  enabled?: boolean; // Controls when to fetch data
}

export const SelectRoomsFormInput = forwardRef<
  HTMLButtonElement,
  SelectRoomsFormInputProps
>(
  (
    {
      value,
      onValueChange,
      placeholder = "Wybierz pokój",
      className,
      disabled = false,
      enabled = true
    },
    ref
  ) => {
    const {
      data: rooms,
      isLoading: roomsLoading,
      isError: roomsError
    } = useQuery({
      queryKey: ["rooms"],
      queryFn: getRooms,
      enabled
    });

    return (
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger ref={ref} className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {roomsLoading && (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              Ładowanie pokoi...
            </div>
          )}
          {roomsError && (
            <div className="px-2 py-1.5 text-sm text-destructive">
              Błąd podczas ładowania pokoi
            </div>
          )}
          {rooms && rooms.length === 0 && (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              Brak dostępnych pokoi
            </div>
          )}
          {rooms?.map((room) => (
            <SelectItem key={room.id} value={room.id}>
              {room.roomName} (Piętro {room.floor})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
);

SelectRoomsFormInput.displayName = "SelectRoomsFormInput";
