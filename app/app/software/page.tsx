import SoftwareTable, {
  getSoftwareQueryOptions
} from "@/app/app/software/_lib/SoftwareTable";
import { getQueryClient } from "@/tanstack-query/get-query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import React from "react";

const SoftwarePage = () => {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(getSoftwareQueryOptions);

  return (
    <div className="p-4">
      <h1 className="font-bold text-xl">Oprogramowanie w systemie</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="max-w-5xl mt-5 mx-auto">
          <SoftwareTable />
        </div>
      </HydrationBoundary>
    </div>
  );
};

export default SoftwarePage;
