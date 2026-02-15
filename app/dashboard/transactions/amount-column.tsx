"use client";

import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";
import { cn, formatCurrency } from "@/lib/utils";

interface Props {
  amount: number;
  id: string;
}

export default function AmountColumn({ amount, id }: Props) {
  const { onOpen } = useOpenTransaction();

  return (
    <button
      className={cn(
        "cursor-pointer font-medium hover:underline",
        amount < 0 ? "text-rose-500" : "text-emerald-500"
      )}
      onClick={() => onOpen(id, "amount")}
      type="button"
    >
      {formatCurrency(amount)}
    </button>
  );
}
