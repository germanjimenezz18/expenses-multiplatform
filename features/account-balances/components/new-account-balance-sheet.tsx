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
import { useCreateAccountBalance } from "../api/use-create-account-balance";
import { useNewAccountBalance } from "../hooks/use-new-account-balance";
import AccountBalanceForm from "./account-balance-form";

const formSchema = insertAccountBalanceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
});
type FormValues = z.input<typeof formSchema>;

export default function NewAccountBalanceSheet() {
  const { isOpen, onClose, accountId } = useNewAccountBalance();

  const createMutation = useCreateAccountBalance();

  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name: string) => accountMutation.mutate({ name });
  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const isPending = createMutation.isPending || accountMutation.isPending;
  const isLoading = accountQuery.isLoading;

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
          <SheetTitle>New Balance Check</SheetTitle>
          <SheetDescription>
            Record the current balance of your account
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="intset-0 absolute flex items-center justify-center">
            <Loader2 className="size-4 animate-spin text-primary" />
          </div>
        ) : (
          <AccountBalanceForm
            accountOptions={accountOptions}
            defaultValues={{
              accountId: accountId ?? "",
              balance: "0",
              date: new Date(),
              note: "",
            }}
            disabled={isPending}
            onCreateAccount={onCreateAccount}
            onSubmit={onSubmit}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
