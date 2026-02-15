"use client";

import { useSearchParams } from "next/navigation";
import { FaPiggyBank, FaWallet } from "react-icons/fa";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { formatDateRange } from "@/lib/utils";
import DataCard, { DataCardLoading } from "./data-card";

export default function DataGrid() {
  const { data, isLoading } = useGetSummary();
  const params = useSearchParams();
  const to = params.get("to") || undefined;
  const from = params.get("from") || undefined;
  const dateRangeLabel = formatDateRange({ to, from });

  if (isLoading) {
    return (
      <div className="mb-8 grid grid-cols-1 gap-8 pb-2 lg:grid-cols-4">
        <DataCardLoading />
        <DataCardLoading />
        <DataCardLoading />
        <DataCardLoading />
      </div>
    );
  }

  return (
    <div className="mb-8 grid grid-cols-1 gap-8 pb-2 lg:grid-cols-4">
      <DataCard
        className=""
        dateRange={dateRangeLabel}
        icon={FaPiggyBank}
        percentageChange={data?.remainingChange}
        title="Remaining"
        value={data?.remainingAmount}
        variant="default"
      />
      <DataCard
        dateRange={dateRangeLabel}
        icon={FaArrowTrendUp}
        percentageChange={data?.incomeChange}
        title="Income"
        value={data?.incomeAmount}
        variant="success"
      />
      <DataCard
        dateRange={dateRangeLabel}
        icon={FaArrowTrendDown}
        percentageChange={data?.expensesChange}
        title="Expenses"
        value={(data?.expensesAmount ?? 0) * -1}
        variant="danger"
      />
      <DataCard
        dateRange={dateRangeLabel}
        icon={FaWallet}
        percentageChange={data?.totalBalanceChange}
        title="Total Balance"
        value={data?.totalBalanceAmount}
        variant="default"
      />
    </div>
  );
}
