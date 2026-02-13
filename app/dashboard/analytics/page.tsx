import { Suspense } from "react";
import DataCharts from "@/components/data-charts";
import DataGrid from "@/components/data-grid";
import Filters from "@/components/filters";
import { DataCardLoading } from "@/components/data-card";
import { ChartLoading } from "@/components/chart";
import { SpendingPieLoading } from "@/components/spending-pie";

export default function AnaliticsPage() {
  return (
    <div className="  gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 ">
      <Suspense fallback={<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8"><DataCardLoading /><DataCardLoading /><DataCardLoading /></div>}>
        <DataGrid />
      </Suspense>
      <Suspense fallback={<div className="grid grid-cols-1 lg:grid-cols-6 gap-8"><div className="col-span-1 lg:col-span-3 xl:col-span-4"><ChartLoading /></div><div className="col-span-1 lg:col-span-3 xl:col-span-2"><SpendingPieLoading /></div></div>}>
        <DataCharts />
      </Suspense>
    </div>
  );
}
