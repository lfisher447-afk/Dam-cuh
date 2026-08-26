# DAM — Cinema Index

**DAM** is a Vercel-ready Next.js movie and television discovery application. It combines editorial browsing, search, title details, cast information, watchlists, progress tracking, account surfaces, live and regional discovery, mood browsing, reels, match nights, and accessibility-aware recovery states into one consolidated codebase.

The active application is implemented in the Next.js App Router under `app/`. Every viable component and feature module from the supplied source has been retained. The duplicate, incompatible historical application shell is preserved under `legacy/previous-shell/` for reference and is explicitly excluded from TypeScript compilation and Vercel deployment.

> **Deployment note:** DAM is configured for runtime rendering on Vercel. This keeps production builds independent of live catalogue credentials while allowing configured APIs to supply fresh data at request time.

## Highlights

| Area | Included capabilities |
| --- | --- |
| Discovery | Editorial home experience, movie and television rails, trending lists, genre and year browsing, regional rows, daypart programming, and collection pages. |
| Title detail | Metadata, trailers, cast, credits, related titles, providers, episodes, seasons, structured data, and resilient media artwork helpers. |
| Personal library | Watchlist, next-up queue, watch history, completion tracking, account views, progress-aware statistics, and local-first fallbacks. |
| Shared experiences | Mood browsing, reels, live channels, match night, watch together, and community-oriented support surfaces. |
| Platform quality | Responsive interaction, keyboard-safe controls, error boundaries, recovery views, query caching, image fallbacks, JSON-LD, sitemap and robots routes. |
| Deployment | Locked npm dependency installation, Vercel configuration, environment template, dynamic runtime rendering, and a portable filename layout. |

## Technology

The consolidated application uses **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS 4**, **TanStack Query**, **Supabase**, **Firebase**, **Framer Motion**, and **TMDB-compatible** catalogue integrations. Optional integrations are inert until their corresponding environment variables are configured.

## Local setup

Clone the repository, install the exact locked dependencies, copy the environment template, and start the development server.

```bash
git clone <your-github-repository-url>
cd dam-cinema-index
npm ci
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. For live movie and television data, provide `TMDB_API_KEY` in `.env.local`. The project still builds without it; catalogue requests will require the key at runtime.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local Next.js development server. |
| `npm run lint` | Run ESLint across the source tree. |
| `npm run typecheck` | Run TypeScript validation without creating output. |
| `npm run build` | Produce a standard production build. |
| `npm run vercel-build` | Run the production build command used by Vercel. |
| `npm run start` | Serve a completed local production build. |

## Environment configuration

Copy `.env.example` rather than committing local credentials. The variables fall into the following groups.

| Group | Required variables | Purpose |
| --- | --- | --- |
| Catalogue | `TMDB_API_KEY` | Enables authenticated catalogue, title, person, provider, and media metadata requests. |
| Application URL | `NEXT_PUBLIC_BASE_URL` | Supplies the canonical public URL for metadata, sitemap, and social cards. |
| Accounts | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SESSION_TOKEN_SECRET`, `TOKEN_SECRET` | Enables account sessions and synced library features when Supabase is configured. |
| OAuth | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Enables optional Google sign-in. |
| Analytics | `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` | Enables optional product analytics and error reporting. |
| Notifications | `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` | Enables optional Web Push notifications. |
| Integrations | Firebase and streaming-source variables from `.env.example` | Activates optional retained integrations without affecting the core DAM experience. |

## Vercel deployment

Import this repository into [Vercel][1], choose the repository root as the project root, and leave the detected **Next.js** framework in place. The committed `vercel.json` installs dependencies through `npm ci` and uses `npm run vercel-build` for the deployment build.

Add the relevant variables from `.env.example` in the Vercel project settings before enabling the associated integrations. At a minimum, set `TMDB_API_KEY` for live catalogue data and set `NEXT_PUBLIC_BASE_URL` to the production domain after it has been assigned. Do not expose server-only values by prefixing them with `NEXT_PUBLIC_`.

> DAM’s root application layout uses runtime rendering. This avoids failures caused by unavailable third-party data during a build, while Vercel provides a server-rendered response for each route at request time.

## Project structure

```text
app/                 Active Next.js App Router routes, API routes, metadata, and recovery boundaries
components/          Shared DAM UI, account, media, support, header, and interaction components
config/              Brand, navigation, support, regional, and feature configuration
features/            Retained feature modules from the supplied application
hooks/               Browser, account, media, and interaction hooks
lib/                 API clients, media utilities, structured data, analytics, and application helpers
providers/           App-wide data providers, including TanStack Query
services/            Retained data-service modules
public/              Static web assets, manifests, robots, redirects, and headers
legacy/              Preserved reference source excluded from runtime compilation and deployment
```

## Source consolidation

The supplied archive contained a duplicate root-level shell alongside the active `app/` tree, case-conflicting carousel filenames, an embedded source archive, and dependency/configuration drift. The active DAM application now has a single portable source of truth. Duplicate historical shell files are preserved in `legacy/previous-shell/` so no viable source is lost, but they cannot interfere with GitHub checkouts or Vercel builds.

## GitHub workflow

Commit the complete repository, including `package-lock.json`, `vercel.json`, `.vercelignore`, `.env.example`, and this README. Never commit `.env.local`, `node_modules`, `.next`, deployment credentials, or production service tokens.

```bash
git add .
git commit -m "Prepare DAM for Vercel deployment"
git push origin main
```

## References

[1]: https://vercel.com/docs/deployments/git "Vercel documentation: Deploying from Git"
