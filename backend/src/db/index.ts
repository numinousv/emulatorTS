// NOTE: drizzle tooling client only (seed.ts, migrate.ts, update-colors.ts).
// The request runtime uses Supabase REST via ./supabase.ts so the same code
// runs on Node and Cloudflare Workers.
import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.ts";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required");
}

const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
