import { useQuery } from "@tanstack/react-query";
import { getSeasonDetails } from "../services/apiSeasonDetails";
import type { TMDBSeasonDetail } from "types";

export function useSeasonDetails(seriesId: number, seasonNumber: number) {
  const { data, isPending, error } = useQuery<TMDBSeasonDetail>({
    queryKey: ["seasonDetails", seriesId, seasonNumber],
    queryFn: () => getSeasonDetails(seriesId, seasonNumber),
    enabled: !!seriesId && !!seasonNumber,
  });

  return { season: data ?? null, isPending, error };
}
