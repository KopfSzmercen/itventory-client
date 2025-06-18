import { AxiosError } from "axios";

const handleApiError = (error: unknown): string => {
  if (error instanceof AxiosError && error.response) {
    const status = error.response.status;
    if (status >= 400 && status < 500)
      throw new Error(error.response.data?.message || "Nieprawidłowe dane");
    else if (status >= 500)
      throw new Error("Błąd serwera. Spróbuj ponownie później");
  }
  return "Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.";
};

export default handleApiError;
