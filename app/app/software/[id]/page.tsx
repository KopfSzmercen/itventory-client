import { SoftwareDetails } from "./_lib";

interface SoftwareDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function SoftwareDetailPage({
  params
}: SoftwareDetailPageProps) {
  const { id } = await params;

  return (
    <div className="w-full px-4 py-8 max-w-7xl mx-auto">
      <SoftwareDetails softwareId={id} />
    </div>
  );
}
