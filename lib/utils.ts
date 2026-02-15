/** biome-ignore-all lint/suspicious/noBitwiseOperators: <explanation> */
import { type ClassValue, clsx } from "clsx";
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  startOfMonth,
  subMonths,
} from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface DatePeriod {
  from: Date;
  to: Date;
}

export function getDefaultPeriod(): DatePeriod {
  const now = new Date();
  return {
    from: startOfMonth(now),
    to: endOfMonth(now),
  };
}

export interface MonthPreset {
  label: string;
  from: Date;
  to: Date;
}

export function getMonthPresets(): MonthPreset[] {
  const now = new Date();
  return [
    { label: "This Month", from: startOfMonth(now), to: endOfMonth(now) },
    {
      label: "Last Month",
      from: startOfMonth(subMonths(now, 1)),
      to: endOfMonth(subMonths(now, 1)),
    },
    {
      label: "2 Months Ago",
      from: startOfMonth(subMonths(now, 2)),
      to: endOfMonth(subMonths(now, 2)),
    },
    {
      label: "3 Months Ago",
      from: startOfMonth(subMonths(now, 3)),
      to: endOfMonth(subMonths(now, 3)),
    },
  ];
}

export function convertAmountToMiliUnits(amount: number) {
  return Math.round(amount * 1000);
}

export function convertAmountFromMiliUnits(amount: number) {
  return amount / 1000;
}

// export function formatCurrency(value: number, currencyType: CurrencyType) {
export function formatCurrency(value: number) {
  const currencySymbol = "€";
  const formatted = new Intl.NumberFormat("en-IN", {
    // style: "currency",
    // currency: "EUR",
    // currencyDisplay: "symbol",
    notation: "standard",
    minimumFractionDigits: 2,
  }).format(value);
  return `${currencySymbol} ${formatted}`;
}

export function calculatePercentageChange(current: number, previous: number) {
  if (previous === 0) {
    return previous === current ? 0 : 100;
  }

  return ((current - previous) / previous) * 100;
}

export default function fillMissingDays(
  activeDays: {
    date: Date;
    income: number;
    expenses: number;
  }[],
  startDate: Date,
  endDate: Date
) {
  if (activeDays.length < 0) return [];

  const allDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const transactionsByDay = allDays.map((day) => {
    const found = activeDays.find((d) => isSameDay(d.date, day));
    if (found) {
      return found;
    }
    return {
      date: day,
      income: 0,
      expenses: 0,
    };
  });
  return transactionsByDay;
}

type Period = {
  from: string | Date | undefined;
  to: string | Date | undefined;
};
export function formatDateRange(period?: Period) {
  const { from: defaultFrom, to: defaultTo } = getDefaultPeriod();

  if (!period?.from) {
    return `${format(defaultFrom, "LLL dd")} - ${format(defaultTo, "LLL dd, y")}`;
  }

  if (period.to) {
    return `${format(period.from, "LLL dd")} - ${format(period.to, "LLL dd, y")}`;
  }

  return format(period.from, "LLL dd, y");
}

export function formatPercentage(
  value: number,
  options: { addPrefix?: boolean } = { addPrefix: false }
) {
  const results = new Intl.NumberFormat("en-US", {
    style: "percent",
  }).format(value / 100);

  if (options.addPrefix && value > 0) {
    return `+${results}`;
  }

  return results;
}

export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
