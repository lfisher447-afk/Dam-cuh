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
  genre_ids: number[];
};

type TMDBPage = {
  page: number;
  results: TMDBResult[];
  total_pages: number;
  total_results: number;
};

function mapItem(item: TMDBResult): Movie {
  const isMovie =
    item.media_type === "movie" ||
    (!!item.title && !item.name) ||
    !item.media_type;
  return {
    id: item.id,
    title: item.title || item.name || "",
    year: (item.release_date || item.first_air_date || "").slice(0, 4),
    category: isMovie ? "movie" : "tv series",
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
  };
}

export async function getAllMovies(): Promise<Movie[]> {
  const [trending, popular] = await Promise.all([
    tmdbFetch<TMDBPage>("/trending/all/day"),
    tmdbFetch<TMDBPage>("/discover/movie", {
      sort_by: "popularity.desc",
      page: "1",
    }),
  ]);

  const seen = new Set<number>();
  const combined = [...trending.results, ...popular.results].filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });

  return combined.map(mapItem);
}
