import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { and, desc, eq, gt, sum } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "@/db/drizzle";

import {
  accountBalances,
  accounts,
  insertAccountBalanceSchema,
  transactions,
} from "@/db/schema";

const app = new Hono()
  // GET / - List balance history with optional filters
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        accountId: z.string().optional(),
        limit: z.string().optional(),
      })
    ),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      const { accountId, limit } = c.req.valid("query");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const baseQuery = db
        .select()
        .from(accountBalances)
        .where(
          and(
            eq(accountBalances.userId, auth.userId),
            accountId ? eq(accountBalances.accountId, accountId) : undefined
          )
        )
        .orderBy(desc(accountBalances.date));

      const data = limit
        ? await baseQuery.limit(Number.parseInt(limit, 10))
        : await baseQuery;

      return c.json({ data });
    }
  )
  // GET /:id - Get single balance check
  .get(
    "/:id",
    zValidator("param", z.object({ id: z.string() })),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db
        .select()
        .from(accountBalances)
        .where(
          and(eq(accountBalances.userId, auth.userId), eq(accountBalances.id, id))
        );

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  )
  // GET /latest/:accountId - Get latest balance for account
  .get(
    "/latest/:accountId",
    zValidator("param", z.object({ accountId: z.string() })),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      const { accountId } = c.req.valid("param");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // First verify account ownership
      const [account] = await db
        .select()
        .from(accounts)
        .where(and(eq(accounts.userId, auth.userId), eq(accounts.id, accountId)));

      if (!account) {
        return c.json({ error: "Account not found" }, 404);
      }

      const [data] = await db
        .select()
        .from(accountBalances)
        .where(
          and(
            eq(accountBalances.userId, auth.userId),
            eq(accountBalances.accountId, accountId)
          )
        )
        .orderBy(desc(accountBalances.date))
        .limit(1);

      return c.json({ data: data || null });
    }
  )
  // GET /expected/:accountId - Calculate expected balance
  .get(
    "/expected/:accountId",
    zValidator("param", z.object({ accountId: z.string() })),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      const { accountId } = c.req.valid("param");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // First verify account ownership
      const [account] = await db
        .select()
        .from(accounts)
        .where(and(eq(accounts.userId, auth.userId), eq(accounts.id, accountId)));

      if (!account) {
        return c.json({ error: "Account not found" }, 404);
      }

      // Get latest balance check
      const [latestBalance] = await db
        .select()
        .from(accountBalances)
        .where(
          and(
            eq(accountBalances.userId, auth.userId),
            eq(accountBalances.accountId, accountId)
          )
        )
        .orderBy(desc(accountBalances.date))
        .limit(1);

      let expectedBalance = 0;

      if (latestBalance) {
        // Calculate sum of transactions since last balance check
        const [transactionSum] = await db
          .select({
            sum: sum(transactions.amount).mapWith(Number),
          })
          .from(transactions)
          .where(
            and(
              eq(transactions.accountId, accountId),
              gt(transactions.date, latestBalance.date)
            )
          );

        expectedBalance = latestBalance.balance + (transactionSum.sum || 0);
      } else {
        // No balance check yet, sum all transactions
        const [transactionSum] = await db
          .select({
            sum: sum(transactions.amount).mapWith(Number),
          })
          .from(transactions)
          .where(eq(transactions.accountId, accountId));

        expectedBalance = transactionSum.sum || 0;
      }

      return c.json({
        data: {
          accountId,
          expectedBalance,
          lastCheckedBalance: latestBalance?.balance || 0,
          lastCheckedDate: latestBalance?.date || null,
        },
      });
    }
  )
  // POST / - Create new balance check
  .post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      insertAccountBalanceSchema.pick({
        date: true,
        accountId: true,
        balance: true,
        note: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Verify account ownership
      const [account] = await db
        .select()
        .from(accounts)
        .where(
          and(eq(accounts.userId, auth.userId), eq(accounts.id, values.accountId))
        );

      if (!account) {
        return c.json({ error: "Account not found" }, 404);
      }

      const [data] = await db
        .insert(accountBalances)
        .values({
          id: createId(),
          userId: auth.userId,
          ...values,
        })
        .returning();

      return c.json({ data });
    }
  )
  // PATCH /:id - Update balance check
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string() })),
    zValidator(
      "json",
      insertAccountBalanceSchema.pick({
        date: true,
        balance: true,
        note: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db
        .update(accountBalances)
        .set({
          ...values,
          updatedAt: new Date(),
        })
        .where(and(eq(accountBalances.userId, auth.userId), eq(accountBalances.id, id)))
        .returning();

      if (!data) {
        return c.json({ error: "Not Found" }, 404);
      }

      return c.json({ data });
    }
  )
  // DELETE /:id - Delete balance check
  .delete(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db
        .delete(accountBalances)
        .where(and(eq(accountBalances.userId, auth.userId), eq(accountBalances.id, id)))
        .returning({
          id: accountBalances.id,
        });

      if (!data) {
        return c.json({ error: "Not Found" }, 404);
      }

      return c.json({ data });
    }
  );

export default app;
