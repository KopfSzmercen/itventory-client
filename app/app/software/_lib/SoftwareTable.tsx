"use client";

import CreateSoftwareModal from "@/app/app/software/_lib/CreateSoftwareModal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
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

interface SoftwareVersion {
  id: string;
  versionNumber: string;
  softwareId: string;
  price: number;
  published: string;
  isDefault: boolean;
  isApproved: boolean;
  isActive: boolean;
  licenseType: string;
}

interface Publisher {
  id: string;
  name: string;
  countryName: string;
}

interface Software {
  id: string;
  name: string;
  publisherId: string;
  approvalType: string;
  publisher: Publisher;
  versions: SoftwareVersion[];
}

export type SoftwareResponse = Software[];

async function getSoftware(): Promise<SoftwareResponse> {
  const response = await api.get("/software");
  return response.data;
}

export const getSoftwareQueryOptions = queryOptions<SoftwareResponse>({
  queryKey: ["software"],
  queryFn: getSoftware
});

export default function SoftwareTable() {
  const router = useRouter();
  const { data, isError, isLoading } = useSuspenseQuery(
    getSoftwareQueryOptions
  );

  const handleRowClick = (softwareId: string) => {
    router.push(`/app/software/${softwareId}`);
  };

  // Helper function to get the default version or the first version
  const getDefaultVersion = (versions: SoftwareVersion[]) => {
    return versions.find((v) => v.isDefault) || versions[0];
  };

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Oprogramowanie</CardTitle>
          <CardAction>
            <CreateSoftwareModal />
          </CardAction>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTitle>
              Wystąpił błąd podczas pobierania oprogramowania
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
          <CardTitle>Oprogramowanie</CardTitle>
          <CardAction>
            <CreateSoftwareModal />
          </CardAction>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nazwa</TableHead>
              <TableHead>Producent</TableHead>
              <TableHead>Typ zatwierdzenia</TableHead>
              <TableHead>Domyślna wersja</TableHead>
              <TableHead>Typ licencji</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((software) => {
              const defaultVersion = getDefaultVersion(software.versions);
              return (
                <TableRow
                  key={software.id}
                  className="cursor-pointer transition-colors"
                  onClick={() => handleRowClick(software.id)}
                >
                  <TableCell className="font-medium">{software.name}</TableCell>
                  <TableCell>{software.publisher.name}</TableCell>
                  <TableCell>{software.approvalType}</TableCell>
                  <TableCell>
                    {defaultVersion ? defaultVersion.versionNumber : "Brak"}
                  </TableCell>
                  <TableCell>
                    {defaultVersion ? defaultVersion.licenseType : "Brak"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
