import { Loader2 } from "lucide-react";
import type { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { insertTransactionSchema } from "@/db/schema";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useCreateTransaction } from "@/features/transactions/api/use-create-transaction";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import TransactionForm from "./transaction-form";

const formSchema = insertTransactionSchema.omit({ id: true });
type FormValues = z.input<typeof formSchema>;

export default function NewTransactionSheet() {
  const { isOpen, onClose } = useNewTransaction();

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

  return (
    <Sheet onOpenChange={onClose} open={isOpen}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Add a new Transaction</SheetTitle>
          <SheetDescription>
            Create a new Transaction to track your expenses
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="intset-0 absolute flex items-center justify-center">
            <Loader2 className="size-4 animate-spin text-primary" />
          </div>
        ) : (
          <TransactionForm
            accountOptions={accountOptions}
            categoryOptions={categoryOptions}
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
