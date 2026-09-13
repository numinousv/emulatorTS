import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db/index.ts";
import { gameProgress, playtime } from "../db/schema.ts";
import { eq, desc, sql } from "drizzle-orm";
export const progressRouter = new Hono();

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

    const [result] = await db
      .insert(gameProgress)
      .values({ userId, gameId, score, saveData })
      .onConflictDoUpdate({
        target: [gameProgress.userId, gameProgress.gameId],
        set: { score, saveData, updatedAt: sql`now()` },
      })
      .returning();

    return c.json({ success: true, data: result });
  },
);

progressRouter.post(
  "/playtime",
  zValidator("json", savePlaytimeSchema),
  async (c) => {
    const { userId, gameId, playtime: time } = c.req.valid("json");

    const [result] = await db
      .insert(playtime)
      .values({ userId, gameId, totalPlaytime: time })
      .onConflictDoUpdate({
        target: [playtime.userId, playtime.gameId],
        set: { totalPlaytime: time, updatedAt: sql`now()` },
      })
      .returning();

    return c.json({ success: true, data: result });
  },
);

progressRouter.get("/recent/:userId", async (c) => {
  const { userId } = c.req.param();

  const recent = await db
    .select()
    .from(gameProgress)
    .where(eq(gameProgress.userId, userId))
    .orderBy(desc(gameProgress.updatedAt))
    .limit(5);

  return c.json({ success: true, data: recent });
});
