"use client";

import { Delete, Edit, MoreHorizontal, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNewAccountBalance } from "@/features/account-balances/hooks/use-new-account-balance";
import { useDeleteAccount } from "@/features/accounts/api/use-delete-account";
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { useConfirm } from "@/hooks/use-confirm";

interface Props {
  id: string;
}

export default function Actions({ id }: Props) {
  const { onOpen } = useOpenAccount();
  const { onOpen: onOpenBalanceCheck } = useNewAccountBalance();
  const deleteMutation = useDeleteAccount(id);
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this account."
  );
  const handleDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutation.mutate();
    }
  };
  return (
    <>
      <ConfirmDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="size-8 p-0" variant={"ghost"}>
            <MoreHorizontal className="h-5 w-5 text-primary" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem disabled={false} onClick={() => onOpen(id)}>
            <Edit className="mr-2 size-4 text-primary" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem disabled={false} onClick={() => onOpenBalanceCheck(id)}>
            <PlusCircle className="mr-2 size-4 text-primary" />
            New Balance Check
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={deleteMutation.isPending}
            onClick={handleDelete}
          >
            <Delete className="mr-2 size-4 text-primary" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
