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

## Structure
- `app/`: `page.tsx` (home), `contact/`, `legal/`, `api/contact/route.ts` (server validation, honeypot, basic rate limit, webhook forwarding), `robots.ts`, `sitemap.ts`, `icon.svg`, `globals.css`
- `components/home/*`: one component per homepage section; each owns its animation
- `components/SiteHeader.tsx`, `ScrollRuler.tsx`, `SiteFooter.tsx`, `SplitHeading.tsx`, `LogoSprite.tsx`
- `lib/motion.ts`: `useAnime()` hook (tracks and reverts every animation, observer and listener on unmount), dial builder, shared scroll loop
- `lib/contact.ts`: validation shared by the form and the API route
- `lib/map-data.ts`: dot-matrix map data (from the deck's map)

## Notes
- Motion respects `prefers-reduced-motion`; content is server-rendered and readable if JS fails (fail-safe in `app/layout.tsx`).
- The API rate limit is in-memory per instance. On serverless or multi-instance hosting, use a shared store or your platform's WAF.
- Before launch: sign off metrics and market statuses, module statuses, legal copy, LinkedIn URL and domain.
