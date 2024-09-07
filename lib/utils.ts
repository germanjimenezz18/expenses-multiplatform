import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CurrencyType } from "./custom-types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertAmountToMiliUnits(amount: number) {
  return Math.round(amount * 1000);
}

export function convertAmountFromMiliUnits(amount: number) {
  return amount / 1000;
}

export function formatCurrency(value: number, currencyType: CurrencyType) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyType,
    minimumFractionDigits: 2,
  }).format(value);
}
