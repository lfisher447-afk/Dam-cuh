import { tmdbFetch } from "../lib/tmdb";
import type { TMDBGenreListResponse, TMDBGenre } from "types";

export async function getMovieGenres(): Promise<TMDBGenre[]> {
  const data = await tmdbFetch<TMDBGenreListResponse>(
    "/genre/movie/list",
  );
  return data.genres;
}

export async function getTVGenres(): Promise<TMDBGenre[]> {
  const data =
    await tmdbFetch<TMDBGenreListResponse>("/genre/tv/list");
  return data.genres;
}
