"use client";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { toast } from "sonner";
import { useExtractReceipt } from "@/features/receipts/api/use-extract-receipt";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";

export interface ReceiptDropzoneHandle {
  trigger: () => void;
}

const ReceiptDropzone = forwardRef<ReceiptDropzoneHandle>((_props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const mutation = useExtractReceipt();
  const newTransaction = useNewTransaction();

  useImperativeHandle(ref, () => ({
    trigger: () => {
      inputRef.current?.click();
    },
  }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    newTransaction.onOpenScanning();

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(",")[1];
      mutation.mutate(
        { image: base64 },
        {
          onSuccess: (result) => {
            if ("error" in result) {
              toast.error(result.error);
              newTransaction.onClose();
              return;
            }
            newTransaction.setScanResult(
              result.data as unknown as Record<string, unknown>
            );
          },
          onError: () => {
            newTransaction.onClose();
          },
        }
      );
    };
    reader.readAsDataURL(file);

    // Reset input so the same file can be selected again
    e.target.value = "";
  };

  return (
    <input
      accept="image/*"
      className="hidden"
      onChange={handleFileChange}
      ref={inputRef}
      type="file"
    />
  );
});

ReceiptDropzone.displayName = "ReceiptDropzone";

export default ReceiptDropzone;
