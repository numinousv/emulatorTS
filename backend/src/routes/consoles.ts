import { Hono } from "hono";
import { getSupabase } from "../db/supabase.ts";
import { resolveOrigin, type Bindings } from "../app.ts";

function resolveGameUrl(url: string, origin: string): string {
  return url.startsWith("/") ? `${origin}${url}` : url;
}

export const consolesRouter = new Hono<{ Bindings: Bindings }>();

consolesRouter.get("/", async (c) => {
  const supabase = getSupabase(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY);

  const [consolesResult, gamesResult] = await Promise.all([
    supabase.from("consoles").select("*"),
    supabase.from("games").select("console_id"),
  ]);

  const gameCounts: Record<string, number> = {};
  for (const g of gamesResult.data ?? []) {
    gameCounts[g.console_id] = (gameCounts[g.console_id] ?? 0) + 1;
  }

  const allConsoles = (consolesResult.data ?? [])
    .filter((c) => (gameCounts[c.id] ?? 0) > 0)
    .map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      icon: c.icon,
      color: c.color,
      core: c.core,
      count: gameCounts[c.id] ?? 0,
    }));

  return c.json(allConsoles);
});

consolesRouter.get("/:id", async (c) => {
  const { id } = c.req.param();
  const supabase = getSupabase(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY);
  const origin = resolveOrigin(c);

  const { data: consoleData, error } = await supabase
    .from("consoles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !consoleData) {
    return c.json({ error: "Console not found" }, 404);
  }

  const { data: consoleGames } = await supabase
    .from("games")
    .select("*")
    .eq("console_id", id);

  const games = (consoleGames ?? []).map((g) => ({
    id: g.id,
    name: g.name,
    core: g.core,
    url: resolveGameUrl(g.url, origin),
    description: g.description,
    consoleId: g.console_id,
  }));

  return c.json({ ...consoleData, games });
});
