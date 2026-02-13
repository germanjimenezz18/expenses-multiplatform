import { Button } from "@/components/ui/button";
import { Select } from '@/components/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRef, useState } from "react";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";

export const useSelectAccount = (): [
  () => React.ReactElement,
  () => Promise<unknown>
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
    new Promise((resolve, reject) => {
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
            <DialogTitle>
              Select an account
            </DialogTitle>
            <DialogDescription>
              Please select an account to continue.
            </DialogDescription>
          </DialogHeader>

          <Select placeholder="Select an account" 
          options={accountOptions}
          onCreate={onCreateAccount}
          onChange={(value) => selectValue.current = value}
          disabled={accountMutation.isPending || accountQuery.isLoading} 
          />

          <DialogFooter>
            <Button variant={"outline"} onClick={handleCancel}>
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
