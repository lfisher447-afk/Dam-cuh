import { useQuery } from "@tanstack/react-query";
import {
  getMovieVideos,
  getTVVideos,
  findTrailer,
  getYouTubeEmbedUrl,
} from "../services/apiVideos";

export function useMovieVideo(
  id: number,
  category: string,
) {
  const isMovie = category === "movie";

  const { data: embedUrl, isPending } = useQuery({
    queryKey: ["movieVideo", id, category],
    queryFn: async () => {
      const videos = isMovie
        ? await getMovieVideos(id)
        : await getTVVideos(id);

      const trailer = findTrailer(videos);
      return trailer ? getYouTubeEmbedUrl(trailer.key) : null;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  return { embedUrl, isPending };
}
