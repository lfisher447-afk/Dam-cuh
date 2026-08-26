import { useInfiniteQuery } from "@tanstack/react-query";
import { getPlatformMovies } from "../services/apiPlatformMovies";
import type { Movie } from "types";

export function usePlatformMovies(providerId: number) {
  const result = useInfiniteQuery({
    queryKey: ["platformMovies", providerId],
    queryFn: async ({ pageParam = 1 }) => {
      const { movies, totalPages } = await getPlatformMovies(
        providerId,
        pageParam,
      );
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
