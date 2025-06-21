import { getQueryClient } from "@/tanstack-query/get-query-client";
import HardwareTable, { getHardwareQueryOptions } from "./_lib/HardwareTable";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

const HardwarePage = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery({
    ...getHardwareQueryOptions,
    queryFn: getHardwareQueryOptions.queryFn
  });

  return (
    <div className="p-4">
      <h1 className="font-bold text-xl">Sprzęt w systemie</h1>
      <p>
        W tym miejscu znajdziesz listę sprzętu w systemie. Możesz przeglądać
        informacje o sprzęcie, jego użytkownikach i lokalizacji.
      </p>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="max-w-7xl mt-6 mx-auto">
          <HardwareTable />
        </div>
      </HydrationBoundary>
    </div>
  );
};

export default HardwarePage;
