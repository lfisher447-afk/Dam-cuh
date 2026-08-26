/* Cinema Index component: low-distraction consent controls that preserve a calm, reader-first DAM viewing experience. */
'use client'

import { useEffect, useState } from 'react'

const CONSENT_KEY = 'dam-cookie-consent'

export default function CookiesBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(window.localStorage.getItem(CONSENT_KEY) === null)
  }, [])

  const saveConsent = (value: 'accepted' | 'essential') => {
    window.localStorage.setItem(CONSENT_KEY, value)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <aside
      className="fixed right-4 bottom-4 left-4 z-[90] mx-auto max-w-xl border border-white/10 bg-black/90 p-4 text-sm text-white shadow-2xl backdrop-blur-xl sm:right-6 sm:left-auto"
      aria-label="Cookie preferences"
    >
      <p className="font-semibold text-white">A better, more private DAM.</p>
      <p className="mt-1 leading-5 text-white/70">
        Essential storage keeps your viewing preferences and saved titles available.
        You can choose whether to allow optional analytics as well.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => saveConsent('essential')}
          className="rounded-full border border-white/20 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10 active:scale-[0.97]"
        >
          Essential only
        </button>
        <button
          type="button"
          onClick={() => saveConsent('accepted')}
          className="rounded-full bg-primary-fill px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary-fill/85 active:scale-[0.97]"
        >
          Accept analytics
        </button>
      </div>
    </aside>
  )
}
