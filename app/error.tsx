"use client";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

export default function Error() {
  return (
    <div className="flex items-center justify-center h-[100vh] p-4">
      <Alert variant={"destructive"} className="mt-5">
        <AlertCircleIcon />
        <AlertTitle>Wystąpił błąd</AlertTitle>
        <AlertDescription>
          Przepraszamy, coś poszło nie tak. Spróbuj ponownie później lub
          skontaktuj się z administratorem.
        </AlertDescription>
      </Alert>
    </div>
  );
}
