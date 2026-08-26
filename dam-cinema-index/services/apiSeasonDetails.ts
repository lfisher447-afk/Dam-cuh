import { tmdbFetch } from "../lib/tmdb";
import type { TMDBSeasonDetail } from "types";

export async function getSeasonDetails(
  seriesId: number,
  seasonNumber: number,
): Promise<TMDBSeasonDetail> {
  return tmdbFetch<TMDBSeasonDetail>(
    `/tv/${seriesId}/season/${seasonNumber}`,
  );
}
