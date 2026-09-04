import { apiConfig } from '@/lib/tmdbConfig'

// ============================================================================
// Types & Interfaces
// ============================================================================

export type ParamValue = string | number | boolean | null | undefined;
export type QueryParams = Record<string, ParamValue>;

export interface RequestOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
  revalidate?: number | false;
  tags?: string[];
}

export class TmdbHttpError extends Error {
  status: number;
  data?: unknown;

  constructor(status: number, message?: string, data?: unknown) {
    super(message || `TMDB API request failed with status: ${status}`);
    this.name = 'TmdbHttpError';
    this.status = status;
    this.data = data;
    Object.setPrototypeOf(this, TmdbHttpError.prototype);
  }
}

// Backward-compatible error creator
export const tmdbError = (status: number, message?: string, data?: unknown): TmdbHttpError => {
  return new TmdbHttpError(status, message, data);
};

export const isNotFoundError = (error: unknown): boolean => {
  if (!error) return false;
  if (typeof error === 'object' && error !== null) {
    const err = error as { status?: number; statusCode?: number };
    return err.status === 404 || err.statusCode === 404;
  }
  return false;
};

// ============================================================================
// Concurrency Governor (Guards TMDB limits during Vercel build phase)
// ============================================================================

const MAX_CONCURRENT = 6;
const MAX_RETRIES = 5;
const MAX_TRANSPORT_RETRIES = 3;
const FETCH_TIMEOUT_MS = 8000;

// Throttle requests specifically during static page pre-rendering
const GOVERN =
  process.env.NEXT_PHASE === 'phase-production-build' ||
  process.env.npm_lifecycle_event === 'build';

let activeRequests = 0;
const requestQueue: Array<() => void> = [];

const acquireSlot = async (): Promise<() => void> => {
  if (activeRequests < MAX_CONCURRENT) {
    activeRequests++;
    return releaseSlot;
  }
  return new Promise((resolve) => {
    requestQueue.push(() => {
      activeRequests++;
      resolve(releaseSlot);
    });
  });
};

const releaseSlot = (): void => {
  activeRequests--;
  const nextRequest = requestQueue.shift();
  if (nextRequest) {
    nextRequest();
  }
};

// ============================================================================
// Utility & Resiliency Helpers
// ============================================================================

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const parseRetryAfter = (header: string | null): number | null => {
  if (!header) return null;
  const seconds = Number(header);
  if (!Number.isNaN(seconds) && seconds >= 0) {
    return seconds * 1000;
  }
  const dateMs = Date.parse(header);
  if (!Number.isNaN(dateMs)) {
    const diff = dateMs - Date.now();
    return diff > 0 ? diff : 0;
  }
  return null;
};

const isTransportError = (error: unknown): boolean => {
  if (!error) return false;
  const err = error as Error;
  if (err.name === 'TimeoutError' || err.name === 'AbortError') return true;
  
  const msg = String(err.message || error).toLowerCase();
  return (
    msg.includes('fetch failed') ||
    msg.includes('econnreset') ||
    msg.includes('etimedout') ||
    msg.includes('eai_again') ||
    msg.includes('undici') ||
    msg.includes('network') ||
    msg.includes('socket hang up')
  );
};

const buildQueryString = (query: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.set(key, String(value));
    }
  }
  return searchParams.toString();
};

