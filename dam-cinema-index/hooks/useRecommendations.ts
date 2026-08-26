import { useQuery } from "@tanstack/react-query";
import {
  getMovieRecommendations,
  getTVRecommendations,
} from "../services/apiRecommendations";
import { imageUrl } from "../lib/tmdb";
import type { Movie } from "types";

export function useRecommendations(id: number, mediaType: "movie" | "tv") {
  const { data, isPending } = useQuery({
    queryKey: ["recommendations", id, mediaType],
    queryFn: () =>
      mediaType === "movie"
        ? getMovieRecommendations(id)
        : getTVRecommendations(id),
  });

  const recommendations: Movie[] = (data?.results || []).map((item) => ({
    id: item.id,
    title: item.title || item.name || "",
    year: (item.release_date || item.first_air_date || "").slice(0, 4),
    category: mediaType === "movie" ? ("movie" as const) : ("tv series" as const),
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

  return { recommendations, isPending };
}
