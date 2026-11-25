# Corsia Sicura – Cyber Academy (Time Vision)

Learning platform for the ANAS cyber security awareness tender (Relazione Tecnica, Cap. 4).
24 monthly video episodes in two seasons, with interactive "Stop & Decide" choices.

## Links

- Live (production): https://corsia-sicura-beryl.vercel.app (Vercel project `corsia-sicura`, team espeditos-projects-07141c0e)
- Repo: https://github.com/ESSI-innovazione/LMS (push to `main` deploys to production)
- Supabase: EU (Frankfurt) project; schema in `supabase/migrations/`, catalogue seed in `supabase/seed.sql`
- A second Vercel project `lms` also builds from this repo; it is not used and can be deleted

## Stack

- Next.js 16 (App Router, TypeScript, strict), React 19
- Tailwind CSS v4 (`@import "tailwindcss"` in `app/globals.css`, tokens in `@theme inline`), shadcn/ui layout (`components.json`, `components/ui`, `lib/utils.ts` with `cn`)
- lucide-react icons
- Supabase (`@supabase/supabase-js`): catalogue read in `lib/data.ts` with static fallback; browser client in `lib/supabase/client.ts`
- `vercel.json` forces framework `nextjs` and region `fra1` (the Vercel project preset was "Other", which caused a 404)

## Brand and design rules

- Time Vision logo files in `public/brand/` (color, white, round mark). Favicon is `app/icon.svg`.
- Colours: navy `#003049` (`brand`), orange `#fd7835` (`brand-orange`), dark red `#710000` (`brand-red`).
- Contrast: white text on navy or dark red; **navy text on orange** (white on orange is 2.6:1 and fails); orange used as text on white is `brand-orange-ink` `#b44a14`.
- Fonts: Inter (body), Space Grotesk (`font-display`, headings).
- UI copy is in Italian. Accessibility is a tender requirement: WCAG 2.1 AA, keyboard operation (decisions with keys 1–3), screen-reader labels, 44px touch targets, no information by colour alone.
- Layout reference: light LMS dashboard (sidebar with pill nav, top bar with search, progress table, stat tiles, recommended cards, topic areas).

## What exists

| Route | File | Notes |
| --- | --- | --- |
| `/` | `app/page.tsx` | Learner dashboard. Learner data is sample (`lib/demo.ts`) |
| `/episodi/[num]` | `app/episodi/[num]/page.tsx` | Player shell; Ep. 06 has a working Stop & Decide (`lib/scenarios/index.ts`, `components/StopDecide.tsx`). Player styles are plain CSS classes at the bottom of `globals.css` |
| `/login` | `app/login/page.tsx`, `components/ui/sign-in.tsx` | Supabase e-mail/password and magic link (`shouldCreateUser: false`). Collage photos are hot-linked from timevision.it |

Catalogue of the 24 episodes: `lib/catalog.ts` (mirrors `supabase/seed.sql`). Mandatory episodes by profile:
operativo 07, 18, 19 · amministrativo 05, 06, 21 · management 14, 24.

Database tables: `seasons`, `episodes`, `structures`, `profiles` (role learner/manager/admin/editor, profile operativo/amministrativo/management), `episode_progress`, `decision_events`. RLS on every table; `is_staff()` helper; profile row created by trigger on sign-up.

## Next steps (in order)

1. Protect pages behind login: `@supabase/ssr` with cookie sessions and `proxy.ts` (Next 16 name for middleware); real learner name/profile from `profiles`; sign-out.
2. Real progress: write `episode_progress` and `decision_events` from the player; dashboard reads them instead of `lib/demo.ts`.
3. Player v1: video clips, multi-decision branching from a scenario file, Rewind, golden rules, 3-question Check, resume.
4. Admin: catalogue, user import (CSV), assignments by struttura/inquadramento/funzione.
5. Initial assessment (10 min), season tests (80% pass, unlimited attempts), PDF certificates, badges, Cyber Cards.
6. Notifications and recaps (Vercel Cron + Resend): monthly release, reminders every 15 days, 90-second recap 15 days after a wrong answer.
7. Reports (completion, scores, most-chosen wrong option, by structure; CSV export).
8. Simulated phishing campaigns (art. 2): at least 2 per year, landing page, remediation, anonymous debriefing.
9. Content lifecycle and approval ("visto si pubblichi"), template editor, policy acknowledgement, co-branding per subsidiary.
10. Export: SCORM 1.2/2004 (one SCO per episode, branching inside the SCO), xAPI, MP4, accessible PDFs.

## Conventions

- Never commit keys. Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server only). See `.env.example`.
- Run `npm run build` before pushing; a failed type check fails the Vercel build.
- Schema changes go in a new file in `supabase/migrations/`; keep `lib/catalog.ts` and `supabase/seed.sql` in sync.
