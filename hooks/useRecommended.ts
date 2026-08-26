import { useQuery } from "@tanstack/react-query";
import { getBookmark } from "../services/apiBookmark";
import {
  getMovieRecommendations,
  getTVRecommendations,
} from "../services/apiRecommendations";
import { imageUrl } from "../lib/tmdb";
import type { Movie } from "types";

export function useRecommended() {
  const { data: bookmarks, isPending: bmPending } = useQuery({
    queryKey: ["bookmarkedMovies"],
    queryFn: getBookmark,
  });

  const seed = bookmarks?.[0];
  const tmdbId = seed?.id;
  const mediaType = seed?.category === "movie" ? ("movie" as const) : ("tv" as const);

  const { data, isPending: recPending } = useQuery({
    queryKey: ["recommended", tmdbId, mediaType],
    queryFn: () =>
      mediaType === "movie"
        ? getMovieRecommendations(tmdbId!)
        : getTVRecommendations(tmdbId!),
    enabled: !!tmdbId,
  });

  const recommended: Movie[] = (data?.results || []).map((item) => ({
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

  return {
    recommended,
    isPending: bmPending || recPending,
    hasBookmarks: !!seed,
  };
}
