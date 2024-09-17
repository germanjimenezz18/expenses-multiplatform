"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

import { transactions as transactionsSchema } from "@/db/schema";

import { useState } from "react";
import { useSelectAccount } from "@/features/accounts/hooks/use-select-account";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transaction";
import { useBulkCreateTransactions } from "@/features/transactions/api/use-bulk-create-transaction";

import UploadButton from "./upload-button";
import ImportCard from "./import-card";


enum VARIANTS {
  LIST = "LIST",
  IMPORT = "IMPORT",
}

const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: {},
};

export default function TransactionsPage() {
  const [AccountDialog, confirm] = useSelectAccount()
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
  const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);
  console.log({ importResults });

  const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
    console.log({ results });
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

  const onSubmitImport = async (values: typeof transactionsSchema.$inferInsert[]) => {
      const accountId = await confirm();
      if (!accountId) {
        return toast.error("Please select an account to continue.");
      }

      const data = values.map((value) => ({
        ...value, 
        accountId : accountId as string,
      }))

      //bulk mutation
      createTransactions.mutate(data , {
        onSuccess: () => {
            onCancelImport()
        }
      })

  };

  if (transactionsQuery.isLoading) {
    return (
      <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-1 xl:grid-cols-1">
        <div className="max-w-screen-1xl  w-full">
          <Card className=" drop-shadow-sm">
            <CardHeader>
              <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent>
              <div className="h-[500px] w-full flex items-center justify-center">
                <Loader2 className="size-6 text-slate-300 animate-spin" />
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
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-1 xl:grid-cols-1">
      <div className="max-w-screen-1xl  w-full">
        <Card className=" drop-shadow-sm">
          <CardHeader className=" gap-y-2 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-xl line-clamp-1">
              Transactions History
            </CardTitle>
            <div className="flex  flex-col lg:flex-row  items-center gap-x-2 gap-y-2">
              <Button
                className="w-full lg:w-auto"
                size={"sm"}
                onClick={newTransaction.onOpen}
              >
                <Plus className="size-4 mr-2" />
                Add New Transaction
              </Button>
              <UploadButton onUpload={onUpload} />
            </div>
          </CardHeader>
          <CardContent>
            {/* make the datatable take grid de 3 columnas primer elemento que ocupe dos de ellas */}
            <DataTable
              columns={columns}
              data={transactions}
              filterKey="payee"
              onDelete={(row) => {
                const ids = row.map((r) => r.original.id);
                console.log(ids);
                deleteTransactions.mutate({ ids });
              }}
              disabled={isDisabled}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
