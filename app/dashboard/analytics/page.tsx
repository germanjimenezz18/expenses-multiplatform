import { Suspense } from "react";
import { ChartLoading } from "@/components/chart";
import { DataCardLoading } from "@/components/data-card";
import DataCharts from "@/components/data-charts";
import DataGrid from "@/components/data-grid";
import { SpendingPieLoading } from "@/components/spending-pie";

export default function AnaliticsPage() {
  return (
    <div className="gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Suspense
        fallback={
          <div className="mb-8 grid grid-cols-1 gap-8 pb-2 lg:grid-cols-3">
            <DataCardLoading />
            <DataCardLoading />
            <DataCardLoading />
          </div>
        }
      >
        <DataGrid />
      </Suspense>
      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-6">
            <div className="col-span-1 lg:col-span-3 xl:col-span-4">
              <ChartLoading />
            </div>
            <div className="col-span-1 lg:col-span-3 xl:col-span-2">
              <SpendingPieLoading />
            </div>
          </div>
        }
      >
        <DataCharts />
      </Suspense>
    </div>
  );
}
