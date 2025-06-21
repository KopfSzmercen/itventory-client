import { RegisterForm } from "@/app/(auth)/register/_lib/RegisterForm";

export default function Register() {
  return (
    <div className="min-h-screen from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex justify-center mt-40">
        <div className="w-full max-w-md ">
          <div className="bg-background/95 backdrop-blur rounded-lg shadow-xl p-6 border p-4 rounded-md">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
