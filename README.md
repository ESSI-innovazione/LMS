# Corsia Sicura – Cyber Academy

Learning platform for the Corsia Sicura cyber security awareness series: 24 monthly
episodes in two seasons, with interactive Stop & Decide choices.

Stack: Next.js (App Router, TypeScript) on Vercel, Supabase (Postgres, Auth, Storage), EU regions.

## What is here (step 1)

| Route | What it shows |
| --- | --- |
| `/` | Learner home: episode of the month, season progress, mandatory episodes by profile, recap, Cyber Cards, episode catalogue by season |
| `/episodi/06` | Player with the Ep. 06 Stop & Decide (keys 1–3 work) |
| `/episodi/NN` | Player shell for the other episodes |

Learner data is sample data (`lib/demo.ts`) until login is added. The catalogue is read
from Supabase when it is configured and seeded, otherwise from `lib/catalog.ts`.
The footer shows which source is in use.

## Set up Supabase

1. In the Supabase dashboard, open **SQL Editor → New query**.
2. Paste and run `supabase/migrations/20261125000000_init.sql`.
3. Paste and run `supabase/seed.sql`.
4. **Authentication → URL Configuration**: add your Vercel URL and `http://localhost:3000`.

## Set up Vercel

Project settings → Environment Variables:

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key (server only; not used yet) |

Settings → Functions → region **Frankfurt (fra1)**. Redeploy after adding variables.

## Run locally

```bash
cp .env.example .env.local   # fill in the values
npm install
npm run dev
```

## Data model

- `seasons`, `episodes`: catalogue, with version, review date and publish status.
- `structures`: Direzione Generale, Strutture Territoriali, Società Controllate.
- `profiles`: one per auth user; profile (operativo, amministrativo, management) and role (learner, manager, admin, editor).
- `episode_progress`: status, resume node, score, attempts, time per user and episode.
- `decision_events`: every Stop & Decide answer with its risk tag, for reports and recaps.

Row Level Security is on for every table: learners see and write only their own records;
staff roles read everything.

## Next steps

1. Login (Supabase magic link) and real progress.
2. Player v1: video, branching from a scenario file, Check, resume.
3. Admin: catalogue, user import, assignments by profile.
4. Assessment, season tests, certificates, badges.
5. Notifications and recaps (Vercel Cron + Resend).
6. Reports. 7. Simulated phishing. 8. Lifecycle, editor, policy acknowledgement. 9. SCORM and xAPI export.
