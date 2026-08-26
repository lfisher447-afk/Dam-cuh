import { tmdbFetch, imageUrl } from "../lib/tmdb";
import type { Movie, TMDBPage, TMDBMovieResult } from "types";

export type DiscoverParams = {
  page?: number;
  withGenres?: string;
  language?: string;
  yearGte?: string;
  yearLte?: string;
};

export type DiscoverResponse = {
  movies: Movie[];
  totalPages: number;
};

export async function getDiscover(
  params: DiscoverParams = {},
): Promise<DiscoverResponse> {
  const queryParams: Record<string, string> = {
    sort_by: "popularity.desc",
    page: String(params.page || 1),
  };
  if (params.withGenres) queryParams.with_genres = params.withGenres;
  if (params.language) queryParams.with_original_language = params.language;
  if (params.yearGte) queryParams["primary_release_date.gte"] = params.yearGte;
  if (params.yearLte) queryParams["primary_release_date.lte"] = params.yearLte;

  const data = await tmdbFetch<TMDBPage<TMDBMovieResult>>(
    "/discover/movie",
    queryParams,
  );

  return {
    movies: data.results.map((item) => ({
      id: item.id,
      title: item.title || "",
      year: (item.release_date || "").slice(0, 4),
      category: "movie" as const,
      rating: item.vote_average ? item.vote_average.toFixed(1) : "N/A",
      thumbnail: {
        regular: {
          small: imageUrl(item.poster_path, "w185"),
          medium: imageUrl(item.poster_path, "w342"),
          large:
            imageUrl(item.backdrop_path || item.poster_path, "w1280") ||
            imageUrl(item.poster_path, "w500"),
        },
      },
      isBookmarked: false,
    })),
    totalPages: data.total_pages,
  };
}
