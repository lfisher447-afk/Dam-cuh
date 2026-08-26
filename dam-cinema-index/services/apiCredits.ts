import { tmdbFetch } from "../lib/tmdb";
import type { TMDBCreditsResponse } from "types";

export async function getMovieCredits(
  id: number,
): Promise<TMDBCreditsResponse> {
  return tmdbFetch<TMDBCreditsResponse>(`/movie/${id}/credits`);
}

export async function getTVCredits(id: number): Promise<TMDBCreditsResponse> {
  return tmdbFetch<TMDBCreditsResponse>(`/tv/${id}/credits`);
}
