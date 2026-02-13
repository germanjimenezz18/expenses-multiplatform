import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

config({ path: ".env" });
// biome-ignore lint/style/noNonNullAssertion: TODO: add t3env support
const sql = neon(process.env.DB_CONNECTION_URL!);
const db = drizzle(sql);

const main = async () => {
  try {
    await migrate(db, { migrationsFolder: "drizzle" });
    console.log("Migracion exitosa");
  } catch (error) {
    console.error("Error haciendo la migracion", error);
    process.exit(1);
  }
};

main();
