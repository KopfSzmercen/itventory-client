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
import { CreateUserModal } from "./CreateUserModal";

interface User {
  id: string;
  username: string;
  email: string;
}

export interface UsersResponse {
  users: User[];
}

async function getUsers(): Promise<UsersResponse> {
  const response = await api.get("/identity/users");
  return response.data;
}

export const getUsersQueryOptions = queryOptions<UsersResponse>({
  queryKey: ["users"],
  queryFn: getUsers
});

export default function UsersTable() {
  const { data, isError, isLoading } = useSuspenseQuery(getUsersQueryOptions);

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Użytkonicy</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTitle>
              Wystąpił błąd podczas pobierania użytkowników
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
          <CardTitle>Użytkonicy</CardTitle>
          <CreateUserModal />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]">ID</TableHead>
              <TableHead>Nazwa użykownika</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
