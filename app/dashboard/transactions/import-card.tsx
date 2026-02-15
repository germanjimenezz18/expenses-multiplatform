import { format, isValid, parse } from "date-fns";
import { Check, DoorClosed, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { convertAmountToMiliUnits } from "@/lib/utils";
import ImportTable from "./import-table";

const DATE_FORMAT_OPTIONS = [
  // Europeo (día primero) - todos los separadores
  { value: "dd/MM/yyyy", label: "DD/MM/YYYY", example: "09/02/2026" },
  { value: "dd-MM-yyyy", label: "DD-MM-YYYY", example: "09-02-2026" },
  { value: "dd.MM.yyyy", label: "DD.MM.YYYY", example: "09.02.2026" },

  // Americano (mes primero) - todos los separadores
  { value: "MM/dd/yyyy", label: "MM/DD/YYYY", example: "02/09/2026" },
  { value: "MM-dd-yyyy", label: "MM-DD-YYYY", example: "02-09-2026" },
  { value: "MM.dd.yyyy", label: "MM.DD.YYYY", example: "02.09.2026" },

  // ISO (año primero) - todos los separadores
  { value: "yyyy-MM-dd", label: "YYYY-MM-DD (ISO)", example: "2026-02-09" },
  { value: "yyyy/MM/dd", label: "YYYY/MM/DD", example: "2026/02/09" },
  { value: "yyyy.MM.dd", label: "YYYY.MM.DD", example: "2026.02.09" },

  // Con hora - variaciones más comunes
  {
    value: "dd/MM/yyyy HH:mm:ss",
    label: "DD/MM/YYYY HH:mm:ss",
    example: "09/02/2026 14:30:00",
  },
  {
    value: "dd-MM-yyyy HH:mm:ss",
    label: "DD-MM-YYYY HH:mm:ss",
    example: "09-02-2026 14:30:00",
  },
  {
    value: "MM/dd/yyyy HH:mm:ss",
    label: "MM/DD/YYYY HH:mm:ss",
    example: "02/09/2026 14:30:00",
  },
  {
    value: "MM-dd-yyyy HH:mm:ss",
    label: "MM-DD-YYYY HH:mm:ss",
    example: "02-09-2026 14:30:00",
  },
  {
    value: "yyyy-MM-dd HH:mm:ss",
    label: "YYYY-MM-DD HH:mm:ss",
    example: "2026-02-09 14:30:00",
  },
  {
    value: "yyyy/MM/dd HH:mm:ss",
    label: "YYYY/MM/DD HH:mm:ss",
    example: "2026/02/09 14:30:00",
  },

  // ISO 8601 con T
  {
    value: "yyyy-MM-dd'T'HH:mm:ss",
    label: "YYYY-MM-DDTHH:mm:ss (ISO 8601)",
    example: "2026-02-09T14:30:00",
  },
];

const outputFormat = "yyyy-MM-dd";
const requiredOptions = ["amount", "date", "payee"];

interface SelectedColumnsState {
  [key: string]: string | null;
}

interface Props {
  data: string[][];
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

export default function ImportCard({ data, onCancel, onSubmit }: Props) {
  const [selectedColumns, setSelectedColumns] = useState<SelectedColumnsState>(
    {}
  );
  const [selectedDateFormat, setSelectedDateFormat] =
    useState<string>("dd/MM/yyyy");

  const headers = data[0];
  const body = data.slice(1);

  const getFirstDateValue = (): string | null => {
    const dateColumnKey = Object.entries(selectedColumns).find(
      ([_, value]) => value === "date"
    )?.[0];

    if (!dateColumnKey) return null;
    const colIndex = Number.parseInt(dateColumnKey.replace("column_", ""));
    return body[0]?.[colIndex] || null;
  };

  const datePreview = useMemo(() => {
    const firstDate = getFirstDateValue();
    if (!firstDate) return null;

    try {
      const parsed = parse(firstDate, selectedDateFormat, new Date());
      if (!isValid(parsed)) return { success: false, original: firstDate };
      return {
        success: true,
        original: firstDate,
        parsed: format(parsed, outputFormat),
      };
    } catch {
      return { success: false, original: firstDate };
    }
  }, [selectedColumns, body, selectedDateFormat]);

  const onTableHeadSelectChange = (
    columnIndex: number,
    value: string | null
  ) => {
    setSelectedColumns((prev) => {
      /* TODO ESTO ESTA RARO */
      const newSelectedColumns = { ...prev };
      for (const key in newSelectedColumns) {
        if (newSelectedColumns[key] === value) {
          newSelectedColumns[key] = null;
        }
      }

      if (value === "skip") {
        value = null;
      }

      newSelectedColumns[`column_${columnIndex}`] = value;
      return newSelectedColumns;
    });
  };

  const progress = Object.values(selectedColumns).filter(Boolean).length;

  const handleContinue = () => {
    const getColumnIndex = (column: string) => {
      return column.split("_")[1];
    };

    const mappedData = {
      header: headers.map((_header, index) => {
        const columnIndex = getColumnIndex(`column_${index}`);
        return selectedColumns[`column_${columnIndex}`] || null;
      }),
      body: body
        .map((row) => {
          const transformedRow = row.map((cell, index) => {
            const columnIndex = getColumnIndex(`column_${index}`);
            return selectedColumns[`column_${columnIndex}`] ? cell : null;
          });

          return transformedRow.every((item) => item === null)
            ? []
            : transformedRow;
        })
        .filter((row) => row.length > 0),
    };

    const arrayOfData = mappedData.body.map((row) => {
      return row.reduce((acc: any, cell, index) => {
        const header = mappedData.header[index];
        if (header !== null) {
          acc[header] = cell;
        }

        return acc;
      }, {});
    });

    try {
      const formattedData = arrayOfData.map((item, index) => {
        const parsed = parse(item.date, selectedDateFormat, new Date());
        if (!isValid(parsed)) {
          throw new Error(
            `Row ${index + 1}: Cannot parse date "${item.date}" with format "${selectedDateFormat}"`
          );
        }
        return {
          ...item,
          amount: convertAmountToMiliUnits(Number.parseFloat(item.amount)),
          date: format(parsed, outputFormat),
        };
      });

      onSubmit(formattedData);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error parsing dates"
      );
    }
  };

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-1 xl:grid-cols-1">
      <div className="w-full max-w-screen-1xl">
        <Card className="drop-shadow-sm">
          <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <CardTitle className="line-clamp-1 text-xl">
                Import Transaction
              </CardTitle>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Label className="text-muted-foreground text-sm">
                    Date format:
                  </Label>
                  <Select
                    onValueChange={setSelectedDateFormat}
                    value={selectedDateFormat}
                  >
                    <SelectTrigger className="w-[280px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DATE_FORMAT_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}{" "}
                          <span className="text-muted-foreground">
                            ({opt.example})
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {datePreview && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Preview:</span>
                    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                      {datePreview.original}
                    </code>
                    <span className="text-muted-foreground">→</span>
                    {datePreview.success ? (
                      <>
                        <code className="rounded bg-emerald-100 px-1.5 py-0.5 font-mono text-emerald-700 text-xs">
                          {datePreview.parsed}
                        </code>
                        <Check className="size-4 text-emerald-500" />
                      </>
                    ) : (
                      <>
                        <span className="text-destructive text-xs">
                          Wrong format
                        </span>
                        <X className="size-4 text-destructive" />
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center gap-x-2 gap-y-2 lg:flex-row">
              <Button
                className="w-full lg:w-auto"
                onClick={onCancel}
                size={"sm"}
              >
                <DoorClosed className="mr-2 size-4" />
                Cancel
              </Button>
              <Button
                className="w-full lg:w-auto"
                disabled={progress < requiredOptions.length}
                onClick={handleContinue}
                size={"sm"}
              >
                Continue ({progress} / {requiredOptions.length})
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ImportTable
              body={body}
              headers={headers}
              onTableHeadSelectChange={onTableHeadSelectChange}
              selectedColumns={selectedColumns}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
