import { Hono } from "hono";
import { getSupabase } from "../db/index";
import type { Bindings } from "../index";
import { resolveOrigin } from "../index";

function resolveGameUrl(url: string, origin: string): string {
  return url.startsWith("/") ? `${origin}${url}` : url;
}

export const gamesRouter = new Hono<{ Bindings: Bindings }>();

gamesRouter.get("/", async (c) => {
  const supabase = getSupabase(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY);
  const origin = resolveOrigin(c);

  const { data } = await supabase.from("games").select("*");

  const games = (data ?? []).map((g) => ({
    id: g.id,
    name: g.name,
    core: g.core,
    url: resolveGameUrl(g.url, origin),
    description: g.description,
    consoleId: g.console_id,
  }));

  return c.json(games);
});

gamesRouter.get("/:id", async (c) => {
  const { id } = c.req.param();
  const supabase = getSupabase(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY);
  const origin = resolveOrigin(c);

  const { data: game, error } = await supabase
    .from("games")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !game) {
    return c.json({ error: "Game not found" }, 404);
  }

  return c.json({
    id: game.id,
    name: game.name,
    core: game.core,
    url: resolveGameUrl(game.url, origin),
    description: game.description,
    consoleId: game.console_id,
  });
});
