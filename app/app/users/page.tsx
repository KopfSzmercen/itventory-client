import { getQueryClient } from "@/tanstack-query/get-query-client";
import UsersTable, { getUsersQueryOptions } from "./_lib/UsersTable";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

const UsersPage = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(getUsersQueryOptions);

  return (
    <div className="p-4">
      <h1 className="font-bold text-xl">
        Użytkownicy zarejestrowani w systemie
      </h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="max-w-5xl mt-5 mx-auto">
          <UsersTable />
        </div>
      </HydrationBoundary>
    </div>
  );
};

export default UsersPage;
