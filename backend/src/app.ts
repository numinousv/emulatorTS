import { Hono } from "hono";
import { cors } from "hono/cors";
import { swaggerUI } from "@hono/swagger-ui";
import { consolesRouter } from "./routes/consoles.ts";
import { gamesRouter } from "./routes/games.ts";
import { progressRouter } from "./routes/progress.ts";
import { openApiDoc } from "./openapi.ts";

export type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
};

export function resolveOrigin(c: { req: { url: string } }): string {
  return new URL(c.req.url).origin;
}

// Shared app factory: runtime-agnostic (no dotenv, no serve(), no
// process.env here). src/index.ts (Node) and src/worker.ts (Workers)
// are thin adapters that call createApp().
export function createApp() {
  const app = new Hono<{ Bindings: Bindings }>();

  app.use(
    "/*",
    cors({
      origin: [
        "http://localhost:3000",
        "http://localhost:5173",
        "$FRONTEND_URL",
      ],
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
    }),
  );

  app.get("/", (c) => c.json({ message: "Arcade Emulator API" }));

  // OpenAPI document + Swagger UI (previously Node-only, now served
  // on Workers too).
  app.get("/doc", (c) => c.json(openApiDoc));
  app.get("/ui", swaggerUI({ url: "/doc" }));

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

  return app;
}
