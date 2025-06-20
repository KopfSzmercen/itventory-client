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
import { CreateDepartmentModal } from "./CreateDepartmentModal";

interface Department {
  id: string;
  name: string;
  description?: string;
  manager: {
    id: string;
    fullName: string;
  };
}

export type DepartmentsResponse = Department[];

async function getDepartments(): Promise<DepartmentsResponse> {
  const response = await api.get("/department");
  return response.data;
}

export const getDepartmentsQueryOptions = queryOptions<DepartmentsResponse>({
  queryKey: ["departments"],
  queryFn: getDepartments
});

export default function DepartmentsTable() {
  const { data, isError, isLoading } = useSuspenseQuery(
    getDepartmentsQueryOptions
  );

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Działy</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTitle>Wystąpił błąd podczas pobierania działów</AlertTitle>
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
          <CardTitle>Działy</CardTitle>
          <CreateDepartmentModal />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]">ID</TableHead>
              <TableHead>Nazwa działu</TableHead>
              <TableHead>Opis</TableHead>
              <TableHead>Menadżer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((department) => (
              <TableRow key={department.id}>
                <TableCell className="font-medium">{department.id}</TableCell>
                <TableCell className="font-medium">{department.name}</TableCell>
                <TableCell>{department.description || "-"}</TableCell>
                <TableCell>
                  {department.manager ? (
                    <span>{department.manager.fullName}</span>
                  ) : (
                    "-"
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
