"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useRouter } from "nextjs-toploader/app";
import { CreateHardwareModal } from "./CreateHardwareModal";

interface PrimaryUser {
  id: string;
  fullName: string;
  seniority: string;
  positionName: string;
}

interface Producent {
  id: string;
  name: string;
  countryName: string;
}

interface Model {
  id: string;
  name: string;
  producentId: string;
  releaseDate: string;
  comments: string;
  producent: Producent;
}

interface Room {
  roomName: string;
  floor: number;
}

interface Department {
  id: string;
  name: string;
  manager: {
    id: string;
    fullName: string;
    seniority: string;
    positionName: string;
  };
}

interface Hardware {
  id: string;
  primaryUserId: string;
  defaultDomain: string;
  hardwareType: string;
  isActive: boolean;
  description: string;
  worth: number;
  producentId: string;
  modelId: string;
  modelYear: number;
  serialNumber: string;
  purchasedDate: string;
  roomId: string;
  departmentId: string;
  primaryUser: PrimaryUser;
  producent: Producent;
  model: Model;
  room: Room;
  department: Department;
}

export type HardwareResponse = Hardware[];

async function getHardware(): Promise<HardwareResponse> {
  const response = await api.get("/hardware");
  return response.data;
}

export const getHardwareQueryOptions = queryOptions<HardwareResponse>({
  queryKey: ["hardware"],
  queryFn: getHardware
});

export default function HardwareTable() {
  const router = useRouter();
  const { data, isError, isLoading } = useSuspenseQuery(
    getHardwareQueryOptions
  );

  const handleHardwareClick = (hardwareId: string) => {
    router.push(`/app/hardware/${hardwareId}`);
  };

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sprzęt</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTitle>Wystąpił błąd podczas pobierania sprzętu</AlertTitle>
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
    return <Skeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Sprzęt</CardTitle>
          <CreateHardwareModal />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Typ sprzętu</TableHead>
              <TableHead>Producent</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Numer seryjny</TableHead>
              <TableHead>Użytkownik</TableHead>
              <TableHead>Dział</TableHead>
              <TableHead>Pokój</TableHead>
              <TableHead>Wartość</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((hardware) => (
              <TableRow
                key={hardware.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleHardwareClick(hardware.id)}
              >
                <TableCell className="font-medium">
                  {hardware.hardwareType}
                </TableCell>
                <TableCell>{hardware.producent?.name || "-"}</TableCell>
                <TableCell>{hardware.model?.name || "-"}</TableCell>
                <TableCell>{hardware.serialNumber || "-"}</TableCell>
                <TableCell>{hardware.primaryUser?.fullName || "-"}</TableCell>
                <TableCell>{hardware.department?.name || "-"}</TableCell>
                <TableCell>
                  {hardware.room
                    ? `${hardware.room.roomName} (piętro ${hardware.room.floor})`
                    : "-"}
                </TableCell>
                <TableCell>
                  {hardware.worth
                    ? `${hardware.worth.toLocaleString("pl-PL")} zł`
                    : "-"}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      hardware.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {hardware.isActive ? "Aktywny" : "Nieaktywny"}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
