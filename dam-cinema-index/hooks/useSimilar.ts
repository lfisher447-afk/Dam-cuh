import { useQuery } from "@tanstack/react-query";
import { getSimilarMovies, getSimilarTVShows } from "../services/apiSimilar";
import { imageUrl } from "../lib/tmdb";
import type { Movie } from "types";

export function useSimilar(id: number, mediaType: "movie" | "tv") {
  const { data, isPending } = useQuery({
    queryKey: ["similar", id, mediaType],
    queryFn: () =>
      mediaType === "movie" ? getSimilarMovies(id) : getSimilarTVShows(id),
  });

  const similar: Movie[] = (data?.results || []).map((item) => ({
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

  return { similar, isPending };
}
