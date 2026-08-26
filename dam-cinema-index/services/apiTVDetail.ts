import { tmdbFetch, imageUrl } from "../lib/tmdb";
import type { Movie, TMDBDetail } from "types";

export async function getTVDetail(id: number): Promise<TMDBDetail> {
  return tmdbFetch<TMDBDetail>(`/tv/${id}`);
}

export function mapTVDetailToMovie(detail: TMDBDetail): Movie {
  return {
    id: detail.id,
    title: detail.name || detail.title || "",
    year: (detail.first_air_date || detail.release_date || "").slice(0, 4),
    category: "tv series" as const,
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
