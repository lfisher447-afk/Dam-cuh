import { useQuery } from "@tanstack/react-query";
import { getUpcomingMovies } from "../services/apiUpcoming";
import type { Movie } from "types";

export function useUpcoming() {
  const { data: movies, isPending } = useQuery<Movie[]>({
    queryKey: ["upcomingMovies"],
    queryFn: getUpcomingMovies,
    staleTime: 1000 * 60 * 60,
  });

  return { upcomingMovies: movies ?? [], isPending };
}
