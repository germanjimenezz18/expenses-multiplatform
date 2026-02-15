import type { LucideIcon } from "lucide-react";
import {
  Banknote,
  Bitcoin,
  CircleDot,
  CreditCard,
  HandCoins,
  Landmark,
  PiggyBank,
  Smartphone,
  TrendingUp,
  Wallet,
} from "lucide-react";

export const ACCOUNT_TYPES = [
  { value: "bank", label: "Banco", icon: Landmark },
  { value: "cash", label: "Efectivo", icon: Banknote },
  { value: "crypto", label: "Cripto", icon: Bitcoin },
  { value: "credit_card", label: "Tarjeta de Crédito", icon: CreditCard },
  { value: "debit_card", label: "Tarjeta de Débito", icon: Wallet },
  { value: "investment", label: "Inversión", icon: TrendingUp },
  { value: "savings", label: "Ahorros", icon: PiggyBank },
  { value: "digital_wallet", label: "Billetera Digital", icon: Smartphone },
  { value: "loan", label: "Préstamo", icon: HandCoins },
  { value: "other", label: "Otro", icon: CircleDot },
] as const;

export type AccountType = (typeof ACCOUNT_TYPES)[number]["value"];

export interface AccountTypeInfo {
  value: AccountType;
  label: string;
  icon: LucideIcon;
}

export const getAccountTypeInfo = (type: AccountType): AccountTypeInfo =>
  ACCOUNT_TYPES.find((t) => t.value === type) ?? ACCOUNT_TYPES[9];
