import { tmdbFetch } from "../lib/tmdb";
import type { TMDBWatchProvidersResponse } from "types";

export async function getMovieWatchProviders(
  id: number,
): Promise<TMDBWatchProvidersResponse> {
  return tmdbFetch<TMDBWatchProvidersResponse>(
    `/movie/${id}/watch/providers`,
  );
}

export async function getTVWatchProviders(
  id: number,
): Promise<TMDBWatchProvidersResponse> {
  return tmdbFetch<TMDBWatchProvidersResponse>(
    `/tv/${id}/watch/providers`,
  );
}

export function getUSFlatrateProviders(
  data: TMDBWatchProvidersResponse,
) {
  return data.results?.US?.flatrate || [];
}
