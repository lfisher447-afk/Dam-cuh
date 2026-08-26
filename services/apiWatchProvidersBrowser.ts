import { tmdbFetch } from "../lib/tmdb";
import type { TMDBWatchProvider } from "types";

type ProviderListResponse = {
  results: TMDBWatchProvider[];
};

export async function getMovieWatchProvidersList(): Promise<
  TMDBWatchProvider[]
> {
  const data = await tmdbFetch<ProviderListResponse>(
    "/watch/providers/movie",
  );
  return (data.results || []).sort(
    (a, b) => a.display_priority - b.display_priority,
  );
}
