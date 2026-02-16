/**
 * Utility functions for the expenses application.
 *
 * This module provides core utilities used throughout the application:
 * - **Amount conversion**: Transforms between user-facing decimals and storage integers
 * - **Currency formatting**: Locale-aware money display
 * - **Date utilities**: Period defaults, range formatting, and chart data preparation
 * - **Styling helpers**: Tailwind class merging
 *
 * @module lib/utils
 */

/** biome-ignore-all lint/suspicious/noBitwiseOperators: not needed */
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

/**
 * Merges Tailwind CSS classes with proper conflict resolution.
 *
 * Combines `clsx` for conditional classes with `tailwind-merge` to handle
 * Tailwind class conflicts (e.g., `bg-red-500 bg-blue-500` → `bg-blue-500`).
 *
 * @param inputs - Class values (strings, objects, arrays) to merge
 * @returns Merged class string with conflicts resolved
 *
 * @example
 * ```typescript
 * cn("px-4 py-2", isActive && "bg-primary", className)
 * cn("text-sm", { "font-bold": isBold, "text-muted": isDisabled })
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Represents a date range with start and end dates.
 * Used for filtering transactions and generating reports.
 */
export interface DatePeriod {
  from: Date;
  to: Date;
}

/**
 * Used when no date filter is specified.
 *
 * @returns Date period covering the current month
 *
 * @example
 * ```typescript
 * const { from, to } = getDefaultPeriod();
 * // If today is Feb 15, 2024: from = Feb 1, to = Feb 29
 * ```
 */
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

/**
 * Returns preset date ranges for the last 4 months.
 *
 * Provides quick-select options for date pickers, allowing users to
 * easily filter by recent months without manual date selection.
 *
 * @returns Array of month presets: This Month, Last Month, 2 Months Ago, 3 Months Ago
 *
 * @example
 * ```typescript
 * const presets = getMonthPresets();
 * // Returns: [{ label: "This Month", from: Date, to: Date }, ...]
 * ```
 */
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
 * IMPORTANT: Converts a decimal amount to miliUnits for database storage.
 *
 * We store monetary amounts as integers multiplied by 1000 to avoid
 * floating-point precision issues (e.g., `0.1 + 0.2 !== 0.3` in JavaScript).
 * This is the standard pattern for financial calculations.
 *
 * **Data Flow:**
 * 1. User enters "10.50" in form
 * 2. Form stores as string "10.50"
 * 3. Before API call: `convertAmountToMiliUnits(parseFloat("10.50"))` → 10500
 * 4. Database stores: 10500 (integer)
 *
 * @param amount - The decimal amount from user input (e.g., 10.50)
 * @returns Integer in miliUnits (e.g., 10500) ready for API/database
 *
 * @example
 * ```typescript
 * // In form submit handler, before calling API
 * const amountForApi = convertAmountToMiliUnits(parseFloat(formValues.amount));
 * mutation.mutate({ ...formValues, amount: amountForApi });
 * ```
 *
 * @see convertAmountFromMiliUnits - for displaying stored values back to users
 */
export function convertAmountToMiliUnits(amount: number) {
  return Math.round(amount * 1000);
}

/**
 * Converts miliUnits from storage back to decimal for display.
 *
 * The reverse of `convertAmountToMiliUnits`. Use this when displaying
 * amounts from the database to users, or when populating form defaults
 * for editing.
 *
 * **Data Flow:**
 * 1. Database returns: 10500 (integer)
 * 2. For display: `convertAmountFromMiliUnits(10500)` → 10.50
 * 3. UI shows: "€ 10.50"
 *
 * @param amount - Integer amount in miliUnits from database (e.g., 10500)
 * @returns Decimal amount for display (e.g., 10.50)
 *
 * @example
 * ```typescript
 * // When loading transaction for editing
 * const displayAmount = convertAmountFromMiliUnits(transaction.amount);
 * form.reset({ amount: displayAmount.toString() });
 *
 * // When displaying in a table cell
 * formatCurrency(convertAmountFromMiliUnits(row.amount))
 * ```
 *
 * @see convertAmountToMiliUnits - for storing user input
 * @see formatCurrency - for formatting the result as currency string
 */
export function convertAmountFromMiliUnits(amount: number) {
  return amount / 1000;
}

/**
 * Formats a number as a currency string with Euro symbol.
 *
 * Uses `Intl.NumberFormat` for locale-aware number formatting with
 * Indian numbering system (lakh/crore grouping). Always shows 2 decimal places.
 *
 * @param value - Decimal amount to format (already converted from miliUnits)
 * @returns Formatted currency string (e.g., "€ 1,234.56")
 *
 * @example
 * ```typescript
 * formatCurrency(1234.5)  // "€ 1,234.50"
 * formatCurrency(0)       // "€ 0.00"
 *
 * // Typical usage with database values
 * formatCurrency(convertAmountFromMiliUnits(transaction.amount))
 * ```
 */
