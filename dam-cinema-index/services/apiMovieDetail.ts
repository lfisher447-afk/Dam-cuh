import { tmdbFetch, imageUrl } from "../lib/tmdb";
import type { Movie, TMDBDetail } from "types";

export async function getMovieDetail(id: number): Promise<TMDBDetail> {
  return tmdbFetch<TMDBDetail>(`/movie/${id}`);
}

export function mapDetailToMovie(detail: TMDBDetail): Movie {
  return {
    id: detail.id,
    title: detail.title || detail.name || "",
    year: (detail.release_date || detail.first_air_date || "").slice(0, 4),
    category: detail.title ? ("movie" as const) : ("tv series" as const),
    rating: detail.vote_average ? detail.vote_average.toFixed(1) : "N/A",
    thumbnail: {
      regular: {
        small: imageUrl(detail.poster_path, "w185"),
        medium: imageUrl(detail.poster_path, "w342"),
        large:
          imageUrl(detail.backdrop_path || detail.poster_path, "w1280") ||
          imageUrl(detail.poster_path, "w500"),
      },
    },
    isBookmarked: false,
  };
}
