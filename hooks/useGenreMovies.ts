import { useQuery } from "@tanstack/react-query";
import { tmdbFetch, imageUrl } from "../lib/tmdb";
import type { Movie, TMDBPage, TMDBMovieResult } from "types";

function mapItem(item: TMDBMovieResult): Movie {
  return {
    id: item.id,
    title: item.title || item.name || "",
    year: (item.release_date || item.first_air_date || "").slice(0, 4),
    category: (item.media_type as "movie" | "tv series") || "movie",
    rating: item.vote_average ? item.vote_average.toFixed(1) : "N/A",
    thumbnail: {
      regular: {
        small: imageUrl(item.poster_path, "w185"),
        medium: imageUrl(item.poster_path, "w342"),
        large: imageUrl(item.backdrop_path || item.poster_path, "w1280") || imageUrl(item.poster_path, "w500"),
      },
    },
    isBookmarked: false,
  };
}

export function useGenreMovies(genreId: number) {
  const { data, isPending } = useQuery({
    queryKey: ["genreMovies", genreId],
    queryFn: async () => {
      const data = await tmdbFetch<TMDBPage<TMDBMovieResult>>("/discover/movie", {
        with_genres: String(genreId),
        sort_by: "popularity.desc",
        page: "1",
      });
      return data.results.map(mapItem);
    },
  });

  return { movies: data || [], isPending };
}
