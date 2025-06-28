"use client";

import { EditEmployeeModal } from "@/app/app/employees/[id]/_lib/EditEmployeeModal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Edit, User, Calendar, MapPin, Building, Users } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import type { Employee } from "./types";

// Re-export types for convenience
export type { Employee, Manager, Department, Room } from "./types";

async function getEmployee(id: string): Promise<Employee> {
  const response = await api.get(`/employee/${id}`);
  return response.data;
}

export const getEmployeeQueryOptions = (id: string) =>
  queryOptions<Employee>({
    queryKey: ["employee", id],
    queryFn: () => getEmployee(id)
  });

interface EmployeeDetailsProps {
  employeeId: string;
}

export function EmployeeDetails({ employeeId }: EmployeeDetailsProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const router = useRouter();

  const {
    data: employee,
    isError,
    isLoading
  } = useSuspenseQuery(getEmployeeQueryOptions(employeeId));

  if (isError) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Szczegóły pracownika</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertTitle>
                Wystąpił błąd podczas pobierania danych pracownika
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
        onClick={() => router.push("/app/employees")}
        className="mb-4"
      >
        Powrót
      </Button>
      {/* Header Card */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="h-6 w-6" />
              <CardTitle>Szczegóły pracownika</CardTitle>
            </div>
            <Button onClick={() => setIsEditModalOpen(true)} className="gap-2">
              <Edit className="h-4 w-4" />
              Edytuj
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Podstawowe informacje</h3>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Nazwa użytkownika:</span>
                  <span>{employee.username}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="font-medium">Imię:</span>
                  <span>{employee.name || "Nie podano"}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="font-medium">Nazwisko:</span>
                  <span>{employee.lastName || "Nie podano"}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="font-medium">Status:</span>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      employee.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {employee.isActive ? "Aktywny" : "Nieaktywny"}
                  </span>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informacje zawodowe</h3>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Obszar:</span>
                  <span>{employee.area || "Nie podano"}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="font-medium">Stanowisko:</span>
                  <span>{employee.positionName || "Nie podano"}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="font-medium">Staż:</span>
                  <span>{employee.seniority || "Nie podano"}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dates Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <CardTitle>Daty</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-2">
              <span className="font-medium">Data urodzenia:</span>
              <span>
                {employee.birthDate
                  ? new Date(employee.birthDate).toLocaleDateString("pl-PL")
                  : "Nie podano"}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-medium">Data zatrudnienia:</span>
              <span>
                {employee.hireDate
                  ? new Date(employee.hireDate).toLocaleDateString("pl-PL")
                  : "Nie podano"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Department Card */}
      {employee.department && (
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
                <span>{employee.department.name}</span>
              </div>

              {employee.department.manager && (
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Manager działu:</span>
                  <span>{employee.department.manager.fullName}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Manager Card */}
      {employee.manager && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <CardTitle>Bezpośredni przełożony</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Imię i nazwisko:</span>
                <span>{employee.manager.fullName}</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-medium">Stanowisko:</span>
                <span>{employee.manager.positionName}</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-medium">Staż:</span>
                <span>{employee.manager.seniority}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Room Card */}
      {employee.room && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <CardTitle>Pomieszczenie</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Nazwa pomieszczenia:</span>
                <span>{employee.room.roomName}</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-medium">Piętro:</span>
                <span>{employee.room.floor}</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-medium">Powierzchnia:</span>
                <span>{employee.room.area} m²</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-medium">Pojemność:</span>
                <span>{employee.room.capacity} osób</span>
              </div>

              {employee.room.personResponsible && (
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Osoba odpowiedzialna:</span>
                  <span>{employee.room.personResponsible.fullName}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Modal */}
      <EditEmployeeModal
        employeeId={employeeId}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
      />
    </div>
  );
}
