import { useQuery } from "@tanstack/react-query";
import {
  getNewMovieReleases,
  getNewTVReleases,
} from "../services/apiNewReleases";

export function useNewReleases() {
  const { data: movies, isPending: moviesPending } = useQuery({
    queryKey: ["newMovieReleases"],
    queryFn: getNewMovieReleases,
    staleTime: 1000 * 60 * 60,
  });

  const { data: tvShows, isPending: tvPending } = useQuery({
    queryKey: ["newTVReleases"],
    queryFn: getNewTVReleases,
    staleTime: 1000 * 60 * 60,
  });

  return {
    newMovies: movies || [],
    newTVShows: tvShows || [],
    isPending: moviesPending || tvPending,
  };
}
