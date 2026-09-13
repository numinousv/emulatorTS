import { Hono } from "hono";
import { db } from "../db/index.ts";
import { games } from "../db/schema.ts";
import { eq } from "drizzle-orm";

export const gamesRouter = new Hono();

gamesRouter.get("/", async (c) => {
  const allGames = await db.select().from(games);
  return c.json(allGames);
});

gamesRouter.get("/:id", async (c) => {
  const { id } = c.req.param();

  const game = await db
    .select()
    .from(games)
    .where(eq(games.id, id))
    .then((rows) => rows[0] ?? null);

  if (!game) {
    return c.json({ error: "Game not found" }, 404);
  }

  return c.json(game);
});
