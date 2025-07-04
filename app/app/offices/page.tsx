import { getQueryClient } from "@/tanstack-query/get-query-client";
import OfficesTable, { getOfficesQueryOptions } from "./_lib/OfficesTable";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

const OfficesPage = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery({
    ...getOfficesQueryOptions,
    queryFn: getOfficesQueryOptions.queryFn
  });

  return (
    <div className="p-4">
      <h1 className="font-bold text-xl">Biura w systemie</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="max-w-5xl mt-5 mx-auto">
          <OfficesTable />
        </div>
      </HydrationBoundary>
    </div>
  );
};

export default OfficesPage;
