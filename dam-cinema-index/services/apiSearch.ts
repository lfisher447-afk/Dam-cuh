import { tmdbFetch, imageUrl } from "../lib/tmdb";
import type { Movie, TMDBPage, TMDBMovieResult } from "types";

export async function searchMulti(query: string): Promise<Movie[]> {
  const data = await tmdbFetch<TMDBPage<TMDBMovieResult>>("/search/multi", {
    query,
  });

  return data.results
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .map((item) => {
      const isMovie = item.media_type === "movie";
      return {
        id: item.id,
        title: item.title || item.name || "",
        year: (item.release_date || item.first_air_date || "").slice(0, 4),
        category: isMovie ? ("movie" as const) : ("tv series" as const),
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
      };
    });
}
