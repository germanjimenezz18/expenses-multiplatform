import type { ColumnDef, Row } from "@tanstack/react-table";
import { Loader2, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ResourcePageLayoutProps<TData> {
  title: string;
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  filterKey: string;
  isLoading: boolean;
  isPending: boolean;
  onAddNew: () => void;
  onDelete: (rows: Row<TData>[]) => void;
  gridCols?: string;
  loadingSlot?: ReactNode;
}

export function ResourcePageLayout<TData>({
  title,
  data,
  columns,
  filterKey,
  isLoading,
  isPending,
  onAddNew,
  onDelete,
  gridCols = "lg:grid-cols-3",
  loadingSlot,
}: ResourcePageLayoutProps<TData>) {
  if (isLoading) {
    return (
      <div
        className={`grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 ${gridCols}`}
      >
        <div className="mx-auto w-full max-w-screen-2xl">
          <Card className="drop-shadow-sm">
            <CardHeader>
              <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent>
              {loadingSlot || (
                <div className="flex h-[500px] w-full items-center justify-center">
                  <Loader2 className="size-6 animate-spin text-slate-300" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 ${gridCols}`}
    >
      <div className="mx-auto w-full max-w-screen-2xl">
        <Card className="drop-shadow-sm">
          <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="line-clamp-1 text-xl">{title}</CardTitle>
            <Button onClick={onAddNew} size="sm">
              <Plus className="mr-2 size-4" />
              Add New
            </Button>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={data}
              disabled={isPending}
              filterKey={filterKey}
              onDelete={onDelete}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
