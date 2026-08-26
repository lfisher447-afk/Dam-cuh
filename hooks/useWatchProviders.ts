import { useQuery } from "@tanstack/react-query";
import { getMovieWatchProvidersList } from "../services/apiWatchProvidersBrowser";
import type { TMDBWatchProvider } from "types";

export function useWatchProviders() {
  const { data: providers, isPending } = useQuery<TMDBWatchProvider[]>({
    queryKey: ["watchProviders"],
    queryFn: getMovieWatchProvidersList,
    staleTime: 1000 * 60 * 60 * 24,
  });

  return { providers: providers ?? [], isPending };
}
