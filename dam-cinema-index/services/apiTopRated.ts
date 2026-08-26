import { tmdbFetch, imageUrl } from "../lib/tmdb";
import type { Movie, TMDBPage, TMDBMovieResult } from "types";

export async function getTopRatedMovies(): Promise<Movie[]> {
  const data = await tmdbFetch<TMDBPage<TMDBMovieResult>>(
    "/movie/top_rated",
  );

  return data.results.map((item) => ({
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
  }));
}

export async function getTopRatedTVShows(): Promise<Movie[]> {
  const data = await tmdbFetch<TMDBPage<TMDBMovieResult>>("/tv/top_rated");

  return data.results.map((item) => ({
    id: item.id,
    title: item.name || "",
    year: (item.first_air_date || "").slice(0, 4),
    category: "tv series" as const,
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
  }));
}
