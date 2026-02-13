"use client";
import {
  AreaChart,
  BarChart3,
  FileSearch,
  LineChart,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import AreaVariant from "./area-variant";
import { BarVariant } from "./bar-variant";
import { LineVariant } from "./line-variant";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Skeleton } from "./ui/skeleton";

interface Props {
  data?: {
    date: string;
    income: number;
    expenses: number;
  }[];
}

export default function Chart({ data = [] }: Props) {
  const [chartType, setChartType] = useState("area");

  const onTypeChange = (type: string) => {
    /* TODO add paywall */
    setChartType(type);
  };

  return (
    <Card className="drop-shadow-sm">
      <CardHeader className="flex justify-between space-y-2 lg:flex-row lg:items-center lg:space-y-2">
        <CardTitle className="line-clamp-1 text-xl">Transactions</CardTitle>
        {/* Todo add select */}

        <Select defaultValue={chartType} onValueChange={onTypeChange}>
          <SelectTrigger className="h-9 select-none rounded-md bg-muted px-3 lg:w-auto">
            <SelectValue placeholder={"Chart type"} />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="area">
              <div className="flex items-center">
                <AreaChart className="mr-2 size-4 shrink-0" />
                <p className="line-clamp-1">Area Chart</p>
              </div>
            </SelectItem>
            <SelectItem value="line">
              <div className="flex items-center">
                <LineChart className="mr-2 size-4 shrink-0" />
                <p className="line-clamp-1">Line Chart</p>
              </div>
            </SelectItem>
            <SelectItem value="bar">
              <div className="flex items-center">
                <BarChart3 className="mr-2 size-4 shrink-0" />
                <p className="line-clamp-1">Bar Chart</p>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[350px] w-full flex-col items-center justify-center gap-y-4">
            <FileSearch className="size-6 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">
              No data for this period
            </p>
          </div>
        ) : (
          <>
            {chartType === "area" && <AreaVariant data={data} />}
            {chartType === "line" && <LineVariant data={data} />}
            {chartType === "bar" && <BarVariant data={data} />}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export const ChartLoading = () => {
  return (
    <Card className="bg-none drop-shadow-sm">
      <CardHeader className="flex justify-between space-y-2 lg:flex-row lg:items-center lg:space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-full lg:w-[120px]" />
      </CardHeader>

      <CardContent>
        <div className="flex h-[350px] w-full items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
        </div>
      </CardContent>
    </Card>
  );
};
