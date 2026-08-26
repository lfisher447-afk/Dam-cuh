import { useInfiniteQuery } from "@tanstack/react-query";
import { getSeries } from "../services/apiSeries";
import { searchMulti } from "../services/apiSearch";
import type { Movie } from "types";

export function useSeries(query?: string, genreId?: number) {
  const result = useInfiniteQuery({
    queryKey: ["series", query, genreId],
    queryFn: async ({ pageParam = 1 }) => {
      if (query) {
        const results = await searchMulti(query);
        return { data: results, nextPage: undefined };
      }
      const { series, totalPages } = await getSeries(pageParam, genreId);
      return {
        data: series,
        nextPage: pageParam < totalPages ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  const series: Movie[] =
    result.data?.pages.flatMap((p) => p.data) ?? [];

  return { ...result, series };
}
