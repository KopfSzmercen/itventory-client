import { LoginForm } from "@/app/(auth)/login/_lib/LoginForm";
import { getQueryClient } from "@/tanstack-query/get-query-client";

export default function Login() {
  const queryClient = getQueryClient();
  return (
    <div className="min-h-screen from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex justify-center mt-40">
        <div className="w-full max-w-md ">
          <div className="bg-background/95 backdrop-blur rounded-lg shadow-xl p-6 border p-4 rounded-md">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
