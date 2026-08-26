import { useQuery } from "@tanstack/react-query";
import { getTopRatedMovies, getTopRatedTVShows } from "../services/apiTopRated";

export function useTopRated() {
  const { data: movies, isPending: moviesPending } = useQuery({
    queryKey: ["topRatedMovies"],
    queryFn: getTopRatedMovies,
  });

  const { data: tvShows, isPending: tvPending } = useQuery({
    queryKey: ["topRatedTV"],
    queryFn: getTopRatedTVShows,
  });

  return {
    topMovies: movies || [],
    topTVShows: tvShows || [],
    isPending: moviesPending || tvPending,
  };
}
