import { Info, MinusCircle, PlusCircle } from "lucide-react";
import CurrencyInput from "react-currency-input-field";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface Props {
  value: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const AmountInput = ({
  value,
  onChange,
  placeholder,
  disabled,
}: Props) => {
  const parsedValue = Number.parseFloat(value);
  const isIncome = parsedValue > 0;
  const isExpense = parsedValue < 0;

  const onReverseValue = () => {
    if (!value) return;
    const newValue = Number.parseFloat(value) * -1;
    onChange(newValue.toString());
  };

  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <button
              className={cn(
                "absolute top-1.5 left-1.5 items-center justify-center rounded-md border p-2 transition hover:bg-slate-100",
                isIncome && "bg-emerald-500 text-white hover:bg-emerald-600",
                isExpense && "bg-rose-500 text-white hover:bg-rose-600"
              )}
              onClick={onReverseValue}
              type="button"
            >
              {!parsedValue && <Info className="size-3" />}
              {isIncome && <PlusCircle className="size-3" />}
              {isExpense && <MinusCircle className="size-3" />}
            </button>
          </TooltipTrigger>

          <TooltipContent>
            Use [+] for income and [-] for expenses
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <CurrencyInput
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        decimalScale={2}
        decimalsLimit={2}
        disabled={disabled}
        onValueChange={onChange}
        placeholder={placeholder}
        value={value}
      />

      <p className="mt-2 text-muted-foreground text-xs">
        {isIncome && "This will count as income"}
        {isExpense && "This will count as an expense"}
      </p>
    </div>
  );
};
