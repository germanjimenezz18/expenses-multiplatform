"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { useDeleteTransaction } from "@/features/transactions/api/use-delete-transaction";
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";
import { useConfirm } from "@/hooks/use-confirm";
import { Delete, Edit, MoreHorizontal } from "lucide-react";

type Props = {
  id: string;
};

export default function Actions({ id }: Props) {
  const { onOpen } = useOpenTransaction();
  const deleteMutation = useDeleteTransaction(id);
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this transaction."
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
          <Button variant={"ghost"} className=" size-8 p-0">
            <MoreHorizontal className="h-5 w-5 text-primary" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem disabled={false} onClick={() => onOpen(id)}>
            <Edit className="size-4 mr-2 text-primary" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={deleteMutation.isPending}
            onClick={handleDelete}
          >
            <Delete className="size-4 mr-2 text-primary" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
