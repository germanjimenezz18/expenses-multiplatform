import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useConfirm } from "@/hooks/use-confirm";

interface EditSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  deleteConfirmTitle?: string;
  deleteConfirmMessage?: string;
  isLoading: boolean;
  onDelete?: () => void;
  formComponent: ReactNode;
}

export function EditSheet({
  isOpen,
  onClose,
  title,
  description,
  deleteConfirmTitle = "Are you sure?",
  deleteConfirmMessage = "You are about to delete this item.",
  isLoading,
  onDelete,
  formComponent,
}: EditSheetProps) {
  const showConfirmDialog = !!onDelete;
  const [ConfirmDialog, confirm] = useConfirm(
    deleteConfirmTitle,
    deleteConfirmMessage
  );

  const _handleDelete = async () => {
    if (!onDelete) return;
    const ok = await confirm();
    if (ok) {
      onDelete();
    }
  };

  return (
    <>
      {showConfirmDialog && <ConfirmDialog />}
      <Sheet onOpenChange={onClose} open={isOpen}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>

          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            formComponent
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