export function formatCurrency(value: number) {
  const currencySymbol = "€";
  const formatted = new Intl.NumberFormat("en-IN", {
    notation: "standard",
    minimumFractionDigits: 2,
  }).format(value);
  return `${formatted} ${currencySymbol}`;
}

/**
 * Calculates the percentage change between two values.
 *
 * Used for period-over-period comparisons in analytics dashboards
 * (e.g., "Income increased 25% from last month").
 *
 * **Edge cases:**
 * - If `previous` is 0 and `current` is also 0: returns 0 (no change)
 * - If `previous` is 0 and `current` is non-zero: returns 100 (infinite growth capped)
 *
 * @param current - The current period's value
 * @param previous - The previous period's value (comparison baseline)
 * @returns Percentage change as a number (e.g., 25 for 25% increase, -10 for 10% decrease)
 *
 * @example
 * ```typescript
 * calculatePercentageChange(120, 100)  // 20 (20% increase)
 * calculatePercentageChange(80, 100)   // -20 (20% decrease)
 * calculatePercentageChange(100, 0)    // 100 (growth from zero)
 * calculatePercentageChange(0, 0)      // 0 (no change)
 * ```
 */
export function calculatePercentageChange(current: number, previous: number) {
  if (previous === 0) {
    return previous === current ? 0 : 100;
  }

  return ((current - previous) / previous) * 100;
}

/**
 * Fills gaps in time-series data with zero values for chart display.
 *
 * Charts need continuous data points for every day in a range, but the
 * database only returns days with actual transactions. This function
 * creates a complete series by inserting zero-value entries for missing days.
 *
 * **Use case:** Area charts showing income/expenses over time. Without
 * filling gaps, the chart would incorrectly connect data points across
 * missing days.
 *
 * @param activeDays - Array of days that have actual transaction data
 * @param startDate - First day of the chart range
 * @param endDate - Last day of the chart range
 * @returns Complete array with all days in range, missing days filled with zeros
 *
 * @example
 * ```typescript
 * // API returns only days with transactions
 * const activeDays = [
 *   { date: new Date("2024-01-01"), income: 1000, expenses: 500 },
 *   { date: new Date("2024-01-03"), income: 200, expenses: 0 },
 * ];
 *
 * // Fill in Jan 2nd which had no transactions
 * const chartData = fillMissingDays(
 *   activeDays,
 *   new Date("2024-01-01"),
 *   new Date("2024-01-03")
 * );
 * // Result includes: Jan 1 (data), Jan 2 (zeros), Jan 3 (data)
 * ```
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

/**
 * Flexible period input that accepts strings (from URL params) or Date objects.
 */
interface Period {
  from: string | Date | undefined;
  to: string | Date | undefined;
}

/**
 * Formats a date range for display in headers and breadcrumbs.
 *
 * Handles various input scenarios gracefully:
 * - No period provided: Shows current month as default
 * - Only `from` date: Shows single date
 * - Full range: Shows "Jan 01 - Jan 31, 2024" format
 *
 * @param period - Optional date range (can contain strings from URL or Date objects)
 * @returns Human-readable date range string
 *
 * @example
 * ```typescript
 * // With full range
 * formatDateRange({ from: new Date("2024-01-01"), to: new Date("2024-01-31") })
 * // "Jan 01 - Jan 31, 2024"
 *
 * // With URL params (strings)
 * const searchParams = useSearchParams();
 * formatDateRange({ from: searchParams.get("from"), to: searchParams.get("to") })
 *
 * // No params - shows current month
 * formatDateRange()  // "Feb 01 - Feb 29, 2024" (if current month is February)
 * ```
 */
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

/**
 * Formats a number as a percentage string.
 *
 * Converts raw percentage values (e.g., 25 for 25%) to formatted strings.
 * Optionally adds a "+" prefix for positive values to indicate growth.
 *
 * @param value - Percentage as a number (25 = 25%, not 0.25)
 * @param options - Formatting options
 * @param options.addPrefix - If true, adds "+" before positive percentages
 * @returns Formatted percentage string (e.g., "25%", "+25%", "-10%")
 *
 * @example
 * ```typescript
 * formatPercentage(25)                      // "25%"
 * formatPercentage(25, { addPrefix: true }) // "+25%"
 * formatPercentage(-10, { addPrefix: true }) // "-10%" (negative keeps its sign)
 *
 * // Typical usage with calculatePercentageChange
 * const change = calculatePercentageChange(120, 100); // 20
 * formatPercentage(change, { addPrefix: true }); // "+20%"
 * ```
 */
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

/**
 * Generates a UUID v4 string for client-side unique identifiers.
 *
 * **Note:** For database IDs, prefer `createId()` from `@paralleldrive/cuid2` use this only for
 * client-side temporary identifiers.
 *
 * @returns UUID v4 string (e.g., "550e8400-e29b-41d4-a716-446655440000")
 *
 * @example
 * ```typescript
 * const tempId = generateUUID();
 * // Use for React keys or client-side tracking before server round-trip
 * ```
 */
export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
