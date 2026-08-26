import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllMovies } from "../services/apiAllMovies";
import { searchMulti } from "../services/apiSearch";

export function useHomeMovies(query?: string) {
  const { data: allMovies, isPending, isFetching } = useQuery({
    queryKey: ["allMovies", query],
    queryFn: query ? () => searchMulti(query) : getAllMovies,
    placeholderData: keepPreviousData,
  });

  return { allMovies, isPending, isFetching };
}
