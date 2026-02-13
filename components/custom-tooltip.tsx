import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { Separator } from "./ui/separator";

export default function CustomTooltip({ active, payload }: any) {
  if (!active) return null;

  const date = payload[0].payload.date;
  const income = payload[0].value;
  const expenses = payload[0].value;

  return (
    <div className="overflow-hidden rounded-sm border bg-muted shadow-sm">
      <div className="bg-white/10 p-2 px-3 text-sm">
        {format(date, "MMM dd, yyyy")}
      </div>

      <Separator />

      <div className="space-y-1 p-2 px-3">
        <div className="flex items-center justify-between gap-x-4">
          <div>
            <div className="size-1.5 rounded-full bg-blue-500" />
            <p className="text-muted-foreground text-sm">Income</p>
          </div>
          <p className="text-right font-medium text-sm">
            {formatCurrency(income)}
          </p>
        </div>
      </div>

      <div className="space-y-1 p-2 px-3">
        <div className="flex items-center justify-between gap-x-4">
          <div>
            <div className="size-1.5 rounded-full bg-rose-500" />
            <p className="text-muted-foreground text-sm">Expenses</p>
          </div>
          <p className="text-right font-medium text-sm">
            {formatCurrency(expenses * -1)}
          </p>
        </div>
      </div>
    </div>
  );
}
