import DataCharts from "@/components/data-charts";
import DataGrid from "@/components/data-grid";
import Filters from "@/components/filters";

export default function AnaliticsPage() {
  return (
    <div className="  gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 ">
      <DataGrid />
      <DataCharts />
    </div>
  );
}
