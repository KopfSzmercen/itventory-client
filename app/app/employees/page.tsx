import { getQueryClient } from "@/tanstack-query/get-query-client";
import EmployeesTable, {
  getEmployeesQueryOptions
} from "./_lib/EmployeesTable";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

const EmployeesPage = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery({
    ...getEmployeesQueryOptions,
    queryFn: getEmployeesQueryOptions.queryFn
  });

  return (
    <div className="p-4">
      <h1 className="font-bold text-xl">Pracownicy w systemie</h1>
      <p>
        W tym miejscu znajdziesz listę pracowników w systemie. Możesz przeglądać
        ich dane, a także dodawać nowych pracowników.
      </p>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="max-w-7xl mt-6 mx-auto">
          <EmployeesTable />
        </div>
      </HydrationBoundary>
    </div>
  );
};

export default EmployeesPage;
