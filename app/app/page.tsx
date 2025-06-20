import { ChartAreaLegend } from "@/app/app/_lib/DashboardChart";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();
  return (
    <div>
      <div className="p-4">
        <h1 className="font-bold text-xl">Cześć {session?.user.email}</h1>
        <h2>Miło Cię widzieć</h2>

        <p className="mt-5">Oto najważniejsze informacje:</p>
      </div>

      <div className="flex gap-3 items-start justify-center flex-wrap p-4 max-w-3xl">
        <div className="max-w-3xl">
          <ChartAreaLegend />
        </div>
        <div className="max-w-3xl">
          <ChartAreaLegend />
        </div>
      </div>
    </div>
  );
}
