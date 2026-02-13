import { useRef, useState } from "react";
import { Select } from "@/components/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";

export const useSelectAccount = (): [
  () => React.ReactElement,
  () => Promise<unknown>,
] => {
  const [promise, setPromise] = useState<{
    resolve: (value: string | undefined) => void;
  } | null>(null);

  const selectValue = useRef<string | undefined>(undefined);
  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name: string) => accountMutation.mutate({ name });
  const accountOptions = (accountQuery.data || []).map((val) => ({
    label: val.name,
    value: val.id,
  }));

  const confirm = () =>
    new Promise((resolve, _reject) => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(selectValue.current);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(undefined);
    handleClose();
  };

  const ConfirmationDialog = () => {
    return (
      <Dialog open={promise != null}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select an account</DialogTitle>
            <DialogDescription>
              Please select an account to continue.
            </DialogDescription>
          </DialogHeader>

          <Select
            disabled={accountMutation.isPending || accountQuery.isLoading}
            onChange={(value) => {
              selectValue.current = value;
            }}
            onCreate={onCreateAccount}
            options={accountOptions}
            placeholder="Select an account"
          />

          <DialogFooter>
            <Button onClick={handleCancel} variant={"outline"}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  return [ConfirmationDialog, confirm];
};
