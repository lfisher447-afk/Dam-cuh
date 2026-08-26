import { tmdbFetch } from "../lib/tmdb";
import type { TMDBCollection } from "types";

export async function getCollection(
  id: number,
): Promise<TMDBCollection> {
  return tmdbFetch<TMDBCollection>(`/collection/${id}`);
}
