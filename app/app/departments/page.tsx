import { getQueryClient } from "@/tanstack-query/get-query-client";
import DepartmentsTable, {
  getDepartmentsQueryOptions
} from "./_lib/DepartmentsTable";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

const DepartmentsPage = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery({
    ...getDepartmentsQueryOptions,
    queryFn: getDepartmentsQueryOptions.queryFn
  });

  return (
    <div className="p-4">
      <h1 className="font-bold text-xl">Działy w systemie</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="max-w-5xl mt-5 mx-auto">
          <DepartmentsTable />
        </div>
      </HydrationBoundary>
    </div>
  );
};

export default DepartmentsPage;
