const TMDB_BASE = "https://api.themoviedb.org/3";
const getTmdbKey = () => process.env.TMDB_API_KEY ?? process.env.NEXT_PUBLIC_TMDB_API_KEY ?? "";

export async function tmdbFetch<T = any>(
  endpoint: string,
  params: Record<string, ParamValue> = {},
  cache: { revalidate?: number } = { revalidate: CACHE.hour },
): Promise<T> {
  const key = getTmdbKey();
  if (!key) throw new TmdbError(500, "TMDB API key not configured");
  if (!endpoint.startsWith("/")) {
    throw new TmdbError(500, "Invalid TMDB endpoint");
  }

  const url = new URL(`${TMDB_BASE}${endpoint}`);
  url.searchParams.set("language", "en-US");
  Object.entries(params).forEach(([paramKey, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      url.searchParams.set(paramKey, String(value));
    }
  });

  const isBearer = key.startsWith("eyJ");
  if (!isBearer) {
    url.searchParams.set("api_key", key);
  }

  const headers: Record<string, string> = {
    accept: "application/json",
    ...(isBearer && { Authorization: `Bearer ${key}` }),
  };

  const res = await fetch(url.toString(), {
    headers,
    next: { revalidate: cache.revalidate },
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) {
    let message = res.statusText || "TMDB request failed";
    try {
      const body = await res.json();
      message = body.status_message ?? body.message ?? message;
    } catch {
      /* keep status text */
    }
    throw new TmdbError(res.status, `TMDB ${res.status}: ${message}`);
  }

  return res.json() as Promise<T>;
}
