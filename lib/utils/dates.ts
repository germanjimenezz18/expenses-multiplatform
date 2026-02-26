import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  startOfMonth,
  subMonths,
} from "date-fns";

/** Range used for date filters. */
export interface DatePeriod {
  from: Date;
  to: Date;
}

/** Returns current month range as default period. */
export function getDefaultPeriod(): DatePeriod {
  const now = new Date();
  return {
    from: startOfMonth(now),
    to: endOfMonth(now),
  };
}

/** Preset option for month selectors. */
export interface MonthPreset {
  label: string;
  from: Date;
  to: Date;
}

/** Returns quick month presets for current and previous 3 months. */
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

/**
 * Fills missing days in a date interval with zero values for chart continuity.
 */
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

interface Period {
  from: string | Date | undefined;
  to: string | Date | undefined;
}

/** Formats a date range for UI labels and headers. */
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
