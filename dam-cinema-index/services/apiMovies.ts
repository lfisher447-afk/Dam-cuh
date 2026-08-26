import { tmdbFetch, imageUrl } from "../lib/tmdb";
import type { Movie, TMDBPage, TMDBMovieResult } from "types";

export type MoviesResponse = {
  movies: Movie[];
  totalPages: number;
};

export async function getMovies(
  page = 1,
  genreId?: number,
): Promise<MoviesResponse> {
  const params: Record<string, string> = {
    sort_by: "popularity.desc",
    page: String(page),
  };
  if (genreId) params.with_genres = String(genreId);

  const data = await tmdbFetch<TMDBPage<TMDBMovieResult>>(
    "/discover/movie",
    params,
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
