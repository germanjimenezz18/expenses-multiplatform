import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { and, desc, eq, gt, inArray, sum } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "@/db/drizzle";

import {
  accountBalances,
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

    // For each account, get latest balance check and calculate expected balance
    const enrichedData = await Promise.all(
      accountsData.map(async (account) => {
        // Get latest balance check
        const [latestBalance] = await db
          .select()
          .from(accountBalances)
          .where(
            and(
              eq(accountBalances.userId, auth.userId),
              eq(accountBalances.accountId, account.id)
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
                eq(transactions.accountId, account.id),
                gt(transactions.date, latestBalance.date)
              )
            );

          expectedBalance = latestBalance.balance + (transactionSum.sum || 0);
        } else {
          // No balance check yet, use total transaction balance
          expectedBalance = account.balance || 0;
        }

        return {
          id: account.id,
          name: account.name,
          type: account.type,
          balance: account.balance || 0,
          lastCheckedBalance: latestBalance?.balance || null,
          lastCheckedDate: latestBalance?.date || null,
          expectedBalance,
        };
      })
    );

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
