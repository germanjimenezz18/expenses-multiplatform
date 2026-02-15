"use client";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import type { transactions as transactionsSchema } from "@/db/schema";
import { useSelectAccount } from "@/features/accounts/hooks/use-select-account";
import { useBulkCreateTransactions } from "@/features/transactions/api/use-bulk-create-transaction";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transaction";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { columns } from "./columns";
import ImportCard from "./import-card";
import UploadButton from "./upload-button";

const VARIANTS = {
  LIST: "LIST",
  IMPORT: "IMPORT",
} as const;

const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: {},
};

export default function TransactionsPageContent() {
  const [AccountDialog, confirm] = useSelectAccount();
  const [variant, setVariant] = useState<keyof typeof VARIANTS>(VARIANTS.LIST);
  const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);

  const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
    setImportResults(results);
    setVariant(VARIANTS.IMPORT);
  };
  const onCancelImport = () => {
    setVariant(VARIANTS.LIST);
  };
  const newTransaction = useNewTransaction();
  const createTransactions = useBulkCreateTransactions();
  const transactionsQuery = useGetTransactions();
  const deleteTransactions = useBulkDeleteTransactions();
  const transactions = transactionsQuery.data || [];

  const isDisabled =
    transactionsQuery.isLoading || deleteTransactions.isPending;

  const onSubmitImport = async (
    values: (typeof transactionsSchema.$inferInsert)[]
  ) => {
    const accountId = await confirm();
    if (!accountId) {
      return toast.error("Please select an account to continue.");
    }

    const data = values.map((value) => ({
      ...value,
      accountId: accountId as string,
    }));

    //bulk mutation
    createTransactions.mutate(data, {
      onSuccess: () => {
        onCancelImport();
      },
    });
  };

  if (transactionsQuery.isLoading) {
    return (
      <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-1 xl:grid-cols-1">
        <div className="w-full max-w-screen-1xl">
          <Card className="drop-shadow-sm">
            <CardHeader>
              <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent>
              <div className="flex h-[500px] w-full items-center justify-center">
                <Loader2 className="size-6 animate-spin text-slate-300" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        <AccountDialog />
        <ImportCard
          data={importResults.data}
          onCancel={onCancelImport}
          onSubmit={onSubmitImport}
        />
      </>
    );
  }
  return (
    <div className="flex flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid lg:grid-cols-1 xl:grid-cols-1">
      <div className="w-full">
        <Card className="drop-shadow-sm">
          <CardHeader className="flex flex-col gap-y-2 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="line-clamp-1 text-xl">
              Transactions History
            </CardTitle>
            <div className="flex flex-col items-center gap-x-2 gap-y-2 lg:flex-row">
              <Button
                className="w-full lg:w-auto"
                onClick={newTransaction.onOpen}
                size={"sm"}
              >
                <Plus className="mr-2 size-4" />
                Add New Transaction
              </Button>
              <UploadButton onUpload={onUpload} />
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={transactions}
              disabled={isDisabled}
              filterKey="payee"
              onDelete={(row) => {
                const ids = row.map((r) => r.original.id);
                deleteTransactions.mutate({ ids });
              }}
              renderFilters={(ctx) => (
                <>
                  <Input
                    className="max-w-[200px]"
                    onChange={(e) =>
                      ctx.setColumnFilter("payee", e.target.value)
                    }
                    placeholder="Search payee..."
                    value={
                      (ctx.table
                        .getColumn("payee")
                        ?.getFilterValue() as string) ?? ""
                    }
                  />
                  <Select
                    onValueChange={(value) =>
                      ctx.setColumnFilter(
                        "amount",
                        value === "all" ? undefined : value
                      )
                    }
                    value={
                      (ctx.table
                        .getColumn("amount")
                        ?.getFilterValue() as string) ?? "all"
                    }
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
