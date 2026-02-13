"use client";

import { format, subDays } from "date-fns";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { formatDateRange } from "@/lib/utils";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";

export default function DateFilter() {
  const router = useRouter();
  const pathname = usePathname();

  const params = useSearchParams();
  const accountId = params.get("accountId");
  const from = params.get("from") || "";
  const to = params.get("to") || "";

  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);
  const paramState = {
    from: from ? new Date(from) : defaultFrom,
    to: to ? new Date(to) : defaultTo,
    accountId,
  };
  const [date, setDate] = useState<DateRange | undefined>(paramState);
  const pushToUrl = (dateRange: DateRange | undefined) => {
    const query = {
      from: format(dateRange?.from || defaultFrom, "yyyy-MM-dd"),
      to: format(dateRange?.to || defaultTo, "yyyy-MM-dd"),
    };

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query,
      },
      { skipNull: true, skipEmptyString: true }
    );
    router.push(url);
  };

  const onReset = () => {
    setDate(undefined);
    pushToUrl(undefined);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="h-9 w-full rounded-md border bg-transparent px-3 font-normal outline-none transition hover:bg-secondary focus:ring-transparent focus:ring-offset-0 lg:w-auto"
          disabled={false}
          size={"sm"}
          variant={"outline"}
        >
          <span>{formatDateRange(paramState)}</span>
          <ChevronDown className="ml-2 size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-full p-0 lg:w-auto">
        <Calendar
          defaultMonth={date?.from}
          disabled={false}
          initialFocus
          mode="range"
          numberOfMonths={2}
          onSelect={setDate}
          selected={date}
        />
        <div className="flex w-full items-center gap-x-2 p-4">
          <PopoverClose asChild />

          <Button
            className="w-full"
            disabled={!(date?.from && date?.to)}
            onClick={onReset}
            variant={"outline"}
          >
            Reset
          </Button>
          <Button
            className="w-full"
            disabled={!(date?.from && date?.to)}
            onClick={() => pushToUrl(date)}
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
