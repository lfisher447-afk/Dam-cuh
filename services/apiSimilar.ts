import { tmdbFetch } from "../lib/tmdb";
import type { TMDBPage, TMDBMovieResult } from "types";

export async function getSimilarMovies(
  id: number,
): Promise<TMDBPage<TMDBMovieResult>> {
  return tmdbFetch<TMDBPage<TMDBMovieResult>>(`/movie/${id}/similar`);
}

export async function getSimilarTVShows(
  id: number,
): Promise<TMDBPage<TMDBMovieResult>> {
  return tmdbFetch<TMDBPage<TMDBMovieResult>>(`/tv/${id}/similar`);
}
