import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/* account type enum */
export const accountTypeEnum = pgEnum("account_type", [
  "bank",
  "cash",
  "crypto",
  "credit_card",
  "debit_card",
  "investment",
  "savings",
  "digital_wallet",
  "loan",
  "other",
]);

/* accounts */
export const accounts = pgTable(
  "accounts",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    type: accountTypeEnum("type").notNull().default("bank"),
    userId: text("user_id").notNull(),
  },
  (t) => [index("accounts_user_id_idx").on(t.userId)]
);

export const accountsRelations = relations(accounts, ({ many }) => ({
  transactions: many(transactions),
  balances: many(accountBalances),
}));

export const insertAccountSchema = createInsertSchema(accounts);

/* categories */
export const categories = pgTable(
  "categories",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    userId: text("user_id").notNull(),
  },
  (t) => [index("categories_user_id_idx").on(t.userId)]
);

export const categoriesRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions),
}));

export const insertCategorySchema = createInsertSchema(categories);

/* transactions 
  Amount : Integers multplied by 1000 to avoid float/double problems  $10.50 = 10500
*/
export const transactions = pgTable(
  "transactions",
  {
    id: text("id").primaryKey(),
    amount: integer("amount").notNull(),
    payee: text("payee").notNull(),
    notes: text("notes"),
    date: timestamp("date", { mode: "date" }).notNull(),

    /* if we delete an account, we want to delete all transactions associated with it */
    accountId: text("account_id")
      .references(() => accounts.id, { onDelete: "cascade" })
      .notNull(),

    /* if we delete a category, we want just to set the category_id to null */
    categoryId: text("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
  },
  (t) => [
    index("transactions_account_id_idx").on(t.accountId),
    index("transactions_date_idx").on(t.date),
  ]
);

export const transactionsRelations = relations(transactions, ({ one }) => ({
  account: one(accounts, {
    fields: [transactions.accountId],
    references: [accounts.id],
  }),
  categories: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}));

export const insertTransactionSchema = createInsertSchema(transactions, {
  date: z.coerce.date(),
});

/* account_balances
  Balance : Integers multiplied by 1000 to avoid float/double problems  $10.50 = 10500
*/
export const accountBalances = pgTable(
  "account_balances",
  {
    id: text("id").primaryKey(),
    date: timestamp("date", { mode: "date" }).notNull(),
    accountId: text("account_id")
      .references(() => accounts.id, { onDelete: "cascade" })
      .notNull(),
    balance: integer("balance").notNull(), // miliUnits (x1000)
    note: text("note"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
    userId: text("user_id").notNull(),
  },
  (t) => [
    index("account_balances_user_id_idx").on(t.userId),
    index("account_balances_account_id_date_idx").on(t.accountId, t.date),
  ]
);

export const accountBalancesRelations = relations(
  accountBalances,
  ({ one }) => ({
    account: one(accounts, {
      fields: [accountBalances.accountId],
      references: [accounts.id],
    }),
  })
);

export const insertAccountBalanceSchema = createInsertSchema(accountBalances, {
  date: z.coerce.date(),
});
