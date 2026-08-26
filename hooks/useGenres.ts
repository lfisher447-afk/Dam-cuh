import { useQuery } from "@tanstack/react-query";
import { getMovieGenres, getTVGenres } from "../services/apiGenres";
import type { TMDBGenre } from "types";

export function useGenres() {
  const { data: movieGenres, isPending: moviePending } = useQuery({
    queryKey: ["movieGenres"],
    queryFn: getMovieGenres,
  });

  const { data: tvGenres, isPending: tvPending } = useQuery({
    queryKey: ["tvGenres"],
    queryFn: getTVGenres,
  });

  return {
    movieGenres: (movieGenres || []) as TMDBGenre[],
    tvGenres: (tvGenres || []) as TMDBGenre[],
    allGenres: [
      ...(movieGenres || []),
      ...(tvGenres || []).filter(
        (g) => !(movieGenres || []).find((mg) => mg.id === g.id),
      ),
    ] as TMDBGenre[],
    isPending: moviePending || tvPending,
  };
}
