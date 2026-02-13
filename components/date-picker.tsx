"use client";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import type { SelectSingleEventHandler } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type Props = {
  value?: Date;
  onChange?: SelectSingleEventHandler;
  disabled?: boolean;
};

export const DatePicker = ({ value, onChange, disabled }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "w-full justify-start font-normal text-left,",
            !value && "text-muted-foreground"
          )}
          disabled={disabled}
          variant={"outline"}
        >
          <CalendarIcon className="mr-2 size-4" />
          {value ? format(value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar
          disabled={disabled}
          initialFocus
          mode="single"
          onSelect={onChange}
          selected={value}
        />
      </PopoverContent>
    </Popover>
  );
};
