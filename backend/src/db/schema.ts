import { integer, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

export const consoles = pgTable("consoles", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  icon: text("icon").notNull().default("🎮"),
  color: text("color").notNull().default("from-gray-900 to-gray-700"),
  core: text("core").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const games = pgTable("games", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  core: text("core").notNull(),
  url: text("url").notNull(),
  description: text("description").notNull().default(""),
  consoleId: text("console_id")
    .notNull()
    .references(() => consoles.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const gameProgress = pgTable("game_progress", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  gameId: text("game_id")
    .notNull()
    .references(() => games.id, { onDelete: "cascade" }),
  score: integer("score").default(0),
  saveData: text("save_data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  unique("progress_user_game").on(table.userId, table.gameId),
]);

export const playtime = pgTable("playtime", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  gameId: text("game_id")
    .notNull()
    .references(() => games.id, { onDelete: "cascade" }),
  totalPlaytime: integer("total_playtime").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  unique("playtime_user_game").on(table.userId, table.gameId),
]);
