import { tmdbFetch } from "../lib/tmdb";

type ReleaseDateEntry = {
  certification: string;
  type: number;
};

type ReleaseDatesResult = {
  iso_3166_1: string;
  release_dates: ReleaseDateEntry[];
};

type ReleaseDatesResponse = {
  results: ReleaseDatesResult[];
};

export async function getMovieCertification(
  id: number,
): Promise<string | null> {
  const data = await tmdbFetch<ReleaseDatesResponse>(
    `/movie/${id}/release_dates`,
  );
  const us = data.results.find((r) => r.iso_3166_1 === "US");
  if (!us) return null;
  const theatrical = us.release_dates.find((d) => d.type === 3);
  return theatrical?.certification || us.release_dates[0]?.certification || null;
}
