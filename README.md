# AGEX TECH — Next.js site

Corporate website for AGEX TECH, the intelligent mobility engine. Built on Next.js 16 (App Router, TypeScript) with anime.js 4.2.2 for motion; monochrome black/white brand system.

## Run
    npm install
    npm run dev        # http://localhost:3000
    npm run build && npm start

Copy `.env.example` to `.env.local` and set:
- `NEXT_PUBLIC_SITE_URL` (metadata, sitemap, robots)
- `CONTACT_WEBHOOK_URL`: HTTPS endpoint (CRM / email webhook) that receives inquiries as JSON. **Without it, inquiries are validated and logged as "NOT delivered", and are not sent anywhere.**

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
