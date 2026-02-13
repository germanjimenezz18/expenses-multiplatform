import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Props = {
  columnIndex: number;
  selectedColumns: Record<string, string | null>;
  onChange: (columnIndex: number, value: string | null) => void;
};

const options = ["amount", "payee", "date"];

export default function TableHeadSelect({
  columnIndex,
  selectedColumns,
  onChange,
}: Props) {
  const currentSelection = selectedColumns[`column_${columnIndex}`];

  return (
    <Select
      onValueChange={(value) => onChange(columnIndex, value)}
      value={currentSelection || ""}
    >
      <SelectTrigger
        className={cn(
          "border-none bg-transparent capitalize outline-none focus:ring-transparent focus:ring-offset-0",
          currentSelection && "text-emerald-500"
        )}
      >
        <SelectValue placeholder="skip" />
      </SelectTrigger>
      <SelectContent className="">
        <SelectItem value="skip">Skip</SelectItem>
        {options.map((option, index) => {
          const disabled =
            Object.values(selectedColumns).includes(option) &&
            currentSelection !== option;

          return (
            <SelectItem
              className="capitalize"
              disabled={disabled}
              key={index}
              value={option}
            >
              {option}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
