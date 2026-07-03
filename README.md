# Reiseplanleggeren — Travel Planner (Phase 1 / MVP)

Manually build and organize multi-step trips in one clean timeline. You enter each
leg of the journey (bus, train, ferry, car, walking, flight, …) and the app lays it
out vertically while automatically calculating waiting times and travel statistics.

No route-finding, maps, or external integrations yet — everything is entered by hand.
The data layer is structured so services like Entur, Vy or Torghatten can be added
later without a rewrite.

## Tech stack

- **React 19 + TypeScript**
- **Vite** (build/dev)
- **Tailwind CSS v4**
- **Supabase** — PostgreSQL + Auth
- **@dnd-kit** — drag & drop segment reordering
- **react-router-dom** — routing

## Getting started

### 1. Environment variables

Copy the example env file and fill in your Supabase project credentials:

```bash
cp .env.example .env.local
```

```
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-publishable-key>
```

(A `.env.local` with the current project's credentials is already present.)

### 2. Create the database schema

The app needs two tables (`trips`, `trip_segments`) with row-level security. Open the
**Supabase dashboard → SQL Editor**, paste the contents of
[`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql), and run it.

This creates both tables, indexes, `updated_at` triggers, and RLS policies so each
user can only ever read/write their own trips. Auth (`auth.users`) is built in.

### 3. Install & run

```bash
npm install
npm run dev
```

Open the printed local URL, sign up, and start planning.

## Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the dev server                 |
| `npm run build`   | Type-check and build for production  |
| `npm run preview` | Preview the production build         |
| `npm run lint`    | Run ESLint                           |

## How the calculations work

Segment times are stored as `HH:MM` strings. All logic lives in
[`src/utils/time.ts`](src/utils/time.ts) and [`src/utils/tripStats.ts`](src/utils/tripStats.ts):

- **Waiting time** = next departure − previous arrival (wraps past midnight if negative).
- **Total transport time** = sum of all segment durations.
- **Total waiting time** = sum of all gaps.
- **Total travel time** = transport + waiting (equals first departure → final arrival).

Waiting times are colour-coded: **green** > 15 min, **yellow** 5–15 min, **red** < 5 min.

## Project structure

```
src/
  lib/            Supabase client
  types/          Database row types + app-facing domain models
  contexts/       Auth context + provider
  hooks/          useAuth, useTrips, useTripDetail
  utils/          time, tripStats, transport, date, cn
  components/
    ui/           Button, Input, Modal, Spinner, EmptyState
    auth/         AuthForm, ProtectedRoute
    layout/       AppLayout (header shell)
    trips/        TripForm, TripCard
    segments/     SegmentForm
    timeline/     Timeline, TimelineSegment, WaitingIndicator, TripStatsBar
  pages/          LoginPage, TripsPage, TripDetailPage
supabase/
  migrations/     SQL schema + RLS
```

## Phase 2 ideas (not implemented)

- Import departures from Entur / Vy / Torghatten APIs.
- Maps and geocoding.
- Multi-day trips with explicit dates per segment.
