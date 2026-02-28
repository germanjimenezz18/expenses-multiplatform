"use client";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExtractReceipt } from "@/features/receipts/api/use-extract-receipt";

interface Props {
  onCancel: () => void;
}

export default function ReceiptDropzone({ onCancel }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const mutation = useExtractReceipt();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(",")[1];
      setPreview(URL.createObjectURL(file));
      mutation.mutate({ image: base64 });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid lg:grid-cols-1 xl:grid-cols-1">
      <div className="w-full">
        <Card className="drop-shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between gap-y-2">
            <CardTitle className="line-clamp-1 text-xl">Scan Receipt</CardTitle>
            <Button onClick={onCancel} size="sm" variant="outline">
              Cancel
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <input
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                ref={inputRef}
                type="file"
              />
              <Button
                disabled={mutation.isPending}
                onClick={() => inputRef.current?.click()}
                size="sm"
              >
                {mutation.isPending ? "Extracting..." : "Select Image"}
              </Button>
            </div>

            {preview && (
              <img
                alt="Receipt preview"
                className="max-h-64 rounded border object-contain"
                src={preview}
              />
            )}

            {mutation.isPending && (
              <p className="text-muted-foreground text-sm">
                Analyzing receipt...
              </p>
            )}

            {mutation.isError && (
              <p className="text-destructive text-sm">
                {mutation.error.message}
              </p>
            )}

            {mutation.data && (
              <pre className="max-h-96 overflow-auto rounded bg-muted p-4 text-xs">
                {JSON.stringify(mutation.data, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
