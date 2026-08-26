# Preserved Previous Shell

This directory retains the duplicate root-level application shell found in the supplied archive. Its pages and layouts depended on a separate React Router-based runtime and conflicted with the active Next.js App Router implementation under `app/`.

The files are preserved here for reference and feature migration; they are deliberately excluded from TypeScript compilation and Vercel deployment. The active, supported source of truth is the root `app/`, `components/`, `lib/`, `services/`, and `public/` structure.
