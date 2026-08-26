/* Cinema Index component: calm recovery messaging with direct, clearly labeled actions for DAM visitors. */
'use client'

import { AlertTriangle, RotateCcw } from 'lucide-react'

type RouteErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function RouteError({ error, reset }: RouteErrorProps) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-background px-6 py-16 text-foreground">
      <section className="max-w-lg border-l-2 border-primary-fill pl-6">
        <div className="mb-5 flex size-11 items-center justify-center rounded-full bg-primary-fill/15 text-primary-fill">
          <AlertTriangle className="size-5" aria-hidden />
        </div>
        <p className="text-xs font-semibold tracking-[0.18em] text-primary-fill uppercase">
          Playback interrupted
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          This page could not be loaded.
        </h1>
        <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
          The request did not complete. Please try again; your saved titles and
          viewing history remain unchanged.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary-fill px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-150 ease-out hover:bg-primary-fill/85 active:scale-[0.97]"
        >
          <RotateCcw className="size-4" aria-hidden />
          Try again
        </button>
        {error.digest ? (
          <p className="mt-5 text-xs text-muted-foreground">
            Reference: {error.digest}
          </p>
        ) : null}
      </section>
    </main>
  )
}
