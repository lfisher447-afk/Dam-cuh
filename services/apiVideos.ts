import { tmdbFetch } from "../lib/tmdb";
import type { TMDBVideosResponse, TMDBVideo } from "types";

export async function getMovieVideos(id: number): Promise<TMDBVideo[]> {
  const data = await tmdbFetch<TMDBVideosResponse>(`/movie/${id}/videos`);
  return data.results;
}

export async function getTVVideos(id: number): Promise<TMDBVideo[]> {
  const data = await tmdbFetch<TMDBVideosResponse>(`/tv/${id}/videos`);
  return data.results;
}

export function findTrailer(videos: TMDBVideo[]): TMDBVideo | undefined {
  return videos.find(
    (v) => v.site === "YouTube" && v.type === "Trailer" && v.official,
  ) || videos.find(
    (v) => v.site === "YouTube" && v.type === "Trailer",
  ) || videos.find(
    (v) => v.site === "YouTube",
  );
}

export function getYouTubeEmbedUrl(videoKey: string): string {
  return `https://www.youtube.com/embed/${videoKey}`;
}
