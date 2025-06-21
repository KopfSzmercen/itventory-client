import { EmployeeDetails } from "@/app/app/employees/[id]/_lib/EmployeeDetails";

interface EmployeeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EmployeeDetailPage({
  params
}: EmployeeDetailPageProps) {
  const { id } = await params;

  return (
    <div className="w-full px-4 py-8 max-w-7xl mx-auto">
      <EmployeeDetails employeeId={id} />
    </div>
  );
}
