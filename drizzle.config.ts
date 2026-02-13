import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

export default defineConfig({
  schema: "./db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    // biome-ignore lint/style/noNonNullAssertion: TODO: add t3env support
    url: process.env.DB_CONNECTION_URL!,
  },
  verbose: true,
  strict: true,
});
