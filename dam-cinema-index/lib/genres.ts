export interface GenreWithSlug {
  id: number
  name: string
  slug: string
}

export const MOVIE_GENRES_WITH_SLUG: GenreWithSlug[] = [
  { id: 28, name: "Action", slug: "action" },
  { id: 12, name: "Adventure", slug: "adventure" },
  { id: 16, name: "Animation", slug: "animation" },
  { id: 35, name: "Comedy", slug: "comedy" },
  { id: 80, name: "Crime", slug: "crime" },
  { id: 99, name: "Documentary", slug: "documentary" },
  { id: 18, name: "Drama", slug: "drama" },
  { id: 10751, name: "Family", slug: "family" },
  { id: 14, name: "Fantasy", slug: "fantasy" },
  { id: 36, name: "History", slug: "history" },
  { id: 27, name: "Horror", slug: "horror" },
  { id: 10402, name: "Music", slug: "music" },
  { id: 9648, name: "Mystery", slug: "mystery" },
  { id: 10749, name: "Romance", slug: "romance" },
  { id: 878, name: "Science Fiction", slug: "sci-fi" },
  { id: 53, name: "Thriller", slug: "thriller" },
  { id: 10752, name: "War", slug: "war" },
  { id: 37, name: "Western", slug: "western" },
]

export const TV_GENRES_WITH_SLUG: GenreWithSlug[] = [
  { id: 10759, name: "Action & Adventure", slug: "action-adventure" },
  { id: 16, name: "Animation", slug: "animation" },
  { id: 35, name: "Comedy", slug: "comedy" },
  { id: 80, name: "Crime", slug: "crime" },
  { id: 99, name: "Documentary", slug: "documentary" },
  { id: 18, name: "Drama", slug: "drama" },
  { id: 10751, name: "Family", slug: "family" },
  { id: 10762, name: "Kids", slug: "kids" },
  { id: 9648, name: "Mystery", slug: "mystery" },
  { id: 10763, name: "News", slug: "news" },
  { id: 10764, name: "Reality", slug: "reality" },
  { id: 10765, name: "Sci-Fi & Fantasy", slug: "sci-fi-fantasy" },
  { id: 10766, name: "Soap", slug: "soap" },
  { id: 10767, name: "Talk", slug: "talk" },
  { id: 10768, name: "War & Politics", slug: "war-politics" },
  { id: 37, name: "Western", slug: "western" },
]

export const MOVIES_GENRE = MOVIE_GENRES_WITH_SLUG
export const TV_GENRE = TV_GENRES_WITH_SLUG
export const MOVIE_GENRES = MOVIE_GENRES_WITH_SLUG
export const TV_GENRES = TV_GENRES_WITH_SLUG


export const GENRE_LIST: { id: string; name: string }[] = MOVIE_GENRES_WITH_SLUG.map((g) => ({
  id: String(g.id),
  name: g.name,
}))

export const GENRE_NAMES: Record<string, string> = {
  ...Object.fromEntries(MOVIE_GENRES_WITH_SLUG.map((g) => [String(g.id), g.name])),
  ...Object.fromEntries(TV_GENRES_WITH_SLUG.map((g) => [String(g.id), g.name])),
}

export const genreMap: Record<number | string, string> = {
  ...Object.fromEntries(MOVIE_GENRES_WITH_SLUG.map((g) => [g.id, g.name])),
  ...Object.fromEntries(TV_GENRES_WITH_SLUG.map((g) => [g.id, g.name])),
}

export function findMovieGenreBySlug(slug: string): GenreWithSlug | undefined {
  return MOVIE_GENRES_WITH_SLUG.find((g) => g.slug === slug || g.slug === slug.toLowerCase())
}

export function findTvGenreBySlug(slug: string): GenreWithSlug | undefined {
  return TV_GENRES_WITH_SLUG.find((g) => g.slug === slug || g.slug === slug.toLowerCase())
}

export function findMovieGenreById(id: number | string): GenreWithSlug | undefined {
  return MOVIE_GENRES_WITH_SLUG.find((g) => g.id === Number(id))
}

export function findTvGenreById(id: number | string): GenreWithSlug | undefined {
  return TV_GENRES_WITH_SLUG.find((g) => g.id === Number(id))
}

export function genreToSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
}
