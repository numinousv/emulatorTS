import "dotenv/config";
import { serve } from "@hono/node-server";
import { createApp, type Bindings } from "./app.ts";

// Node entry for local dev (`bun run dev` / `tsx watch src/index.ts`).
// Supabase credentials come from process.env and are passed as the Hono
// env, so routes keep reading c.env exactly like on Workers.
const app = createApp();

const env: Bindings = {
  SUPABASE_URL: process.env.SUPABASE_URL ?? "",
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ?? "",
};

const port = Number(process.env.PORT) || 3001;

serve({ fetch: (req) => app.fetch(req, env), port }, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
