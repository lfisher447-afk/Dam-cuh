import { useQuery } from "@tanstack/react-query";
import { getTrendingMovies } from "../services/apiTrendingMovies";
import { Movie } from "types";

export function useTrendingMovies() {
  const { data: trendingMovies, isPending } = useQuery<Movie[]>({
    queryKey: ["trendingMovies"],
    queryFn: getTrendingMovies,
  });

  return { trendingMovies, isPending };
}
