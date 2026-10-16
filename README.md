# AGEX TECH — Next.js site

Corporate website for AGEX TECH, the intelligent mobility engine. Built on Next.js 16 (App Router, TypeScript) with anime.js 4.2.2 for motion; monochrome black/white brand system.

## Run
    npm install
    npm run dev        # http://localhost:3000
    npm run build && npm start

### Contact form delivery
Both forms (`/contact`, `/contact/investors`) post to `/api/contact`. Each valid inquiry is:
1. saved to `data/submissions.jsonl` (`/app/data` volume in Docker);
2. **emailed to `CONTACT_TO` (investor@agextech.com)** through the Brevo SMTP relay, sent from `SMTP_FROM` (agex@aljazairbuilders.com), with the sender's address as *Reply-To*;
3. optionally forwarded to `CONTACT_WEBHOOK_URL`.

SMTP settings live only in `.env` (git-ignored, excluded from the Docker image). On Dokploy, add the same variables in the app's **Environment** tab.

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
- `/`: Hero → Traction & deployments map → Global & local → The AGEX engine (architecture) → Explore the engine → Platform in action → Solutions → How it works → footer CTA
- `/solutions/ride-hailing`, `/solutions/delivery`, `/solutions/fleet`: solution pages (copy in `lib/solutions.ts`)
- `/deployments`: markets map and traction · `/about`: About AGEX, purpose, approach, the AGEX advantage
- `/contact` (customers) and `/contact/investors` (investors & partners); `/legal` (Privacy, Terms, Cookies placeholders)

## Brand film
- `public/media/agex-film.mp4` (10 s, 1280×720, streaming-ready), poster `agex-film-poster.jpg`.
- **First desktop visit** to `/`: plays once as a full-screen intro (muted, as browsers require for autoplay) with "Skip intro →" and a thin progress line, then fades into the hero. The decision is made before paint in `app/layout.tsx` and remembered in `localStorage` (`agex.filmSeen`).
- **Repeat visits, mobile and reduced-motion visitors** go straight to the homepage. Anyone can replay it with sound from "Watch the AGEX film" under the hero CTAs (`components/FilmPlayer.tsx`).
- To show the intro again while testing, run `localStorage.removeItem('agex.filmSeen')` in the browser console.

## Design system
- Monochrome black/white, with a **gold accent (`--gold*` in `app/globals.css`) reserved for motion and light**: pulses, light streaks, active routes, glows and progress. Don't use it for text or buttons.
- Type: **Avenir Next LT Pro** (Regular 400 / Demi 600), falling back to the system Avenir Next and then Figtree. The licensed font is used where it's installed. To self-host it, add the `.woff2` files to `public/fonts/` and append their `url()` to the `@font-face` rules at the top of `globals.css`. Monospace is used only for system IDs (`agex.engine`, `04 / 04`).

## Content to supply before launch
- **Platform in action** shows interface recreations based on the approved reference (`components/platform/Screens.tsx`), with illustrative sample values (rides, AED amounts, names). To use real screenshots instead, add files to `public/screens/` and set `src` per screen in `lib/products.ts`.
- Social profile URLs (`lib/site.ts`), legal copy (`app/legal/page.tsx`), and sign-off on the metrics and market statuses (`components/home/Proof.tsx`).

## Structure
- `app/`: routes, `api/contact/route.ts` (validation for both inquiry types, honeypot, rate limit, disk + webhook), `robots.ts`, `sitemap.ts`, `globals.css`
- `components/home/*`: one component per homepage section · `components/solutions/*` · `components/contact/*`
- `components/visuals/*`: HeroEngine, IsoTown, NetworkGraph, LightRoads, GlobeArcs (anime.js-driven SVG scenes)
- `lib/motion.ts`: `useAnime()` (reverts every animation, observer and listener on unmount), dial builder, shared scroll loop · `lib/iso.ts`: isometric geometry
- `lib/contact.ts`, `lib/countries.ts`, `lib/solutions.ts`, `lib/products.ts`, `lib/markets.ts`, `lib/site.ts`, `lib/map-data.ts`
- `public/solutions/*.png`: Solutions visuals taken from the approved reference
