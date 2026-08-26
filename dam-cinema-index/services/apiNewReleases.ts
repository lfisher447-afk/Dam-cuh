import { tmdbFetch, imageUrl } from "../lib/tmdb";
import type { Movie, TMDBPage, TMDBMovieResult } from "types";

function getDateDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
}

export async function getNewMovieReleases(): Promise<Movie[]> {
  const thirtyDaysAgo = getDateDaysAgo(30);
  const today = new Date().toISOString().split("T")[0];

  const data = await tmdbFetch<TMDBPage<TMDBMovieResult>>(
    "/discover/movie",
    {
      "primary_release_date.gte": thirtyDaysAgo,
      "primary_release_date.lte": today,
      sort_by: "primary_release_date.desc",
    },
  );

  return data.results.map((item) => ({
    id: item.id,
    title: item.title || "",
    year: (item.release_date || "").slice(0, 4),
    category: "movie" as const,
    rating: item.vote_average ? item.vote_average.toFixed(1) : "N/A",
    thumbnail: {
      regular: {
        small: imageUrl(item.poster_path, "w185"),
        medium: imageUrl(item.poster_path, "w342"),
        large:
          imageUrl(item.backdrop_path || item.poster_path, "w1280") ||
          imageUrl(item.poster_path, "w500"),
      },
    },
    isBookmarked: false,
  }));
}

export async function getNewTVReleases(): Promise<Movie[]> {
  const thirtyDaysAgo = getDateDaysAgo(30);
  const today = new Date().toISOString().split("T")[0];

  const data = await tmdbFetch<TMDBPage<TMDBMovieResult>>(
    "/discover/tv",
    {
      "first_air_date.gte": thirtyDaysAgo,
      "first_air_date.lte": today,
      sort_by: "first_air_date.desc",
    },
  );

  return data.results.map((item) => ({
    id: item.id,
    title: item.name || "",
    year: (item.first_air_date || "").slice(0, 4),
    category: "tv series" as const,
    rating: item.vote_average ? item.vote_average.toFixed(1) : "N/A",
    thumbnail: {
      regular: {
        small: imageUrl(item.poster_path, "w185"),
        medium: imageUrl(item.poster_path, "w342"),
        large:
          imageUrl(item.backdrop_path || item.poster_path, "w1280") ||
          imageUrl(item.poster_path, "w500"),
      },
    },
    isBookmarked: false,
  }));
}
