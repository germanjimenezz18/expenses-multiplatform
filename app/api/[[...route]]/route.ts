import { Hono } from "hono";
import { handle } from "hono/vercel";
import accountBalances from "./account-balances";
import accounts from "./accounts";
import categories from "./categories";
import summary from "./summary";
import transactions from "./transactions";

export const runtime = "edge";

const app = new Hono().basePath("/api");
const routes = app
  .route("/accounts", accounts)
  .route("/account-balances", accountBalances)
  .route("/categories", categories)
  .route("/transactions", transactions)
  .route("/summary", summary);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
