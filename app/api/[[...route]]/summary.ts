import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import {
  differenceInDays,
  endOfMonth,
  parse,
  startOfMonth,
  subDays,
} from "date-fns";
import { and, desc, eq, gte, lt, lte, sql, sum } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "@/db/drizzle";
import { accounts, categories, transactions } from "@/db/schema";
import { UNCATEGORIZED_NAME } from "@/lib/constants";
import fillMissingDays, { calculatePercentageChange } from "../../../lib/utils";

const app = new Hono().get(
  "/",
  clerkMiddleware(),
  zValidator(
    "query",
    z.object({
      from: z.string().optional(),
      to: z.string().optional(),
      accountId: z.string().optional(),
    })
  ),
  async (c) => {
    const auth = getAuth(c);
    const { from, to, accountId } = c.req.valid("query");

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const now = new Date();
    const defaultTo = endOfMonth(now);
    const defaultFrom = startOfMonth(now);

    const startDate = from
      ? parse(from, "yyyy-MM-dd", new Date())
      : defaultFrom;

    const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;
    const periodLength = differenceInDays(endDate, startDate) + 1;
    const lastPediodStart = subDays(startDate, periodLength);
    const lastPeriodEnd = subDays(endDate, periodLength);

    async function fetchFinancialData(
      userId: string,
      startDate: Date,
      endDate: Date
    ) {
      return await db
        .select({
          income:
            sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
              Number
            ),
          expenses:
            sql`SUM(CASE WHEN ${transactions.amount} <= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
              Number
            ),
          remaining: sum(transactions.amount).mapWith(Number),
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(
          and(
            accountId ? eq(transactions.accountId, accountId) : undefined,
            eq(accounts.userId, userId),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate)
          )
        );
    }

    async function fetchAccountBalanceSummary(
      userId: string,
      endDate: Date,
      accountIdFilter?: string
    ): Promise<{ totalBalance: number }> {
      const result = await db.execute(sql`
        SELECT COALESCE(SUM(balance), 0)::integer as total_balance
        FROM (
          SELECT DISTINCT ON (account_id) balance
          FROM account_balances
          WHERE user_id = ${userId}
            AND date <= ${endDate}
            ${accountIdFilter ? sql`AND account_id = ${accountIdFilter}` : sql``}
          ORDER BY account_id, date DESC
        ) latest_balances
      `);

      return {
        totalBalance: Number(result.rows[0]?.total_balance ?? 0),
      };
    }

    const [currentPeriod] = await fetchFinancialData(
      auth.userId,
      startDate,
      endDate
    );
    const [lastPeriod] = await fetchFinancialData(
      auth.userId,
      lastPediodStart,
      lastPeriodEnd
    );

    const incomeChange = calculatePercentageChange(
      currentPeriod.income,
      lastPeriod.income
    );
    const expensesChange = calculatePercentageChange(
      currentPeriod.expenses,
      lastPeriod.expenses
    );
    const remainingChange = calculatePercentageChange(
      currentPeriod.remaining,
      lastPeriod.remaining
    );

    const currentBalanceSummary = await fetchAccountBalanceSummary(
      auth.userId,
      endDate,
      accountId
    );
    const lastPeriodBalanceSummary = await fetchAccountBalanceSummary(
      auth.userId,
      lastPeriodEnd,
      accountId
    );

    const totalBalanceChange = calculatePercentageChange(
      currentBalanceSummary.totalBalance,
      lastPeriodBalanceSummary.totalBalance
    );

    const category = await db
      .select({
        name: sql<string>`COALESCE(${categories.name}, ${sql.raw(`'${UNCATEGORIZED_NAME}'`)})`,
        value: sql`SUM(ABS(${transactions.amount}))`.mapWith(Number),
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(
        and(
          accountId ? eq(transactions.accountId, accountId) : undefined,
          eq(accounts.userId, auth.userId),
          lt(transactions.amount, 0),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate)
        )
      )
      .groupBy(
        sql`COALESCE(${categories.name}, ${sql.raw(`'${UNCATEGORIZED_NAME}'`)})`
      )
      .orderBy(desc(sql`SUM(ABS(${transactions.amount}))`));

    const topCategories = category.slice(0, 3);
    const otherCategories = category.slice(3);
    const otherSum = otherCategories.reduce(
      (acc, current) => acc + current.value,
      0
    );

    const finalCategories = topCategories;
    if (otherCategories.length > 0) {
      finalCategories.push({
        name: "Others",
        value: otherSum,
      });
    }

    const activeDays = await db
      .select({
        date: transactions.date,
        income:
          sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ABS(${transactions.amount}) ELSE 0 END)`.mapWith(
            Number
          ),
        expenses:
          sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ABS(${transactions.amount}) ELSE 0 END)`.mapWith(
            Number
          ),
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(
        and(
          accountId ? eq(transactions.accountId, accountId) : undefined,
          eq(accounts.userId, auth.userId),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate)
        )
      )
      .groupBy(transactions.date)
      .orderBy(transactions.date);

    const days = fillMissingDays(activeDays, startDate, endDate);

    return c.json({
      data: {
        remainingAmount: currentPeriod.remaining,
        remainingChange,
        incomeAmount: currentPeriod.income,
        incomeChange,
        expensesAmount: currentPeriod.expenses,
        expensesChange,
        totalBalanceAmount: currentBalanceSummary.totalBalance,
        totalBalanceChange,
        categories: finalCategories,
        days,
      },
    });
  }
);

export default app;
