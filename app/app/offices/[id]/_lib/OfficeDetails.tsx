"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, MapPin } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";

interface OfficeDetail {
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

async function getOfficeDetails(id: string): Promise<OfficeDetail> {
  const response = await api.get(`/office/${id}`);
  return response.data;
}

export const getOfficeDetailsQueryOptions = (id: string) =>
  queryOptions<OfficeDetail>({
    queryKey: ["office", id],
    queryFn: () => getOfficeDetails(id)
  });

interface OfficeDetailsProps {
  id: string;
}

export default function OfficeDetails({ id }: OfficeDetailsProps) {
  const router = useRouter();
  const { data, isError, isLoading } = useSuspenseQuery(
    getOfficeDetailsQueryOptions(id)
  );

  if (isError) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => router.push("/app/offices")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Powrót
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Szczegóły biura</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertTitle>
                Wystąpił błąd podczas pobierania danych biura
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

  const address = data.fullAddress || `${data.street} ${data.buildingNumber}`;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
    data.longitude - 0.01
  },${data.latitude - 0.01},${data.longitude + 0.01},${
    data.latitude + 0.01
  }&layer=mapnik&marker=${data.latitude},${data.longitude}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.push("/app/offices")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Powrót
        </Button>
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-500">
            {data.latitude.toFixed(6)}, {data.longitude.toFixed(6)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informacje o biurze</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">ID</label>
                <p className="text-sm font-mono">{data.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Status
                </label>
                <div>
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      data.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {data.isActive ? "Aktywne" : "Nieaktywne"}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Pełny adres
              </label>
              <p className="text-sm">{address}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Ulica
                </label>
                <p className="text-sm">{data.street}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Numer budynku
                </label>
                <p className="text-sm">{data.buildingNumber}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lokalizacja</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Miasto
                </label>
                <p className="text-sm">{data.location.city}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Kod pocztowy
                </label>
                <p className="text-sm">{data.location.zipCode}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Kraj
                </label>
                <p className="text-sm">{data.location.countryName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Typ zakładu
                </label>
                <p className="text-sm">{data.location.typeOfPlant || "-"}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Nazwa lokalizacji
              </label>
              <p className="text-sm">{data.location.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Szerokość geograficzna
                </label>
                <p className="text-sm font-mono">{data.latitude.toFixed(6)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Długość geograficzna
                </label>
                <p className="text-sm font-mono">{data.longitude.toFixed(6)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mapa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-80 rounded-lg overflow-hidden border">
            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Mapa lokalizacji biura w ${data.location.city}`}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Mapa pokazuje przybliżoną lokalizację biura na podstawie
            współrzędnych geograficznych.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
