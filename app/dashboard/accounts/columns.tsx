"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import type { InferResponseType } from "hono";
import { ArrowUpDown, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { client } from "@/lib/hono";
import { convertAmountFromMiliUnits, formatCurrency } from "@/lib/utils";
import Actions from "./actions";

export type ResponseType = InferResponseType<
  typeof client.api.accounts.$get,
  200
>["data"][0];

export const columns: ColumnDef<ResponseType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          variant="ghost"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "balance",
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          variant="ghost"
        >
          Balance
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = row.getValue("balance") as number;
      return (
        <div className="text-right font-medium">
          {formatCurrency(convertAmountFromMiliUnits(amount))}
        </div>
      );
    },
  },
  {
    accessorKey: "lastCheckedBalance",
    header: "Last Balance",
    cell: ({ row }) => {
      const amount = row.getValue("lastCheckedBalance") as number | null;
      return (
        <div className="text-right">
          {amount !== null
            ? formatCurrency(convertAmountFromMiliUnits(amount))
            : "Never"}
        </div>
      );
    },
  },
  {
    accessorKey: "lastCheckedDate",
    header: "Last Checked Date",
    cell: ({ row }) => {
      const date = row.getValue("lastCheckedDate") as string | null;
      return (
        <div className="text-center">
          {date ? format(new Date(date), "MMM dd, yyyy") : "—"}
        </div>
      );
    },
  },
  {
    accessorKey: "expectedBalance",
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          variant="ghost"
        >
          Expected Balance
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const expectedBalance = row.getValue("expectedBalance") as number;
      const lastCheckedBalance = row.getValue("lastCheckedBalance") as
        | number
        | null;
      const difference =
        lastCheckedBalance !== null ? expectedBalance - lastCheckedBalance : 0;
      const isBalanced = Math.abs(difference) < 10; // Less than 0.01 difference (in miliUnits)

      return (
        <div className="flex items-center justify-end gap-2">
          <span className="font-medium">
            {formatCurrency(convertAmountFromMiliUnits(expectedBalance))}
          </span>
          {lastCheckedBalance !== null &&
            (isBalanced ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions id={row.original.id} />,
  },
];
