import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { findMovieGenreById, findTvGenreById } from "@/lib/genres"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function dateFormatter(
  dateStr: string | null | undefined,
  _compact = false,
): string {
  if (!dateStr) return "N/A"
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  } catch {
    return dateStr
  }
}

export function convertMinutesToHours(minutes: number | null | undefined): string {
  if (!minutes || minutes <= 0) return "N/A"
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hrs === 0) return `${mins}m`
  if (mins === 0) return `${hrs}h`
  return `${hrs}h ${mins}m`
}

export function moneyFormatter(num: number | null | undefined): string {
  if (!num || num <= 0) return "N/A"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(num)
}

export function numberRounder(val: number | string | null | undefined, precision = 1): string {
  if (val === null || val === undefined) return "0"
  const num = typeof val === "string" ? parseFloat(val) : val
  if (isNaN(num)) return "0"
  return num.toFixed(precision)
}

export function seasonsFormatter(seasonCount: number | null | undefined): string {
  if (!seasonCount || seasonCount <= 0) return "1 Season"
  if (seasonCount === 1) return "1 Season"
  return `${seasonCount} Seasons`
}

export function isRecentlyReleased(dateStr: string | null | undefined, days = 60): boolean {
  if (!dateStr) return false
  try {
    const releaseDate = new Date(dateStr).getTime()
    const now = Date.now()
    const diffDays = (now - releaseDate) / (1000 * 60 * 60 * 24)
    return diffDays >= 0 && diffDays <= days
  } catch {
    return false
  }
}

export function getImageURL(path: string | null | undefined, size: string = "original"): string {
  if (!path) return "/placeholder-backdrop.png"
  if (path.startsWith("http")) return path
  return `https://image.tmdb.org/t/p/${size}${path.startsWith("/") ? "" : "/"}${path}`
}

export function getLogoImageURL(
  path: string | null | undefined,
  size: "w300" | "w500" | "original" = "w500",
): string {
  if (!path) return "/placeholder-logo.png"
  if (path.startsWith("http")) return path
  return `https://image.tmdb.org/t/p/${size}${path.startsWith("/") ? "" : "/"}${path}`
}

export function getLogoImageSrcSet(path: string | null | undefined): string | undefined {
  if (!path || path.startsWith("http")) return undefined
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return [
    `https://image.tmdb.org/t/p/w300${normalizedPath} 300w`,
    `https://image.tmdb.org/t/p/w500${normalizedPath} 500w`,
  ].join(", ")
}

export function getPosterImageURL(path: string | null | undefined, size: "w185" | "w342" | "w500" | "original" = "w500"): string {
  if (!path) return "/placeholder-poster.png"
  if (path.startsWith("http")) return path
  return `https://image.tmdb.org/t/p/${size}${path.startsWith("/") ? "" : "/"}${path}`
}

export function getThumbPosterURL(path: string | null | undefined): string {
  return getPosterImageURL(path, "w185")
}

export function getThumbBackdropURL(path: string | null | undefined): string {
  return getBackdropImageURL(path, "w780")
}

export function getBackdropImageURL(path: string | null | undefined, size: "w780" | "w1280" | "original" = "w1280"): string {
  if (!path) return "/placeholder-backdrop.png"
  if (path.startsWith("http")) return path
  return `https://image.tmdb.org/t/p/${size}${path.startsWith("/") ? "" : "/"}${path}`
}

export function getYoutubeThumbnail(key: string | null | undefined): string {
  if (!key) return "/placeholder-video.png"
  return `https://img.youtube.com/vi/${key}/hqdefault.jpg`
}

export function itemRedirect(
  type: "movie" | "tv" | string,
  id?: string | number,
): string {
  const basePath = type === "tv" ? "/tv-shows" : "/movies"
  return id === undefined || id === null ? basePath : `${basePath}/${id}`
}

export function getGenres(
  genreIds?: number[],
  genresObj?: { id: number; name: string }[],
  mediaType: 'movie' | 'tv' = 'movie',
  _genreTable?: any
): { id: number; name: string }[] {
  if (genresObj && Array.isArray(genresObj) && genresObj.length > 0) {
    return genresObj.slice(0, 3)
  }
  if (genreIds && Array.isArray(genreIds) && genreIds.length > 0) {
    const finder = mediaType === 'tv' ? findTvGenreById : findMovieGenreById
    const found = genreIds
      .map((id) => finder(id))
      .filter((g): g is NonNullable<typeof g> => Boolean(g))
      .map((g) => ({ id: g.id, name: g.name }))
      .slice(0, 3)
    return found
  }
  return []
}


export function truncate(str: string, length = 140): string {
  if (!str) return ""
  return str.length > length ? str.slice(0, length) + "..." : str
}

export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) return `${count} ${singular}`
  return `${count} ${plural || singular + 's'}`
}

export function listSentence(items: Array<string | null | undefined>): string {
  const values = items.map((item) => item?.trim()).filter((item): item is string => Boolean(item))
  if (values.length === 0) return ''
  if (values.length === 1) return values[0]
  if (values.length === 2) return `${values[0]} and ${values[1]}`
  return `${values.slice(0, -1).join(', ')}, and ${values.at(-1)}`
}
