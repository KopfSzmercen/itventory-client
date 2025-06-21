"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { forwardRef, useEffect, useState } from "react";

interface Model {
  id: string;
  name: string;
  producentId: string;
  releaseDate: string;
  comments: string;
  producent: {
    id: string;
    name: string;
    countryName: string;
  };
}

interface Producent {
  id: string;
  name: string;
  countryName: string;
  models: Model[];
}

type ProducentsResponse = Producent[];

async function getProducents(): Promise<ProducentsResponse> {
  const response = await api.get("/producent");
  return response.data;
}

interface ProducentAndModelFormInputProps {
  producentValue?: string;
  modelValue?: string;
  onProducentChange?: (value: string) => void;
  onModelChange?: (value: string) => void;
  producentPlaceholder?: string;
  modelPlaceholder?: string;
  className?: string;
}

const ProducentAndModelFormInput = forwardRef<
  HTMLDivElement,
  ProducentAndModelFormInputProps
>(
  (
    {
      producentValue,
      modelValue,
      onProducentChange,
      onModelChange,
      producentPlaceholder = "Wybierz producenta",
      modelPlaceholder = "Wybierz model",
      className,
      ...props
    },
    ref
  ) => {
    const [selectedProducent, setSelectedProducent] = useState<
      string | undefined
    >(producentValue);

    const {
      data: producents,
      isLoading,
      isError
    } = useQuery({
      queryKey: ["producents"],
      queryFn: getProducents
    });

    const selectedProducentData = producents?.find(
      (p) => p.id === selectedProducent
    );
    const availableModels = selectedProducentData?.models || [];

    useEffect(() => {
      if (producentValue !== selectedProducent) {
        setSelectedProducent(producentValue);
      }
    }, [producentValue, selectedProducent]);

    const handleProducentChange = (value: string) => {
      setSelectedProducent(value);
      onProducentChange?.(value);
      // Reset model when producent changes
      onModelChange?.("");
    };

    const handleModelChange = (value: string) => {
      onModelChange?.(value);
    };

    if (isLoading) {
      return (
        <div className={className} ref={ref}>
          <div className="space-y-4">
            <div>
              <Label>Producent</Label>
              <Select disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Ładowanie..." />
                </SelectTrigger>
              </Select>
            </div>
            <div>
              <Label>Model</Label>
              <Select disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Ładowanie..." />
                </SelectTrigger>
              </Select>
            </div>
          </div>
        </div>
      );
    }

    if (isError) {
      return (
        <div className={className} ref={ref}>
          <div className="space-y-4">
            <div>
              <Label>Producent</Label>
              <Select disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Błąd ładowania producentów" />
                </SelectTrigger>
              </Select>
            </div>
            <div>
              <Label>Model</Label>
              <Select disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Błąd ładowania modeli" />
                </SelectTrigger>
              </Select>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={className} ref={ref} {...props}>
        <div className="space-y-4 w-full">
          <div className="w-full">
            <Label>Producent</Label>
            <Select
              value={selectedProducent}
              onValueChange={handleProducentChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={producentPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {producents?.map((producent) => (
                  <SelectItem key={producent.id} value={producent.id}>
                    {producent.name} ({producent.countryName})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Model</Label>
            <Select
              value={modelValue}
              onValueChange={handleModelChange}
              disabled={!selectedProducent || availableModels.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={modelPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {availableModels.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    );
  }
);

ProducentAndModelFormInput.displayName = "ProducentAndModelFormInput";

export default ProducentAndModelFormInput;
