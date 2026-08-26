import { useQueryClient } from "@tanstack/react-query";
import { getMovieVideos, getTVVideos } from "../services/apiVideos";

export function usePrefetchDetail() {
  const queryClient = useQueryClient();

  const prefetchVideos = (id: number, mediaType: "movie" | "tv") => {
    queryClient.prefetchQuery({
      queryKey: ["videos", id, mediaType],
      queryFn: () =>
        mediaType === "movie" ? getMovieVideos(id) : getTVVideos(id),
      staleTime: 1000 * 60 * 60,
    });
  };

  return { prefetchVideos };
}
