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

interface Manager {
  id: string;
  fullName: string;
  seniority: string;
  positionName: string;
}

interface Department {
  id: string;
  name: string;
  manager: Manager;
}

interface Room {
  id: string;
  officeId: string;
  roomName: string;
  floor: number;
  area: number;
  capacity: number;
  personResponsibleId: string;
  personResponsible: Manager;
}

interface Employee {
  id: string;
  username: string;
  name: string;
  lastName: string;
  isActive: boolean;
  area: string;
  positionName: string;
  seniority: string;
  managerId?: string;
  departmentId?: string;
  hireDate: string;
  birthDate: string;
  roomId?: string;
  manager?: Manager;
  department?: Department;
  room?: Room;
}

export type EmployeesResponse = Employee[];

async function getEmployees(): Promise<EmployeesResponse> {
  const response = await api.get("/employee");
  return response.data;
}

export const getEmployeesQueryOptions = queryOptions<EmployeesResponse>({
  queryKey: ["employees"],
  queryFn: getEmployees
});

export default function EmployeesTable() {
  const { data, isError, isLoading } = useSuspenseQuery(
    getEmployeesQueryOptions
  );

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pracownicy</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTitle>
              Wystąpił błąd podczas pobierania pracowników
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
    return <Skeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Pracownicy</CardTitle>
          {/* TODO: Add CreateEmployeeModal when needed */}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imię i nazwisko</TableHead>
              <TableHead>Stanowisko</TableHead>
              <TableHead>Staż</TableHead>
              <TableHead>Dział</TableHead>
              <TableHead>Menadżer</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">
                  {employee.name} {employee.lastName}
                </TableCell>
                <TableCell>{employee.positionName}</TableCell>
                <TableCell>{employee.seniority}</TableCell>
                <TableCell>
                  {employee.department ? employee.department.name : "-"}
                </TableCell>
                <TableCell>
                  {employee.manager ? employee.manager.fullName : "-"}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      employee.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {employee.isActive ? "Aktywny" : "Nieaktywny"}
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
