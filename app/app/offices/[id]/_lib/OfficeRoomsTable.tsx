"use client";

import { CreateRoomModal } from "@/app/app/offices/[id]/_lib/CreateRoomModal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import api from "@/lib/api";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

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
  personResponsible: PersonResponsible | null;
}

export type RoomsResponse = Room[];

async function getOfficeRooms(
  officeId: string,
  roomName?: string
): Promise<RoomsResponse> {
  const params = new URLSearchParams();
  params.append("OfficeId", officeId);

  if (roomName && roomName.trim()) {
    params.append("RoomName", roomName.trim());
  }

  const response = await api.get(`/room?${params.toString()}`);
  return response.data;
}

export const getOfficeRoomsQueryOptions = (
  officeId: string,
  roomName?: string
) =>
  queryOptions<RoomsResponse>({
    queryKey: ["rooms", "office", officeId, roomName],
    queryFn: () => getOfficeRooms(officeId, roomName)
  });

interface OfficeRoomsTableProps {
  officeId: string;
}

export default function OfficeRoomsTable({ officeId }: OfficeRoomsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("RoomName") || ""
  );

  const updateSearchParams = useCallback(
    (roomName: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (roomName.trim()) {
        params.set("RoomName", roomName.trim());
      } else {
        params.delete("RoomName");
      }

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const handleSearch = useCallback(
    (value: string) => {
      setSearchTerm(value);

      // Debounce the search to avoid too many API calls
      const timeoutId = setTimeout(() => {
        updateSearchParams(value);
      }, 300);

      return () => clearTimeout(timeoutId);
    },
    [updateSearchParams]
  );

  const { data, isError, isLoading, refetch } = useSuspenseQuery(
    getOfficeRoomsQueryOptions(
      officeId,
      searchParams.get("RoomName") || undefined
    )
  );

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pomieszczenia</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTitle>
              Wystąpił błąd podczas pobierania pomieszczeń
            </AlertTitle>
            <AlertDescription>
              Sprawdź połączenie z internetem lub spróbuj ponownie później.
              Jeśli problem będzie się powtarzał, skontaktuj się z
              administratorem.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return <Skeleton className="w-full h-64" />;
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center flex-wrap md:flex-nowrap gap-4">
            <CardTitle>Pomieszczenia ({data.length})</CardTitle>
            <CardAction className="flex items-center space-x-2 flex-wrap md:flex-nowrap gap-2">
              <Input
                placeholder="Nazwa pokoju..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="max-w-sm"
              />
              <CreateRoomModal officeId={officeId} refetch={refetch} />
            </CardAction>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>Brak pomieszczeń w tym biurze</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center flex-wrap md:flex-nowrap gap-4">
          <CardTitle>Pomieszczenia ({data.length})</CardTitle>
          <CardAction className="flex items-center space-x-2 flex-wrap md:flex-nowrap gap-2">
            <Input
              placeholder="Nazwa pokoju..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="max-w-sm"
            />
            <CreateRoomModal officeId={officeId} refetch={refetch} />
          </CardAction>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nazwa pomieszczenia</TableHead>
              <TableHead>Piętro</TableHead>
              <TableHead>Powierzchnia (m²)</TableHead>
              <TableHead>Pojemność</TableHead>
              <TableHead>Osoba odpowiedzialna</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((room) => (
              <TableRow key={room.id} className="transition-colors">
                <TableCell className="font-medium">{room.roomName}</TableCell>
                <TableCell>{room.floor}</TableCell>
                <TableCell>{room.area}</TableCell>
                <TableCell>{room.capacity}</TableCell>
                <TableCell>
                  {room.personResponsible ? (
                    <div className="space-y-1">
                      <p className="font-medium">
                        {room.personResponsible.fullName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {room.personResponsible.positionName}
                      </p>
                      {room.personResponsible.seniority && (
                        <p className="text-xs text-gray-400">
                          {room.personResponsible.seniority}
                        </p>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400">Brak przypisania</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
