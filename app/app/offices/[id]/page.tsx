import OfficeRoomsTable from "@/app/app/offices/[id]/_lib/OfficeRoomsTable";
import OfficeDetails from "./_lib/OfficeDetails";

interface OfficeDetailsPageProps {
  id: string;
}

export default async function OfficeDetailsPage({
  params
}: {
  params: Promise<OfficeDetailsPageProps>;
}) {
  const { id } = await params;

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <OfficeDetails id={id} />
        <OfficeRoomsTable officeId={id} />
      </div>
    </div>
  );
}
