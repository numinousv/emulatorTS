import { db } from "./index.ts";
import { consoles } from "./schema.ts";
import { eq } from "drizzle-orm";

const COLOR_UPDATES = [
  { id: "n64", color: "linear-gradient(to bottom right, #581c87, #7e22ce)" },
  { id: "gba", color: "linear-gradient(to bottom right, #14532d, #15803d)" },
  { id: "psx", color: "linear-gradient(to bottom right, #1e3a5f, #1d4ed8)" },
  { id: "snes", color: "linear-gradient(to bottom right, #111827, #374151)" },
  { id: "nes", color: "linear-gradient(to bottom right, #7f1d1d, #dc2626)" },
  { id: "nds", color: "linear-gradient(to bottom right, #fca5a5, #ef4444)" },
  { id: "segaSaturn", color: "linear-gradient(to bottom right, #9333ea, #c084fc)" },
  { id: "psp", color: "linear-gradient(to bottom right, #93c5fd, #3b82f6)" },
  { id: "segaMD", color: "linear-gradient(to bottom right, #f9a8d4, #ec4899)" },
];

async function updateColors() {
  for (const c of COLOR_UPDATES) {
    await db.update(consoles).set({ color: c.color }).where(eq(consoles.id, c.id));
  }
  console.log("Updated console colors!");
  process.exit(0);
}

updateColors().catch((err) => {
  console.error("Update failed:", err);
  process.exit(1);
});
