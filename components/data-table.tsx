"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type Table as ReactTable,
  type Row,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Trash } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useConfirm } from "@/hooks/use-confirm";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

// Context type exposed to filter components
export interface DataTableFilterContext<TData> {
  table: ReactTable<TData>;
  columnFilters: ColumnFiltersState;
  setColumnFilter: (columnId: string, value: unknown) => void;
  clearColumnFilter: (columnId: string) => void;
  clearAllFilters: () => void;
}

// Render prop type for custom filters
export type DataTableFilterRenderProp<TData> = (
  context: DataTableFilterContext<TData>
) => React.ReactNode;

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterKey: string;
  onDelete: (rows: Row<TData>[]) => void;
  disabled?: boolean;
  hideSearch?: boolean;
  // Render prop for custom filters with table state access
  renderFilters?: DataTableFilterRenderProp<TData>;
  // Simple slot for filters that don't need table state
  filterSlot?: React.ReactNode;
  // Customize filter bar layout
  filterBarClassName?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterKey,
  onDelete,
  disabled,
  hideSearch = false,
  renderFilters,
  filterSlot,
  filterBarClassName,
}: DataTableProps<TData, TValue>) {
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "Your are about to permorm a bulk delete."
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  // Memoized filter helpers for render prop
  const setColumnFilter = useCallback(
    (columnId: string, value: unknown) => {
      table.getColumn(columnId)?.setFilterValue(value);
    },
    [table]
  );

  const clearColumnFilter = useCallback(
    (columnId: string) => {
      table.getColumn(columnId)?.setFilterValue(undefined);
    },
    [table]
  );

  const clearAllFilters = useCallback(() => {
    setColumnFilters([]);
  }, []);

  // Context value for render prop
  const filterContext = useMemo<DataTableFilterContext<TData>>(
    () => ({
      table,
      columnFilters,
      setColumnFilter,
      clearColumnFilter,
      clearAllFilters,
    }),
    [table, columnFilters, setColumnFilter, clearColumnFilter, clearAllFilters]
  );

  // Determine what to render in the filter bar
  const hasCustomFilters = Boolean(renderFilters) || Boolean(filterSlot);
  const showDefaultSearch = !(hideSearch || hasCustomFilters);

  return (
    <div>
      <ConfirmDialog />
      <div className={cn("mb-2 flex items-center gap-2", filterBarClassName)}>
        {/* Default search input (backwards compatible) */}
        {showDefaultSearch && (
          <Input
            className="max-w-sm"
            onChange={(event) =>
              table.getColumn(filterKey)?.setFilterValue(event.target.value)
            }
            placeholder={`Filter ${filterKey}...`}
            value={
              (table.getColumn(filterKey)?.getFilterValue() as string) ?? ""
            }
          />
        )}

        {/* Render prop for custom filters with table state access */}
        {renderFilters?.(filterContext)}

        {/* Simple slot for filters that don't need table state */}
        {filterSlot}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  data-state={row.getIsSelected() && "selected"}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="h-24 text-center"
                  colSpan={columns.length}
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-muted-foreground text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <Button
            className="ml-auto"
            disabled={disabled}
            onClick={async () => {
              const ok = await confirm();
              if (ok) {
                onDelete(table.getFilteredSelectedRowModel().rows);
                table.resetRowSelection();
              }
            }}
            size={"sm"}
            variant={"destructive"}
          >
            <Trash className="size-4" />
            Delete ({table.getFilteredSelectedRowModel().rows.length})
          </Button>
        )}
        <Button
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
          size="sm"
          variant="outline"
        >
          Previous
        </Button>
        <Button
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
          size="sm"
          variant="outline"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
