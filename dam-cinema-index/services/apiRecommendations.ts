import { tmdbFetch } from "../lib/tmdb";
import type { TMDBPage, TMDBMovieResult } from "types";

export async function getMovieRecommendations(
  id: number,
): Promise<TMDBPage<TMDBMovieResult>> {
  return tmdbFetch<TMDBPage<TMDBMovieResult>>(
    `/movie/${id}/recommendations`,
  );
}

export async function getTVRecommendations(
  id: number,
): Promise<TMDBPage<TMDBMovieResult>> {
  return tmdbFetch<TMDBPage<TMDBMovieResult>>(`/tv/${id}/recommendations`);
}
