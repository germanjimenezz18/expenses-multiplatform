"use client";
import { Plus } from "lucide-react";
import { Suspense } from "react";
import AccountTracker from "@/components/account-tracker";
import { DataCardLoading } from "@/components/data-card";
import DataGrid from "@/components/data-grid";
import { DataTable } from "@/components/data-table";
import SpendingPie, { SpendingPieLoading } from "@/components/spending-pie";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { columns } from "./transactions/columns";

export default function Dashboard() {
  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start lg:col-span-2">
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
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          }
        >
          <TransactionTabs />
        </Suspense>
      </div>
      <div className="flex flex-col gap-8">
        <Suspense fallback={<SpendingPieLoading />}>
          <DashboardSpendingPie />
        </Suspense>
        <Suspense
          fallback={
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[400px] w-full" />
              </CardContent>
            </Card>
          }
        >
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
      <CardHeader className="flex flex-col gap-y-2 px-7 lg:flex-row lg:items-center lg:justify-between">
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

        <div className="flex flex-col items-center gap-x-2 gap-y-2 lg:flex-row">
          <Button
            className="w-full lg:w-auto"
            onClick={newTransaction.onOpen}
            size={"sm"}
            variant={"outline"}
          >
            <Plus className="mr-2 size-4" />
            Add New Transaction
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={transactions}
          disabled={isDisabled}
          filterKey="payee"
          hideSearch={true}
          onDelete={(row) => {
            // TODO: Implement delete functionality
          }}
        />
      </CardContent>
    </Card>
  );
}
