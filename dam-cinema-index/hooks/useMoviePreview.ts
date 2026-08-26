import { useQuery } from "@tanstack/react-query";
import { tmdbFetch } from "../lib/tmdb";
import type { TMDBDetail } from "types";

export function useMoviePreview(id: number, category: string) {
  return useQuery({
    queryKey: ["moviePreview", id, category],
    queryFn: () =>
      tmdbFetch<TMDBDetail>(
        `/${category === "movie" ? "movie" : "tv"}/${id}`,
      ),
    staleTime: 1000 * 60 * 30,
  });
}
