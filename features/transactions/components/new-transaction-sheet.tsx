import { useCreateAccount, useGetAccounts } from "@features/accounts";
import { useCreateCategory, useGetCategories } from "@features/categories";
import { Loader2, ScanLine } from "lucide-react";
import type { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { insertTransactionSchema } from "@/db/schema";
import { useCreateTransaction } from "@/features/transactions/api/use-create-transaction";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { convertAmountFromMiliUnits } from "@/lib/utils/currency";
import TransactionForm from "./transaction-form";

const formSchema = insertTransactionSchema.omit({ id: true });
type FormValues = z.input<typeof formSchema>;

const matchCategory = (
  suggested: string | undefined,
  options: { label: string; value: string }[]
) => {
  if (!suggested) return null;
  const lower = suggested.toLowerCase();
  return (
    options.find(
      (o) =>
        o.label.toLowerCase().includes(lower) ||
        lower.includes(o.label.toLowerCase())
    )?.value ?? null
  );
};

function ScanningSkeletonUI() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <ScanLine className="size-4 animate-pulse" />
        <span className="animate-pulse font-medium text-sm">
          Scanning with AI...
        </span>
      </div>
      <div className="space-y-4">
        {/* Date picker */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
        {/* Account */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
        {/* Category */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        {/* Payee */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-10 w-full" />
        </div>
        {/* Amount */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
        {/* Notes */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-20 w-full" />
        </div>
        {/* Items */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          {[1, 2, 3].map((i) => (
            <div className="flex gap-2" key={i}>
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-10 w-24" />
            </div>
          ))}
        </div>
        {/* Submit button */}
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

export default function NewTransactionSheet() {
  const { isOpen, scanning, initialData, onClose } = useNewTransaction();

  const createMutation = useCreateTransaction();

  const categoryQuery = useGetCategories();
  const categoryMutation = useCreateCategory();
  const onCreateCategory = (name: string) => categoryMutation.mutate({ name });
  const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name: string) => accountMutation.mutate({ name });
  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const isPending =
    createMutation.isPending ||
    categoryMutation.isPending ||
    accountMutation.isPending;

  const isLoading = categoryQuery.isLoading || accountQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const defaultValues = initialData
    ? {
        payee: (initialData.merchant as string) ?? "",
        date: initialData.date
          ? new Date(initialData.date as string)
          : new Date(),
        amount: convertAmountFromMiliUnits(
          initialData.total as number
        ).toString(),
        accountId: "",
        categoryId:
          matchCategory(
            initialData.suggestedCategory as string | undefined,
            categoryOptions
          ) ?? "",
        notes: null as string | null,
        items: Array.isArray(initialData.items)
          ? (
              initialData.items as {
                name: string;
                quantity?: number;
                totalPrice: number;
              }[]
            ).map((item) => ({
              name: item.name,
              quantity: item.quantity,
              totalPrice: convertAmountFromMiliUnits(
                item.totalPrice
              ).toString(),
            }))
          : [],
      }
    : undefined;

  return (
    <Sheet onOpenChange={onClose} open={isOpen}>
      <SheetContent className="space-y-4 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {scanning ? "Scanning Receipt" : "Add a new Transaction"}
          </SheetTitle>
          <SheetDescription>
            {scanning
              ? "Extracting data from your receipt..."
              : "Create a new Transaction to track your expenses"}
          </SheetDescription>
        </SheetHeader>

        {scanning ? (
          <ScanningSkeletonUI />
        ) : isLoading ? (
          <div className="intset-0 absolute flex items-center justify-center">
            <Loader2 className="size-4 animate-spin text-primary" />
          </div>
        ) : (
          <TransactionForm
            accountOptions={accountOptions}
            categoryOptions={categoryOptions}
            defaultValues={defaultValues}
            disabled={isPending}
            onCreateAccount={onCreateAccount}
            onCreateCategory={onCreateCategory}
            onSubmit={onSubmit}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
