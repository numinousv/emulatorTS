import { createApp } from "./app.ts";

// Workers entry — keep free of Node-only imports (dotenv,
// @hono/node-server, postgres, drizzle runtime) so wrangler can bundle it.
const app = createApp();

export default app;
