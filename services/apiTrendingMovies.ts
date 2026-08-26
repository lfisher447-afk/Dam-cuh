import { tmdbFetch, imageUrl } from "../lib/tmdb";
import type { Movie } from "types";

type TMDBResult = {
  id: number;
  title?: string;
  name?: string;
  media_type?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
};

type TMDBPage = {
  page: number;
  results: TMDBResult[];
  total_pages: number;
  total_results: number;
};

export async function getTrendingMovies(): Promise<Movie[]> {
  const data = await tmdbFetch<TMDBPage>("/trending/all/day");

  return data.results.map((item) => {
    const isMovie =
      item.media_type === "movie" ||
      (!!item.title && !item.name);

    return {
      id: item.id,
      title: item.title || item.name || "",
      year: (item.release_date || item.first_air_date || "").slice(0, 4),
      category: isMovie ? "movie" as const : "tv series" as const,
      rating: item.vote_average ? item.vote_average.toFixed(1) : "N/A",
      thumbnail: {
        regular: {
          small: imageUrl(item.poster_path, "w185"),
          medium: imageUrl(item.poster_path, "w342"),
          large:
            imageUrl(item.backdrop_path || item.poster_path, "w1280") ||
            imageUrl(item.poster_path, "w500"),
        },
        trending: {
          small: imageUrl(item.backdrop_path, "w500"),
          large: imageUrl(item.backdrop_path, "w1280"),
        },
      },
      isBookmarked: false,
    };
  });
}
