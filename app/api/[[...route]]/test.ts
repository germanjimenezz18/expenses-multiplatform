import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { Hono } from "hono";
import { accounts, categories, transactions } from "@/db/schema";
import {
  AuthGetRequest,
  Configuration,
  PlaidApi,
  PlaidEnvironments,
} from "plaid";

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

const app = new Hono()
  .get(
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

      return c.json({ message: "hola buenas tardes" });
    }
  )
  .post("/create_link_token", async (c) => {
    // const auth = getAuth(c);
    // if (!auth?.userId) {
    //   return c.json({ error: "Unauthorized" }, 401);
    // }

    //   webhook: 'https://webhook.example.com',
    const plaidRequest = {
      user: {
        client_user_id: "adad222",
      },
      client_name: "Plaid Test App",
      products: ["auth"],
      language: "es",
      redirect_uri: "http://localhost:3000/",
      country_codes: ["ES"],
    };

    try {
      const createTokenResponse = await plaidClient.linkTokenCreate(
        plaidRequest
      );
      return c.json(createTokenResponse.data);
    } catch (error) {
      console.log(error);
      return c.json({ error: "Failed" });
    }
  })
  .post(
    "/exchange_public_token",
    zValidator("json", z.object({ publicToken: z.string() })),
    async function (c) {
      console.log(c.body);
      const { publicToken } = c.req.valid("json");
      try {
        const plaidResponse = await plaidClient.itemPublicTokenExchange({
          public_token: publicToken,
        });

        // These values should be saved to a persistent database and
        // associated with the currently signed-in user
        const accessToken = plaidResponse.data.access_token;
        // const itemID = response.data.item_id;
        return c.json({ accessToken });
        // c.json({ public_token_exchange: "complete" });
      } catch (error) {
        c.json({ error: "Failed" });
      }
    }
  )
  .post(
    "/auth",
    zValidator("json", z.object({ accessToken: z.string() })),
    async (c) => {
      /* 
      obtenemos el access token, en este caso desde la request pero podria ser desde DB
    */
      const { accessToken } = c.req.valid("json");

      const plaidRequest: AuthGetRequest = {
        access_token: accessToken,
      };

      try {
        const response = await plaidClient.authGet(plaidRequest);
        return c.json(response.data);
        // const accountData = response.data.accounts;
        // const numbers = response.data.numbers;
      } catch (error) {
        console.log(error);
        return c.json({ error: "Failed" }, 500);
      }
    }
  );

export default app;
