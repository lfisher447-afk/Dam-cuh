import { apiConfig } from '@/lib/tmdbConfig'

const buildUrl = (url: string, query: Record<string, unknown>): string => {
  const [base, existing] = url.split('?')
  const params = new URLSearchParams(existing ?? '')
  for (const [key, value] of Object.entries(query)) {
    if (value === null || value === undefined) continue
    params.set(key, String(value))
  }
  const qs = params.toString()
  return qs ? `${base}?${qs}` : base
}

const MAX_CONCURRENT = 6
const MAX_RETRIES = 6

const GOVERN =
  process.env.NEXT_PHASE === 'phase-production-build' ||
  process.env.npm_lifecycle_event === 'build'

let active = 0
const waiters: Array<() => void> = []

const acquire = async (): Promise<() => void> => {
  if (active < MAX_CONCURRENT) {
    active++
    return release
  }
  return new Promise((resolve) => {
    waiters.push(() => {
      active++
      resolve(release)
    })
  })
}

const release = (): void => {
  active--
  const next = waiters.shift()
  if (next) next()
}

const parseRetryAfter = (header: string | null): number | null => {
  if (!header) return null
  const seconds = Number(header)
  if (!Number.isNaN(seconds) && seconds >= 0) return seconds * 1000
  const date = Date.parse(header)
  if (!Number.isNaN(date)) {
    const delta = date - Date.now()
    return delta > 0 ? delta : 0
  }
  return null
}

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

const FETCH_TIMEOUT_MS = 6000

const isTransportError = (error: any): boolean => {
  if (!error) return false
  if (error.name === 'TimeoutError' || error.name === 'AbortError') return true
  const msg = String(error.message || error)
  return (
    msg.includes('fetch failed') ||
    msg.includes('ECONNRESET') ||
    msg.includes('ETIMEDOUT') ||
    msg.includes('EAI_AGAIN') ||
    msg.includes('undici') ||
    msg.includes('network')
  )
}

const MAX_TRANSPORT_RETRIES = 3

export const isNotFoundError = (error: any): boolean =>
  Boolean(error && (error.status === 404 || error.statusCode === 404))

const tmdbError = (status: number) =>
  Object.assign(new Error(`TMDB API error: ${status}`), { status })

export const fetchClient = {
  get: async <T>(
    url: string,
    params?: Record<string, string | number>,
    isHeaderAuth = false,
    revalidate: number | false = 28800
  ): Promise<T> => {
    const isJwt = (token?: string): boolean => Boolean(token && token.startsWith('eyJ'))
    const useBearer = Boolean(isHeaderAuth && isJwt(apiConfig.headerKey))

    const query: Record<string, unknown> = {
      ...params,
      ...(!useBearer && apiConfig.apiKey ? { api_key: apiConfig.apiKey } : {}),
    }

    const cleanUrl = url.startsWith('/') ? url.slice(1) : url
    const fullUrl = `${apiConfig.baseUrl}${buildUrl(cleanUrl, query)}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(useBearer && apiConfig.headerKey
        ? { Authorization: `Bearer ${apiConfig.headerKey}` }
        : {}),
    }

    if (GOVERN) await acquire()

    try {
      let attempts = 0
      let transportAttempts = 0
      while (true) {
        let res: Response
        try {
          res = await fetch(fullUrl, {
            method: 'GET',
            headers,
            ...(revalidate === false
              ? { cache: 'force-cache' }
              : { next: { revalidate } }),
            signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
          })
        } catch (fetchErr: any) {
          if (
            isTransportError(fetchErr) &&
            transportAttempts < MAX_TRANSPORT_RETRIES
          ) {
            transportAttempts++
            const backoff = 250 * 2 ** (transportAttempts - 1)
            await delay(backoff)
            continue
          }
          throw fetchErr
        }

        if (res.status === 429 && attempts < MAX_RETRIES) {
          await res.body?.cancel()
          attempts++
          const retryAfterMs = parseRetryAfter(res.headers.get('retry-after'))
          const backoff = retryAfterMs ?? 500 * 2 ** (attempts - 1)
          await delay(backoff)
          continue
        }
        if (!res.ok) {
          await res.body?.cancel()
          throw tmdbError(res.status)
        }
        return (await res.json()) as T
      }
    } catch (error: any) {
      if (!isNotFoundError(error)) console.error(error)
      throw error
    } finally {
      if (GOVERN) release()
    }
  },
  post: async <T>(url: string, body = {}): Promise<T> => {
    try {
      const cleanUrl = url.startsWith('/') ? url.slice(1) : url
      const isJwt = (token?: string): boolean => Boolean(token && token.startsWith('eyJ'))
      const headerToken = apiConfig.headerKey || apiConfig.apiKey
      const useBearer = isJwt(headerToken)
      const postUrl = !useBearer && apiConfig.apiKey
        ? `${cleanUrl}${cleanUrl.includes('?') ? '&' : '?'}api_key=${apiConfig.apiKey}`
        : cleanUrl

      const res = await fetch(`${apiConfig.baseUrl}${postUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(useBearer ? { Authorization: `Bearer ${headerToken}` } : {}),
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      })
      if (!res.ok) {
        await res.body?.cancel()
        throw tmdbError(res.status)
      }
      return await res.json()
    } catch (error: any) {
      if (!isNotFoundError(error)) console.error(error)
      throw error
    }
  },
}
