import { Hono } from "hono";
import { db } from "../db/index.ts";
import { consoles, games } from "../db/schema.ts";
import { eq, sql } from "drizzle-orm";

export const consolesRouter = new Hono();

consolesRouter.get("/", async (c) => {
  const allConsoles = await db
    .select({
      id: consoles.id,
      name: consoles.name,
      description: consoles.description,
      icon: consoles.icon,
      color: consoles.color,
      core: consoles.core,
      count: sql<number>`count(${games.id})::int`,
    })
    .from(consoles)
    .leftJoin(games, eq(games.consoleId, consoles.id))
    .groupBy(consoles.id)
    .having(sql`count(${games.id}) > 0`);

  return c.json(allConsoles);
});

consolesRouter.get("/:id", async (c) => {
  const { id } = c.req.param();

  const consoleData = await db
    .select()
    .from(consoles)
    .where(eq(consoles.id, id))
    .then((rows) => rows[0] ?? null);

  if (!consoleData) {
    return c.json({ error: "Console not found" }, 404);
  }

  const consoleGames = await db
    .select()
    .from(games)
    .where(eq(games.consoleId, id));

  return c.json({ ...consoleData, games: consoleGames });
});