const resolveUrl = (baseUrl: string, endpoint: string, queryParams: Record<string, unknown>): string => {
  // If absolute URL provided, use it directly
  let fullUrl = endpoint.startsWith('http://') || endpoint.startsWith('https://')
    ? endpoint
    : `${baseUrl.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;

  const [path, existingQuery] = fullUrl.split('?');
  const mergedQuery: Record<string, unknown> = {};

  if (existingQuery) {
    const searchParams = new URLSearchParams(existingQuery);
    searchParams.forEach((val, key) => {
      mergedQuery[key] = val;
    });
  }

  Object.assign(mergedQuery, queryParams);
  const qs = buildQueryString(mergedQuery);

  return qs ? `${path}?${qs}` : path;
};

const isJwtToken = (token?: string): boolean => {
  return Boolean(token && token.startsWith('eyJ'));
};

// ============================================================================
// Core Execution Pipeline
// ============================================================================

async function executeRequest<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  params: QueryParams = {},
  body?: unknown,
  isHeaderAuth = false,
  revalidate: number | false = 28800,
  extraOptions?: RequestOptions
): Promise<T> {
  const headerToken = apiConfig.headerKey || apiConfig.apiKey;
  const useBearer = Boolean(isHeaderAuth && isJwtToken(headerToken));

  const query: Record<string, unknown> = {
    ...params,
    ...(!useBearer && apiConfig.apiKey ? { api_key: apiConfig.apiKey } : {}),
  };

  const finalUrl = resolveUrl(apiConfig.baseUrl, endpoint, query);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(useBearer && headerToken ? { Authorization: `Bearer ${headerToken}` } : {}),
    ...(extraOptions?.headers || {}),
  };

  if (GOVERN) {
    await acquireSlot();
  }

  try {
    let rateLimitAttempts = 0;
    let transportAttempts = 0;

    while (true) {
      let response: Response;

      try {
        const fetchConfig: RequestInit & { next?: { revalidate?: number | false; tags?: string[] } } = {
          method,
          headers,
          signal: extraOptions?.signal || AbortSignal.timeout(FETCH_TIMEOUT_MS),
          ...(body ? { body: JSON.stringify(body) } : {}),
        };

        if (method === 'GET') {
          if (revalidate === false) {
            fetchConfig.cache = 'force-cache';
          } else {
            fetchConfig.next = { 
              revalidate, 
              tags: extraOptions?.tags 
            };
          }
        }

        response = await fetch(finalUrl, fetchConfig);
      } catch (fetchErr: unknown) {
        if (isTransportError(fetchErr) && transportAttempts < MAX_TRANSPORT_RETRIES) {
          transportAttempts++;
          const jitter = Math.random() * 100;
          const backoff = 250 * Math.pow(2, transportAttempts - 1) + jitter;
          await delay(backoff);
          continue;
        }
        throw fetchErr;
      }

      // Handle 429 Rate Limiting
      if (response.status === 429 && rateLimitAttempts < MAX_RETRIES) {
        await response.body?.cancel();
        rateLimitAttempts++;
        const retryAfterMs = parseRetryAfter(response.headers.get('retry-after'));
        const jitter = Math.random() * 200;
        const backoff = retryAfterMs ?? (500 * Math.pow(2, rateLimitAttempts - 1) + jitter);
        
        console.warn(`[TMDB Rate Limit] Status 429 on ${endpoint}. Retrying in ${Math.round(backoff)}ms (Attempt ${rateLimitAttempts}/${MAX_RETRIES})`);
        await delay(backoff);
        continue;
      }

      // Handle 5xx Transient Server Errors from TMDB
      if (response.status >= 500 && response.status <= 504 && transportAttempts < MAX_TRANSPORT_RETRIES) {
        await response.body?.cancel();
        transportAttempts++;
        const backoff = 500 * Math.pow(2, transportAttempts - 1);
        await delay(backoff);
        continue;
      }

      // Non-OK responses
      if (!response.ok) {
        let errorData: any = null;
        let errorMessage = `TMDB API error: ${response.status} ${response.statusText}`;

        try {
          errorData = await response.json();
          if (errorData?.status_message) {
            errorMessage = errorData.status_message;
          }
        } catch {
          await response.body?.cancel();
        }

        throw new TmdbHttpError(response.status, errorMessage, errorData);
      }

      // Successful JSON response
      return (await response.json()) as T;
    }
  } catch (error: unknown) {
    if (!isNotFoundError(error)) {
      console.error(`[FetchClient Error] ${method} ${endpoint}:`, error);
    }
    throw error;
  } finally {
    if (GOVERN) {
      releaseSlot();
    }
  }
}

// ============================================================================
// Public Client API
// ============================================================================

export const fetchClient = {
  get: async <T>(
    url: string,
    params?: QueryParams,
    isHeaderAuth = false,
    revalidate: number | false = 28800,
    options?: RequestOptions
  ): Promise<T> => {
    return executeRequest<T>('GET', url, params, undefined, isHeaderAuth, revalidate, options);
  },

  post: async <T>(
    url: string,
    body: unknown = {},
    params?: QueryParams,
    isHeaderAuth = false,
    options?: RequestOptions
  ): Promise<T> => {
    return executeRequest<T>('POST', url, params, body, isHeaderAuth, false, options);
  },

  put: async <T>(
    url: string,
    body: unknown = {},
    params?: QueryParams,
    isHeaderAuth = false,
    options?: RequestOptions
  ): Promise<T> => {
    return executeRequest<T>('PUT', url, params, body, isHeaderAuth, false, options);
  },

  delete: async <T>(
    url: string,
    params?: QueryParams,
    isHeaderAuth = false,
    options?: RequestOptions
  ): Promise<T> => {
    return executeRequest<T>('DELETE', url, params, undefined, isHeaderAuth, false, options);
  },
};

export default fetchClient;
