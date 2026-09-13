# Web Emulator using Retroarch via EmulatorJS, rewritten to work with Typescript without using simple embeds, easily hostable on cloudflare via pages for frontend and workers for the backend, Supabase as a hosted database as well, rom URLs can be easily fetched from <https://archive.org>

_Will update the README.md when I'm not lazy, clean up unused code (finished this a long time ago and did not intend on attaching a git repository for it, hence the current uncleaned mess)_

Further developed and improved rather rushed school project I did a while back called
[arcade-emulator](https://github.com/numinousv/arcade-emulator)

Demo URL: <https://emulatorts.pages.dev/>

requires [wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/) if you want to host the backend API as a cloudflare worker

**Instructions on running it locally:**

```bash
git clone https://github.com/numinousv/emulatorTS.git
cd emulatorTS/arc-emu-frontend
bun install
cd ../backend
bun install
setup your own database at https://supabase.com/, connect it via .env (read .env.example)
and .dev.vars (read .dev.vars.example) for `wrangler dev`
download and install wrangler:
arch-linux: sudo pacman -S wrangler
or follow their documentation: https://developers.cloudflare.com/workers/wrangler/install-and-update/
add SUPABASE_ANON_KEY and SUPABASE_URL using the commands:
wrangler secret put SUPABASE_ANON_KEY
wrangler secret put SUPABASE_URL
wrangler types
change $CLOUDFLARE_WORKER_URL in arc-emu-frontend/vite.config.ts and arc-emu-frontend/src/lib/api.ts to your own cloudflare workers URL (remember to use the /api path on api.ts). Also change the $FRONTEND_URL to your own URL in backend/src/app.ts
change/add ROM links in backend/src/db/seed.ts by adding the url from **after** /api/archive/download.
cd ..
(cd backend && bun run dev) & (cd arc-emu-frontend && bun dev)
# or, to run the backend as a local worker instead of Node:
# (cd backend && bun run dev:worker) & (cd arc-emu-frontend && bun dev)
to host the backend api, use the commands:
cd backend
wrangler types
wrangler deploy
```

Backend layout: `backend/src/app.ts` holds the shared Hono app (routes, archive proxy,
Swagger `/doc` + `/ui`) used by both entries — `src/index.ts` (Node local dev) and
`src/worker.ts` (Cloudflare Workers deploy target). The request runtime uses
Supabase REST; drizzle (`src/db/schema.ts`, `seed.ts`, `migrate.ts`) is schema/migration
tooling only.
