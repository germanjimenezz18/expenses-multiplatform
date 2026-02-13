"use client";
import AccountFilter from "./account-filter";
import DateFilter from "./date-filter";

interface FiltersProps {
  className?: string;
}

export default function Filters({ className }: FiltersProps) {
  return (
    <div
      className={`flex flex-col items-center gap-y-2 lg:flex-row lg:gap-x-2 lg:gap-y-0 ${className}`}
    >
      <AccountFilter />
      <DateFilter />
    </div>
  );
}
