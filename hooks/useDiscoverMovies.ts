import { useInfiniteQuery } from "@tanstack/react-query";
import { getDiscover } from "../services/apiDiscover";
import type { DiscoverParams } from "../services/apiDiscover";
import type { Movie } from "types";

export function useDiscoverMovies(params: DiscoverParams = {}) {
  const result = useInfiniteQuery({
    queryKey: ["discover", params],
    queryFn: async ({ pageParam = 1 }) => {
      const { movies, totalPages } = await getDiscover({
        ...params,
        page: pageParam,
      });
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
