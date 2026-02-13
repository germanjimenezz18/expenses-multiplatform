"use client";
import { Suspense } from "react";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { columns } from "./transactions/columns";
import { DataTable } from "@/components/data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DataGrid from "@/components/data-grid";
import AccountTracker from "@/components/account-tracker";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import SpendingPie from "@/components/spending-pie";
import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { DataCardLoading } from "@/components/data-card";
import { SpendingPieLoading } from "@/components/spending-pie";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3 ">
      <div className="grid auto-rows-max items-start  lg:col-span-2">
        <Suspense fallback={<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8"><DataCardLoading /><DataCardLoading /><DataCardLoading /></div>}>
          <DataGrid />
        </Suspense>
        <Suspense fallback={<Card><CardHeader><Skeleton className="h-8 w-48" /></CardHeader><CardContent><Skeleton className="h-[300px] w-full" /></CardContent></Card>}>
          <TransactionTabs />
        </Suspense>
      </div>
      <div className="flex flex-col gap-8">
        <Suspense fallback={<SpendingPieLoading />}>
          <DashboardSpendingPie />
        </Suspense>
        <Suspense fallback={<Card><CardHeader><Skeleton className="h-8 w-48" /></CardHeader><CardContent><Skeleton className="h-[400px] w-full" /></CardContent></Card>}>
          <AccountTracker />
        </Suspense>
      </div>
    </div>
  );
}

function DashboardSpendingPie() {
  const { data } = useGetSummary();
  return <SpendingPie data={data?.categories} />;
}

function TransactionTabs() {
  const transactionsQuery = useGetTransactions();
  const transactions = transactionsQuery.data || [];
  const isDisabled = transactionsQuery.isLoading;
  const newTransaction = useNewTransaction();

  return (
    <Card>
      <CardHeader className="px-7  gap-y-2 flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <CardTitle className="text-xl">Transactions</CardTitle>
          <CardDescription>
            {" "}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </CardDescription>
        </div>

        <div className="flex  flex-col lg:flex-row  items-center gap-x-2 gap-y-2">
          <Button
            className="w-full lg:w-auto"
            size={"sm"}
            variant={"outline"}
            onClick={newTransaction.onOpen}
          >
            <Plus className="size-4 mr-2" />
            Add New Transaction
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={transactions}
          filterKey="payee"
          onDelete={(row) => {
            console.log(row);
          }}
          hideSearch={true}
          disabled={isDisabled}
        />
      </CardContent>
    </Card>
  );
}
