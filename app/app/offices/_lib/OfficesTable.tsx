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
import { useRouter } from "next/navigation";

interface Office {
  id: string;
  street: string;
  buildingNumber: string;
  fullAddress: string;
  locationId: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  location: {
    id: string;
    countryId: string;
    countryName: string;
    name: string;
    zipCode: string;
    city: string;
    latitude: number;
    longitude: number;
    typeOfPlant: string;
  };
}

export type OfficesResponse = Office[];

async function getOffices(): Promise<OfficesResponse> {
  const response = await api.get("/office");
  return response.data;
}

export const getOfficesQueryOptions = queryOptions<OfficesResponse>({
  queryKey: ["offices"],
  queryFn: getOffices
});

export default function OfficesTable() {
  const router = useRouter();
  const { data, isError, isLoading } = useSuspenseQuery(getOfficesQueryOptions);

  const handleRowClick = (officeId: string) => {
    router.push(`/app/offices/${officeId}`);
  };

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Biura</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTitle>Wystąpił błąd podczas pobierania biur</AlertTitle>
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
          <CardTitle>Biura</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]">ID</TableHead>
              <TableHead>Adres</TableHead>
              <TableHead>Miasto</TableHead>
              <TableHead>Kraj</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((office) => (
              <TableRow
                key={office.id}
                className="cursor-pointer transition-colors"
                onClick={() => handleRowClick(office.id)}
              >
                <TableCell className="font-medium">{office.id}</TableCell>
                <TableCell className="font-medium">
                  {office.fullAddress ||
                    `${office.street} ${office.buildingNumber}`}
                </TableCell>
                <TableCell>{office.location.city}</TableCell>
                <TableCell>{office.location.countryName}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      office.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {office.isActive ? "Aktywne" : "Nieaktywne"}
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
