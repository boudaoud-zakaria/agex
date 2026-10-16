# AGEX TECH — Next.js site

Corporate website for AGEX TECH, the intelligent mobility engine. Built on Next.js 16 (App Router, TypeScript) with anime.js 4.2.2 for motion; monochrome black/white brand system.

## Run
    npm install
    npm run dev        # http://localhost:3000
    npm run build && npm start

Copy `.env.example` to `.env` (Docker) or `.env.local` (`npm run dev`) and set:
- `NEXT_PUBLIC_SITE_URL` (metadata, sitemap, robots)
- `CONTACT_WEBHOOK_URL` (optional): HTTPS endpoint (CRM / email webhook) that receives each inquiry as JSON.

Every valid inquiry is also appended to `data/submissions.jsonl` (`DATA_DIR`, `/app/data` in Docker), so nothing is lost when no webhook is set.

## Docker
    cp .env.example .env
    docker compose up -d --build
    docker compose port app 3000      # shows the host port

The image is a multi-stage Next.js `standalone` build (Node 22 Alpine, non-root user, healthcheck on `/`).
Volumes: `submissions_data` → `/app/data` (contact submissions), `uploads_data` → `/app/public/uploads` (reserved; the site doesn't use uploads yet).

## Deploy on Dokploy
1. **Create → Compose** (type *Docker Compose*). Source: this GitLab repo, branch `main`, compose path `./docker-compose.yml`. For a private repo, connect GitLab under *Git providers* or add a deploy key.
2. **Environment**: paste the variables from `.env.example`. Dokploy writes them to `.env`, which compose uses as the `env_file` and to set `NEXT_PUBLIC_SITE_URL` at build time.
3. **Domains**: add your domain → service `app`, container port `3000`, HTTPS on.
4. **Deploy.** Named volumes persist across redeploys.
5. Read submissions from Dokploy's container terminal, or on the host: `docker exec agex-website cat /app/data/submissions.jsonl`

`container_name` is `agex-website`: keep it unique on the server.

## Pages
- `/`: Hero → Global & local → Architecture → Explore the engine → Platform in action → Solutions → How it works → footer CTA
- `/solutions/ride-hailing`, `/solutions/delivery`, `/solutions/fleet`: solution pages (copy in `lib/solutions.ts`)
- `/deployments`: markets map and traction · `/about`: company, partnership model and roadmap
- `/contact` (customers) and `/contact/investors` (investors & partners); `/legal` (Privacy, Terms, Cookies placeholders)

## Design system
- Monochrome black/white, with a **gold accent (`--gold*` in `app/globals.css`) reserved for motion and light**: pulses, light streaks, active routes, glows and progress. Don't use it for text or buttons.
- Type: **Avenir Next LT Pro** (Regular 400 / Demi 600), falling back to the system Avenir Next and then Figtree. The licensed font is used where it's installed. To self-host it, add the `.woff2` files to `public/fonts/` and append their `url()` to the `@font-face` rules at the top of `globals.css`. Monospace is used only for system IDs (`agex.engine`, `04 / 04`).

## Content to supply before launch
- **Product screenshots** for *Platform in action*: add files to `public/screens/` and set `src` in `lib/products.ts`. Until then the device frames show neutral wireframes with no data.
- Social profile URLs (`lib/site.ts`), legal copy (`app/legal/page.tsx`), and sign-off on the metrics and market statuses (`components/home/Proof.tsx`).

## Structure
- `app/`: routes, `api/contact/route.ts` (validation for both inquiry types, honeypot, rate limit, disk + webhook), `robots.ts`, `sitemap.ts`, `globals.css`
- `components/home/*`: one component per homepage section · `components/solutions/*` · `components/contact/*`
- `components/visuals/*`: HeroEngine, IsoTown, NetworkGraph, LightRoads, GlobeArcs (anime.js-driven SVG scenes)
- `lib/motion.ts`: `useAnime()` (reverts every animation, observer and listener on unmount), dial builder, shared scroll loop · `lib/iso.ts`: isometric geometry
- `lib/contact.ts`, `lib/countries.ts`, `lib/solutions.ts`, `lib/products.ts`, `lib/site.ts`, `lib/map-data.ts`
