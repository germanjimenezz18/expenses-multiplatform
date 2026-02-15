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
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteTransaction } from "../api/use-delete-transaction";
import { useEditTransaction } from "../api/use-edit-transaction";
import { useGetTransaction } from "../api/use-get-transaction";
import { useOpenTransaction } from "../hooks/use-open-transaction";
import TransactionForm from "./transaction-form";

const formSchema = insertTransactionSchema.omit({ id: true });
type FormValues = z.input<typeof formSchema>;

export default function EditTransactionSheet() {
  const { isOpen, onClose, id, focusField } = useOpenTransaction();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this transaction."
  );
  const transactionQuery = useGetTransaction(id);
  const editMutation = useEditTransaction(id);
  const deleteMutation = useDeleteTransaction(id);

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

  const isLoading =
    transactionQuery.isLoading ||
    categoryQuery.isLoading ||
    accountQuery.isLoading;

  const isPending =
    editMutation.isPending ||
    deleteMutation.isPending ||
    transactionQuery.isPending ||
    categoryMutation.isPending ||
    accountMutation.isPending;

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const onDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const defaultValues = transactionQuery.data
    ? {
        accountId: transactionQuery.data.accountId,
        categoryId: transactionQuery.data.categoryId,
        amount: transactionQuery.data.amount.toString(),
        date: transactionQuery.data.date
          ? new Date(transactionQuery.data.date)
          : new Date(),
        payee: transactionQuery.data.payee,
        notes: transactionQuery.data.notes,
      }
    : {
        accountId: "",
        categoryId: "",
        amount: "",
        date: new Date(),
        payee: "",
        notes: "",
      };

  return (
    <>
      <ConfirmDialog />
      <Sheet onOpenChange={onClose} open={isOpen}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Transaction</SheetTitle>
            <SheetDescription>
              Update the transaction details below.
            </SheetDescription>
          </SheetHeader>

          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <TransactionForm
              accountOptions={accountOptions}
              categoryOptions={categoryOptions}
              defaultValues={defaultValues}
              disabled={isPending}
              focusField={focusField}
              id={id}
              onCreateAccount={onCreateAccount}
              onCreateCategory={onCreateCategory}
              onDelete={onDelete}
              onSubmit={onSubmit}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
