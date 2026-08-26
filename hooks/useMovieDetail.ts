import { useQuery } from "@tanstack/react-query";
import { getMovieDetail, mapDetailToMovie } from "../services/apiMovieDetail";
import type { TMDBDetail } from "types";

export function useMovieDetail(id: number) {
  const { data, isPending, error } = useQuery({
    queryKey: ["movieDetail", id],
    queryFn: () => getMovieDetail(id),
  });

  return {
    detail: data as TMDBDetail | undefined,
    movie: data ? mapDetailToMovie(data) : undefined,
    isPending,
    error,
  };
}
