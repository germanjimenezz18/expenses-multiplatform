import type { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { insertAccountSchema } from "@/db/schema";
import { useCreateAccount } from "../api/use-create-account";
import { useNewAccount } from "../hooks/use-new-account";
import AccountForm from "./account-form";

const formSchema = insertAccountSchema.pick({ name: true, type: true });
type FormValues = z.input<typeof formSchema>;

export default function NewAccountSheet() {
  const { isOpen, onClose } = useNewAccount();

  const mutation = useCreateAccount();
  const onSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Sheet onOpenChange={onClose} open={isOpen}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Account</SheetTitle>
          <SheetDescription>
            Create a new Account to track your transactions
          </SheetDescription>
        </SheetHeader>
        <AccountForm
          defaultValues={{ name: "", type: "bank" }}
          disabled={mutation.isPending}
          onSubmit={onSubmit}
        />
      </SheetContent>
    </Sheet>
  );
}
