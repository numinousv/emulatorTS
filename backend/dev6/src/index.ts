import { Hono } from "hono";
import { cors } from "hono/cors";
import { consolesRouter } from "./routes/consoles";
import { gamesRouter } from "./routes/games";
import { progressRouter } from "./routes/progress";

export type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(
  "/*",
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "$CLOUDFLARE_PAGES_URL/ANY_DOMAIN_URL",
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

app.get("/", (c) => c.json({ message: "Arcade Emulator API" }));
app.get("/health", (c) => c.text("OK"));
app.route("/api/consoles", consolesRouter);
app.route("/api/games", gamesRouter);
app.route("/api", progressRouter);

app.get("/api/archive/*", async (c) => {
  const path = c.req.path.replace("/api/archive", "");
  const url = `https://archive.org${path}`;
  const response = await fetch(url, { redirect: "follow" });
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Cross-Origin-Resource-Policy", "cross-origin");
  return new Response(response.body, { status: response.status, headers });
});

export default app;

export function resolveOrigin(c: { req: { url: string } }): string {
  return new URL(c.req.url).origin;
}
