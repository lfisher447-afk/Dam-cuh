import { useInfiniteQuery } from "@tanstack/react-query";
import { getMovies } from "../services/apiMovies";
import { searchMulti } from "../services/apiSearch";
import type { Movie } from "types";

export function useMovies(query?: string, genreId?: number) {
  const result = useInfiniteQuery({
    queryKey: ["movies", query, genreId],
    queryFn: async ({ pageParam = 1 }) => {
      if (query) {
        const results = await searchMulti(query);
        return { data: results, nextPage: undefined };
      }
      const { movies, totalPages } = await getMovies(pageParam, genreId);
      return {
        data: movies,
        nextPage: pageParam < totalPages ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  const movies: Movie[] =
    result.data?.pages.flatMap((p) => p.data) ?? [];

  return { ...result, movies };
}
