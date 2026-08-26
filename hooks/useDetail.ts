import { useQuery } from "@tanstack/react-query";
import { getMovieDetail } from "../services/apiMovieDetail";
import { getTVDetail } from "../services/apiTVDetail";
import type { TMDBDetail } from "types";

export function useDetail(id: number, mediaType: "movie" | "tv") {
  return useQuery<TMDBDetail>({
    queryKey: [mediaType === "movie" ? "movieDetail" : "tvDetail", id],
    queryFn: () =>
      mediaType === "movie" ? getMovieDetail(id) : getTVDetail(id),
  });
}
