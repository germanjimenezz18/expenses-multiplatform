import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { and, eq, inArray, sql, sum } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "@/db/drizzle";

import {
  accounts,
  insertAccountSchema,
  transactions,
} from "@/db/schema";

const app = new Hono()
  .get("/", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get all accounts with transaction balance
    const accountsData = await db
      .select({
        id: accounts.id,
        name: accounts.name,
        type: accounts.type,
        balance: sum(transactions.amount).mapWith(Number),
      })
      .from(accounts)
      .leftJoin(transactions, eq(transactions.accountId, accounts.id))
      .where(eq(accounts.userId, auth.userId))
      .groupBy(accounts.id, accounts.name, accounts.type);

    if (accountsData.length === 0) {
      return c.json({ data: [] });
    }

    // Batch: get the latest balance record per account in a single query.
    // DISTINCT ON is PostgreSQL-specific, matching the existing pattern in this codebase.
    const latestBalancesResult = await db.execute<{
      account_id: string;
      balance: number;
      date: Date;
      note: string | null;
    }>(sql`
      SELECT DISTINCT ON (account_id) account_id, balance, date, note
      FROM account_balances
      WHERE user_id = ${auth.userId}
      ORDER BY account_id, date DESC
    `);

    const latestBalanceMap = new Map(
      latestBalancesResult.rows.map((b) => [b.account_id, b])
    );

    // Batch: get transaction sums since each account's last balance date in a single query
    const txnSinceResult = await db.execute<{
      account_id: string;
      sum_since: number;
    }>(sql`
      SELECT t.account_id, COALESCE(SUM(t.amount), 0) AS sum_since
      FROM transactions t
      INNER JOIN (
        SELECT DISTINCT ON (account_id) account_id, date
        FROM account_balances
        WHERE user_id = ${auth.userId}
        ORDER BY account_id, date DESC
      ) lb ON t.account_id = lb.account_id AND t.date > lb.date
      GROUP BY t.account_id
    `);

    const txnSinceMap = new Map(
      txnSinceResult.rows.map((r) => [r.account_id, Number(r.sum_since)])
    );

    const enrichedData = accountsData.map((account) => {
      const latestBalance = latestBalanceMap.get(account.id);
      const expectedBalance = latestBalance
        ? Number(latestBalance.balance) + (txnSinceMap.get(account.id) ?? 0)
        : account.balance ?? 0;

      return {
        id: account.id,
        name: account.name,
        type: account.type,
        balance: account.balance ?? 0,
        lastCheckedBalance: latestBalance
          ? Number(latestBalance.balance)
          : null,
        lastCheckedDate: latestBalance ? new Date(latestBalance.date) : null,
        expectedBalance,
      };
    });

    return c.json({ data: enrichedData });
  })
  .get(
    "/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing Id" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db
        .select({
          id: accounts.id,
          name: accounts.name,
          type: accounts.type,
        })
        .from(accounts)
        .where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)));

      if (!data) {
        return c.json({ error: "Not Found " }, 404);
      }
      return c.json({ data });
    }
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", insertAccountSchema.pick({ name: true, type: true })),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db
        .insert(accounts)
        .values({
          id: createId(),
          userId: auth.userId,
          ...values,
        })
        .returning();

      return c.json({ data });
    }
  )
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const data = await db
        .delete(accounts)
        .where(
          and(
            eq(accounts.userId, auth.userId),
            inArray(accounts.id, values.ids)
          )
        )
        .returning({
          id: accounts.id,
        });

      return c.json({ data });
    }
  )
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    zValidator("json", insertAccountSchema.pick({ name: true, type: true })),
    async (c) => {
      const auth = getAuth(c);

      const { id } = c.req.valid("param");
      const values = c.req.valid("json");

      if (!id) {
        return c.json({ error: "Missing Id" }, 400);
      }
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db
        .update(accounts)
        .set(values)
        .where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)))
        .returning();

      if (!data) {
        return c.json({ error: "Not Found" }, 404);
      }

      return c.json({ data });
    }
  )
  .delete(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      if (!id) {
        return c.json({ error: "Missing Id" }, 400);
      }

      const [data] = await db
        .delete(accounts)
        .where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)))
        .returning({
          id: accounts.id,
          name: accounts.name,
        });

      if (!data) {
        return c.json({ error: "Not Found" }, 404);
      }

      return c.json({ data });
    }
  );

export default app;
