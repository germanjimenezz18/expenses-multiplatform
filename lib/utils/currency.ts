/**
 * Converts a decimal amount to miliUnits for storage.
 * Example: 10.50 -> 10500
 */
export function convertAmountToMiliUnits(amount: number) {
  return Math.round(amount * 1000);
}

/**
 * Converts stored miliUnits back to decimal amount.
 * Example: 10500 -> 10.50
 */
export function convertAmountFromMiliUnits(amount: number) {
  return amount / 1000;
}

/**
 * Formats a decimal amount as currency.
 */
export function formatCurrency(value: number) {
  const currencySymbol = "€";
  const formatted = new Intl.NumberFormat("en-IN", {
    notation: "standard",
    minimumFractionDigits: 2,
  }).format(value);
  return `${formatted} ${currencySymbol}`;
}
