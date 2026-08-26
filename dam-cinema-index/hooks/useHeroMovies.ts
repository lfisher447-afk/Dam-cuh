import { useQuery } from "@tanstack/react-query";
import { getTrendingMovies } from "../services/apiTrendingMovies";
import { getMovieVideos, findTrailer } from "../services/apiVideos";
import { tmdbFetch } from "../lib/tmdb";
import type { Movie, TMDBDetail } from "types";

export type HeroMovie = {
  movie: Movie;
  overview: string;
  status: string;
  releaseDate: string;
  trailerKey: string | null;
};

async function getHeroMovies(): Promise<HeroMovie[]> {
  const trending = await getTrendingMovies();
  const top = trending.slice(0, 5);

  const [details, videosPages] = await Promise.all([
    Promise.all(
      top.map((m) =>
        tmdbFetch<TMDBDetail>(`/${m.category === "movie" ? "movie" : "tv"}/${m.id}`),
      ),
    ),
    Promise.all(
      top.map((m) =>
        m.category === "movie" ? getMovieVideos(m.id) : Promise.resolve([]),
      ),
    ),
  ]);

  return top.map((movie, i) => {
    const detail = details[i];
    const trailer = findTrailer(videosPages[i] ?? []);
    return {
      movie,
      overview: detail?.overview ?? "",
      status: detail?.status ?? "",
      releaseDate: detail?.release_date ?? detail?.first_air_date ?? "",
      trailerKey: trailer?.key ?? null,
    };
  });
}

export function useHeroMovies() {
  const { data: heroMovies, isPending } = useQuery({
    queryKey: ["heroMovies"],
    queryFn: getHeroMovies,
    staleTime: 1000 * 60 * 5,
  });

  return { heroMovies: heroMovies ?? [], isPending };
}
