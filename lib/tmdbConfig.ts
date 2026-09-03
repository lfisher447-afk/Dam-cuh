// Lines 8–24 in lib/tmdbConfig.ts:
const apiConfig = {
  get baseUrl() {
    const url = process.env.NEXT_PUBLIC_TMDB_BASEURL || 'https://api.themoviedb.org/3/'
    return url.endsWith('/') ? url : `${url}/`
  },
  get apiKey() {
    return process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY || ''
  },
  get headerKey() {
    if (process.env.TMDB_HEADER_KEY) return process.env.TMDB_HEADER_KEY
    const key =
      process.env.TMDB_API_KEY ||
      process.env.NEXT_PUBLIC_TMDB_API_KEY ||
      ''
    return key.startsWith('eyJ') ? key : ''
  },
  // ...
