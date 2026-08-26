/* Cinema Index page: a self-contained, high-contrast recovery screen that never depends on the application shell. */
'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: '#0a0a0a',
          color: '#f5f1e8',
          fontFamily: 'Avenir Next, Segoe UI, Arial, sans-serif',
          padding: '1.5rem',
        }}
      >
        <main style={{ maxWidth: '30rem', borderLeft: '2px solid #e2a23b', paddingLeft: '1.5rem' }}>
          <p style={{ color: '#e2a23b', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.16em', margin: 0, textTransform: 'uppercase' }}>
            DAM recovery
          </p>
          <h1 style={{ fontSize: '2rem', lineHeight: 1.1, margin: '0.75rem 0' }}>
            This view could not be loaded.
          </h1>
          <p style={{ color: '#b7b3aa', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
            Try again to return to the current DAM release.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              background: '#e2a23b',
              border: 0,
              color: '#17130d',
              cursor: 'pointer',
              fontWeight: 700,
              padding: '0.75rem 1rem',
            }}
          >
            Try again
          </button>
          {error.digest ? (
            <p style={{ color: '#77736c', fontSize: '0.75rem', marginTop: '1rem' }}>
              Reference: {error.digest}
            </p>
          ) : null}
        </main>
      </body>
    </html>
  )
}
