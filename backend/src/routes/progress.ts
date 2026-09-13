import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { getSupabase } from "../db/supabase.ts";
import type { Bindings } from "../app.ts";

export const progressRouter = new Hono<{ Bindings: Bindings }>();

const saveProgressSchema = z.object({
  userId: z.string(),
  gameId: z.string(),
  score: z.number().optional(),
  saveData: z.string().optional(),
});

const savePlaytimeSchema = z.object({
  userId: z.string(),
  gameId: z.string(),
  playtime: z.number(),
});

progressRouter.post(
  "/progress",
  zValidator("json", saveProgressSchema),
  async (c) => {
    const { userId, gameId, score, saveData } = c.req.valid("json");
    const supabase = getSupabase(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY);

    const { data, error } = await supabase
      .from("game_progress")
      .upsert(
        {
          user_id: userId,
          game_id: gameId,
          score: score ?? 0,
          save_data: saveData ?? null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,game_id" },
      )
      .select()
      .maybeSingle();

    if (error) {
      return c.json({ success: false, error: error.message }, 500);
    }

    return c.json({ success: true, data });
  },
);

progressRouter.post(
  "/playtime",
  zValidator("json", savePlaytimeSchema),
  async (c) => {
    const { userId, gameId, playtime: time } = c.req.valid("json");
    const supabase = getSupabase(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY);

    const { data, error } = await supabase
      .from("playtime")
      .upsert(
        {
          user_id: userId,
          game_id: gameId,
          total_playtime: time,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,game_id" },
      )
      .select()
      .maybeSingle();

    if (error) {
      return c.json({ success: false, error: error.message }, 500);
    }

    return c.json({ success: true, data });
  },
);

progressRouter.get("/recent/:userId", async (c) => {
  const { userId } = c.req.param();
  const supabase = getSupabase(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY);

  const { data } = await supabase
    .from("game_progress")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(5);

  return c.json({ success: true, data: data ?? [] });
});
