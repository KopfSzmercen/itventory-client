"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
import {
  Activity,
  Building,
  Calendar,
  DollarSign,
  Globe,
  Hash,
  MapPin,
  Monitor,
  Users
} from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import { AddLogonModal } from "./AddLogonModal";
import { ChangePrimaryUserModal } from "./ChangePrimaryUserModal";
import type { HardwareDetails as HardwareDetailsType } from "./types";

// Re-export types for convenience
export type {
  Department,
  HardwareDetails as HardwareDetailsType,
  Logon,
  Manager,
  Model,
  PrimaryUser,
  Producent,
  Room
} from "./types";

async function getHardware(id: string): Promise<HardwareDetailsType> {
  const response = await api.get(`/hardware/${id}`);
  return response.data;
}

export const getHardwareQueryOptions = (id: string) =>
  queryOptions<HardwareDetailsType>({
    queryKey: ["hardware", id],
    queryFn: () => getHardware(id)
  });

interface HardwareDetailsProps {
  hardwareId: string;
}

export function HardwareDetails({ hardwareId }: HardwareDetailsProps) {
  const router = useRouter();

  const {
    data: hardware,
    isError,
    isLoading
  } = useSuspenseQuery(getHardwareQueryOptions(hardwareId));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddLogonModalOpen, setIsAddLogonModalOpen] = useState(false);

  if (isError) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Szczegóły sprzętu</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertTitle>
                Wystąpił błąd podczas pobierania danych sprzętu
              </AlertTitle>
              <AlertDescription>
                Sprawdź połączenie z internetem lub spróbuj ponownie później.
                Jeśli problem będzie się powtarzał, skontaktuj się z
                administratorem.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  return (
    <div className="space-y-6 w-full">
      <Button
        variant="outline"
        onClick={() => router.push("/app/hardware")}
        className="mb-4"
      >
        Powrót
      </Button>

      {/* Header Card */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Monitor className="h-6 w-6" />
              <CardTitle>Szczegóły sprzętu</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  hardware.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {hardware.isActive ? "Aktywny" : "Nieaktywny"}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Podstawowe informacje</h3>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Typ sprzętu:</span>
                  <span>{hardware.hardwareType}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Hash className="h-4 w-4" />
                  <span className="font-medium">Numer seryjny:</span>
                  <span>{hardware.serialNumber}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <span className="font-medium">Domena:</span>
                  <span>{hardware.defaultDomain}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="font-medium">Opis:</span>
                  <span>{hardware.description || "Brak opisu"}</span>
                </div>
              </div>
            </div>

            {/* Technical Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informacje techniczne</h3>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Producent:</span>
                  <span>
                    {hardware.producent?.name} (
                    {hardware.producent?.countryName})
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="font-medium">Model:</span>
                  <span>{hardware.model?.name}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="font-medium">Rok produkcji:</span>
                  <span>{hardware.modelYear}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-medium">Wartość:</span>
                  <span>{hardware.worth?.toLocaleString("pl-PL")} zł</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <CardTitle>Informacje o zakupie</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <span className="font-medium">Data zakupu:</span>
            <span>
              {hardware.purchasedDate
                ? new Date(hardware.purchasedDate).toLocaleDateString("pl-PL")
                : "Nie podano"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Primary User Card */}
      {hardware.primaryUser && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <CardTitle>Użytkownik główny</CardTitle>
              </div>
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsModalOpen(true)}
              >
                Zmień użytkownika
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Imię i nazwisko:</span>
                <span>{hardware.primaryUser.fullName}</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-medium">Stanowisko:</span>
                <span>{hardware.primaryUser.positionName}</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-medium">Staż:</span>
                <span>{hardware.primaryUser.seniority}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Department Card */}
      {hardware.department && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <CardTitle>Dział</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Nazwa działu:</span>
                <span>{hardware.department.name}</span>
              </div>

              {hardware.department.manager && (
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Manager działu:</span>
                  <span>{hardware.department.manager.fullName}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Room Card */}
      {hardware.room && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <CardTitle>Lokalizacja</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Pokój:</span>
                <span>{hardware.room.roomName}</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-medium">Piętro:</span>
                <span>{hardware.room.floor}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Model Details Card */}
      {hardware.model && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Monitor className="h-5 w-5" />
              <CardTitle>Szczegóły modelu</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Data produkcji:</span>
                <span>
                  {hardware.model.releaseDate
                    ? new Date(hardware.model.releaseDate).toLocaleDateString(
                        "pl-PL"
                      )
                    : "Nie podano"}
                </span>
              </div>

              {hardware.model.comments && (
                <div className="flex items-start space-x-2">
                  <span className="font-medium">Komentarze:</span>
                  <span>{hardware.model.comments}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Logons Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <CardTitle>Historia logowań</CardTitle>
            </div>
            <Button size="sm" onClick={() => setIsAddLogonModalOpen(true)}>
              Dodaj logowanie
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {hardware.logons && hardware.logons.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Użytkownik</TableHead>
                  <TableHead>Domena</TableHead>
                  <TableHead>Adres IP</TableHead>
                  <TableHead>Data logowania</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hardware.logons.map((logon) => (
                  <TableRow key={logon.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{logon.user.fullName}</div>
                        <div className="text-sm text-muted-foreground">
                          {logon.user.positionName}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{logon.domain}</TableCell>
                    <TableCell>{logon.ipAddress}</TableCell>
                    <TableCell>
                      {new Date(logon.logonTime).toLocaleString("pl-PL")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">
              Brak logowań dla tego sprzętu.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Change Primary User Modal */}
      <ChangePrimaryUserModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        hardwareId={hardwareId}
        currentUserId={hardware.primaryUser?.id}
      />

      {/* Add Logon Modal */}
      <AddLogonModal
        hardwareId={hardwareId}
        open={isAddLogonModalOpen}
        onOpenChange={setIsAddLogonModalOpen}
      />
    </div>
  );
}
