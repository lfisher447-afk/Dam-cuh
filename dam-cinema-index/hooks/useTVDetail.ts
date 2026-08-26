import { useQuery } from "@tanstack/react-query";
import { getTVDetail, mapTVDetailToMovie } from "../services/apiTVDetail";
import type { TMDBDetail } from "types";

export function useTVDetail(id: number) {
  const { data, isPending, error } = useQuery({
    queryKey: ["tvDetail", id],
    queryFn: () => getTVDetail(id),
  });

  return {
    detail: data as TMDBDetail | undefined,
    movie: data ? mapTVDetailToMovie(data) : undefined,
    isPending,
    error,
  };
}
