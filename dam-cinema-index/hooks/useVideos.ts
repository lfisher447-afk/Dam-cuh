import { useQuery } from "@tanstack/react-query";
import { getMovieVideos, getTVVideos } from "../services/apiVideos";
import type { TMDBVideo } from "types";

export function useVideos(id: number, mediaType: "movie" | "tv") {
  const { data: videos, isPending } = useQuery({
    queryKey: ["videos", id, mediaType],
    queryFn: () =>
      mediaType === "movie" ? getMovieVideos(id) : getTVVideos(id),
    staleTime: 1000 * 60 * 60,
  });

  const trailer: TMDBVideo | undefined =
    videos?.find(
      (v) => v.site === "YouTube" && v.type === "Trailer" && v.official,
    ) ||
    videos?.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
    videos?.find((v) => v.site === "YouTube");

  return { videos: videos || [], trailer, isPending };
}
