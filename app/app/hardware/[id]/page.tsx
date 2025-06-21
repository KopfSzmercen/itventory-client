import { HardwareDetails } from "@/app/app/hardware/[id]/_lib";

interface HardwareDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function HardwareDetailPage({
  params
}: HardwareDetailPageProps) {
  const { id } = await params;

  return (
    <div className="w-full px-4 py-8 max-w-7xl mx-auto">
      <HardwareDetails hardwareId={id} />
    </div>
  );
}
