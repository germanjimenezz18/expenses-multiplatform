"use client";
import AccountFilter from "./account-filter";
import DateFilter from "./date-filter";

interface FiltersProps {
  className?: string;
}

export default function Filters({ className }: FiltersProps) {
  return (
    <div className={`flex flex-col lg:flex-row items-center gap-y-2 lg:gap-y-0 lg:gap-x-2 ${className}`}>
        <AccountFilter />
        <DateFilter />
    </div>
  )
}
