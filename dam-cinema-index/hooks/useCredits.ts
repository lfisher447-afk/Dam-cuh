import { useQuery } from "@tanstack/react-query";
import { getMovieCredits, getTVCredits } from "../services/apiCredits";
import { imageUrl } from "../lib/tmdb";
import type { TMDBCastMember } from "types";

export type CastWithPhoto = TMDBCastMember & { photo: string };

export function useCredits(id: number, mediaType: "movie" | "tv") {
  const { data, isPending } = useQuery({
    queryKey: ["credits", id, mediaType],
    queryFn: () =>
      mediaType === "movie" ? getMovieCredits(id) : getTVCredits(id),
  });

  const cast: CastWithPhoto[] = (data?.cast || []).map((c) => ({
    ...c,
    photo: imageUrl(c.profile_path, "w185"),
  }));

  return { cast, isPending };
}
