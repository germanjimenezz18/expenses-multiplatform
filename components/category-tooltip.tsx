import { formatCurrency } from "@/lib/utils";
import { Separator } from "./ui/separator";

export default function CategoryTooltip({ active, payload }: any) {
  if (!(active && Array.isArray(payload)) || payload.length === 0) return null;

  const firstItem = payload[0];

  if (!firstItem) return null;

  const name = firstItem.payload?.name ?? "Unknown";
  const value = Number(firstItem.value) || 0;

  return (
    <div className="overflow-hidden rounded-sm border bg-muted shadow-sm">
      <div className="bg-white/10 p-2 px-3 text-sm">{name}</div>
      <Separator />

      <div className="space-y-1 p-2 px-3">
        <div className="flex items-center justify-between gap-x-4">
          <div>
            <div className="size-1.5 rounded-full bg-rose-500" />
            <p className="text-muted-foreground text-sm">Expenses</p>
          </div>
          <p className="text-right font-medium text-sm">
            {formatCurrency(value * -1)}
          </p>
        </div>
      </div>
    </div>
  );
}
