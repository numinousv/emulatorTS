# Web Emulator using Retroarch via EmulatorJS, rewritten to work with Typescript without using simple embeds, easily hostable on cloudflare via pages for frontend and workers for the backend, Supabase as a hosted database as well.

*Will update the README.md when I'm not lazy, clean up unused code (finished this a long time ago and did not intend on adding attaching a git repository for it, hence the currently uncleaned mess)*

Further developed and improved rather rushed school project I did a while back called
[arcade-emulator](https://github.com/numinousv/arcade-emulator)

Demo URL: <https://emulatorts.pages.dev/>


**Instructions on running it locally:**
```bash
git clone <https://github.com/numinousv/emulatorTS.git>
cd emulatorTS/arc-emu-frontend
bun install
cd ..
cd backend
setup your own database at https://supabase.com/, connect it via .env (read .env.example, will update it later for more details)
change $CLOUDFLARE_WORKER_URL in arc-emu-frontend/vite.config.ts and arc-emu-frontend/src/lib/api.ts to your own cloudflare workers URL (remember to use the /api path on api.ts)
change/add ROM links in backend/src/db/seed.ts by adding the url from **after** /api/archive/download.
bun install
cd ..
(cd backend/dev6 && bun dev) & (cd arc-emu-frontend && bun dev)
```
