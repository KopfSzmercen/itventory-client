"use client";

import { Software } from "@/app/app/software/[id]/_lib";
import { AddSoftwareVersionModal } from "@/app/app/software/[id]/_lib/AddSoftwareVersionModal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
import {
  queryOptions,
  useQuery,
  useMutation,
  useQueryClient
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  Building,
  Calendar,
  CheckCircle,
  DollarSign,
  Globe,
  Package,
  Settings,
  Tag,
  XCircle
} from "lucide-react";
import { useRouter } from "nextjs-toploader/app";

async function getSoftware(id: string): Promise<Software> {
  const response = await api.get(`/software/${id}`);
  return response.data;
}

interface SetDefaultVersionRequest {
  softwareId: string;
  versionId: string;
}

async function setDefaultVersion(
  data: SetDefaultVersionRequest
): Promise<void> {
  await api.put("/software/version/set-default", data);
}

export const getSoftwareQueryOptions = (id: string) =>
  queryOptions<Software>({
    queryKey: ["software", id],
    queryFn: () => getSoftware(id)
  });

interface SoftwareDetailsProps {
  softwareId: string;
}

export function SoftwareDetails({ softwareId }: SoftwareDetailsProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: software,
    isError,
    isLoading
  } = useQuery(getSoftwareQueryOptions(softwareId));

  const setDefaultVersionMutation = useMutation({
    mutationFn: setDefaultVersion,
    onSuccess: () => {
      toast.success("Sukces", {
        description: "Wersja została ustawiona jako domyślna"
      });
      // Refetch software data to update the UI
      queryClient.invalidateQueries({ queryKey: ["software", softwareId] });
      queryClient.invalidateQueries({ queryKey: ["software"] });
    },
    //eslint-disable-next-line
    onError: (error: any) => {
      toast.error("Błąd", {
        description:
          error.response?.data?.message ||
          "Wystąpił błąd podczas ustawiania wersji jako domyślnej"
      });
    }
  });

  const handleSetDefaultVersion = (versionId: string) => {
    setDefaultVersionMutation.mutate({
      softwareId,
      versionId
    });
  };

  if (isError) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Szczegóły oprogramowania</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertTitle>
                Wystąpił błąd podczas pobierania danych oprogramowania
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
    return <Skeleton className="w-full h-96" />;
  }

  if (!software) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Szczegóły oprogramowania</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertTitle>Brak danych oprogramowania</AlertTitle>
              <AlertDescription>
                Nie znaleziono informacji o tym oprogramowaniu.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  const defaultVersion =
    software.versions.find((v) => v.isDefault) || software.versions[0];
  const activeVersions = software.versions.filter((v) => v.isActive);
  const approvedVersions = software.versions.filter((v) => v.isApproved);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Powrót</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{software.name}</h1>
            <p className="text-muted-foreground">Szczegóły oprogramowania</p>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Informacje podstawowe</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Nazwa</p>
                  <p className="text-sm text-muted-foreground">
                    {software.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Building className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Producent</p>
                  <p className="text-sm text-muted-foreground">
                    {software.publisher.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Kraj producenta</p>
                  <p className="text-sm text-muted-foreground">
                    {software.publisher.countryName}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Typ zatwierdzenia</p>
                  <Badge variant="outline">{software.approvalType}</Badge>
                </div>
              </div>

              {defaultVersion && (
                <>
                  <div className="flex items-center space-x-3">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Domyślna wersja</p>
                      <p className="text-sm text-muted-foreground">
                        {defaultVersion.versionNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        Cena domyślnej wersji
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {defaultVersion.price} PLN
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{software.versions.length}</p>
                <p className="text-xs text-muted-foreground">
                  Wszystkich wersji
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{approvedVersions.length}</p>
                <p className="text-xs text-muted-foreground">
                  Zatwierdzonych wersji
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{activeVersions.length}</p>
                <p className="text-xs text-muted-foreground">
                  Aktywnych wersji
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Versions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Wersje oprogramowania</span>
            </CardTitle>
            <AddSoftwareVersionModal softwareId={softwareId} />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numer wersji</TableHead>
                <TableHead>Data publikacji</TableHead>
                <TableHead>Cena</TableHead>
                <TableHead>Typ licencji</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {software.versions.map((version) => (
                <TableRow key={version.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <span>{version.versionNumber}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(version.published).toLocaleDateString(
                          "pl-PL"
                        )}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>{version.price} PLN</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{version.licenseType}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {version.isApproved ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm">
                        {version.isApproved
                          ? "Zatwierdzona"
                          : "Niezatwierdzona"}
                      </span>
                      {version.isActive && (
                        <Badge variant="secondary" className="text-xs">
                          Aktywna
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {!version.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefaultVersion(version.id)}
                        disabled={setDefaultVersionMutation.isPending}
                        className="text-xs"
                      >
                        {setDefaultVersionMutation.isPending &&
                        setDefaultVersionMutation.variables?.versionId ===
                          version.id
                          ? "Ustawianie..."
                          : "Ustaw jako domyślną"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
