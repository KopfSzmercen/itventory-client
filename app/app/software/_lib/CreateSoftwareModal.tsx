"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

// Schema for form validation
const createSoftwareSchema = z.object({
  name: z.string().min(1, "Nazwa jest wymagana"),
  publisherId: z.string().min(1, "Producent jest wymagany")
});

type CreateSoftwareFormData = z.infer<typeof createSoftwareSchema>;

interface Publisher {
  id: string;
  name: string;
  countryName: string;
}

type PublishersResponse = Publisher[];

async function getPublishers(): Promise<PublishersResponse> {
  const response = await api.get("/producent");
  return response.data;
}

async function createSoftware(data: {
  name: string;
  publisherId: string;
  approvalType: string;
}) {
  const response = await api.post("/software", data);
  return response.data;
}

export default function CreateSoftwareModal() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<CreateSoftwareFormData>({
    resolver: zodResolver(createSoftwareSchema)
  });

  const publisherId = watch("publisherId");

  const { data: publishers, isLoading: publishersLoading } = useQuery({
    queryKey: ["producent"],
    queryFn: getPublishers
  });

  const createSoftwareMutation = useMutation({
    mutationFn: createSoftware,
    onSuccess: () => {
      toast.success("Oprogramowanie zostało dodane pomyślnie!");
      queryClient.invalidateQueries({ queryKey: ["software"] });
      setIsOpen(false);
      reset();
    },
    onError: (error) => {
      toast.error(
        error?.message || "Wystąpił błąd podczas dodawania oprogramowania"
      );
    }
  });

  const onSubmit = (data: CreateSoftwareFormData) => {
    createSoftwareMutation.mutate({
      name: data.name,
      publisherId: data.publisherId,
      approvalType: "none"
    });
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Dodaj oprogramowanie
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dodaj nowe oprogramowanie</DialogTitle>
          <DialogDescription>
            Wypełnij formularz, aby dodać nowe oprogramowanie do systemu.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nazwa</Label>
              <Input
                id="name"
                placeholder="Wprowadź nazwę oprogramowania"
                {...register("name")}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="publisherId">Producent</Label>
              <Select
                value={publisherId}
                onValueChange={(value) => setValue("publisherId", value)}
                disabled={publishersLoading}
              >
                <SelectTrigger
                  className={errors.publisherId ? "border-red-500" : ""}
                >
                  <SelectValue
                    placeholder={
                      publishersLoading ? "Ładowanie..." : "Wybierz producenta"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {publishers?.map((publisher) => (
                    <SelectItem key={publisher.id} value={publisher.id}>
                      {publisher.name} ({publisher.countryName})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.publisherId && (
                <p className="text-sm text-red-500">
                  {errors.publisherId.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={createSoftwareMutation.isPending}
            >
              Anuluj
            </Button>
            <Button type="submit" disabled={createSoftwareMutation.isPending}>
              {createSoftwareMutation.isPending ? "Dodawanie..." : "Dodaj"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
