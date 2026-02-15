import { Loader2 } from "lucide-react";
import type { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { insertAccountBalanceSchema } from "@/db/schema";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useConfirm } from "@/hooks/use-confirm";
import { convertAmountFromMiliUnits } from "@/lib/utils";
import { useDeleteAccountBalance } from "../api/use-delete-account-balance";
import { useEditAccountBalance } from "../api/use-edit-account-balance";
import { useGetAccountBalance } from "../api/use-get-account-balance";
import { useOpenAccountBalance } from "../hooks/use-open-account-balance";
import AccountBalanceForm from "./account-balance-form";

const formSchema = insertAccountBalanceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
});
type FormValues = z.input<typeof formSchema>;

export default function EditAccountBalanceSheet() {
  const { isOpen, onClose, id } = useOpenAccountBalance();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this balance check."
  );

  const balanceQuery = useGetAccountBalance(id);
  const editMutation = useEditAccountBalance(id);
  const deleteMutation = useDeleteAccountBalance(id);

  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name: string) => accountMutation.mutate({ name });
  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const isLoading = balanceQuery.isLoading || accountQuery.isLoading;
  const isPending =
    editMutation.isPending || deleteMutation.isPending || accountMutation.isPending;

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

  const defaultValues = balanceQuery.data
    ? {
        accountId: balanceQuery.data.accountId,
        balance: convertAmountFromMiliUnits(balanceQuery.data.balance).toString(),
        date: balanceQuery.data.date,
        note: balanceQuery.data.note,
      }
    : {
        accountId: "",
        balance: "0",
        date: new Date(),
        note: "",
      };

  return (
    <>
      <ConfirmDialog />
      <Sheet onOpenChange={onClose} open={isOpen}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Balance Check</SheetTitle>
            <SheetDescription>
              Update the balance check details below.
            </SheetDescription>
          </SheetHeader>

          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <AccountBalanceForm
              accountOptions={accountOptions}
              defaultValues={defaultValues}
              disabled={isPending}
              id={id}
              onCreateAccount={onCreateAccount}
              onDelete={onDelete}
              onSubmit={onSubmit}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
