import { auth, db } from "../lib/firebase";
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
} from "firebase/firestore";
import { tmdbFetch, imageUrl } from "../lib/tmdb";

export async function updateBookmark({
  newValue,
  id: tmdbId,
}: {
  newValue: boolean;
  id: number;
}) {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const ref = doc(collection(db, "users", user.uid, "bookmarks"), String(tmdbId));

  if (newValue) {
    const details = await tmdbFetch<{
      title?: string;
      name?: string;
      release_date?: string;
      first_air_date?: string;
      poster_path: string | null;
      backdrop_path: string | null;
      vote_average: number;
    }>(`/movie/${tmdbId}`).catch(async () => {
      return tmdbFetch<{
        title?: string;
        name?: string;
        release_date?: string;
        first_air_date?: string;
        poster_path: string | null;
        backdrop_path: string | null;
        vote_average: number;
      }>(`/tv/${tmdbId}`);
    });

    const title = details.title || details.name || "Unknown";
    const year = (details.release_date || details.first_air_date || "").slice(
      0,
      4,
    );
    const mediaType = details.title ? "movie" : "tv";

    await setDoc(ref, {
      tmdbId,
      title,
      year,
      mediaType,
      rating: details.vote_average ? details.vote_average.toFixed(1) : "N/A",
      posterSmall: imageUrl(details.poster_path, "w185"),
      posterMedium: imageUrl(details.poster_path, "w342"),
      posterLarge: imageUrl(details.poster_path, "w500"),
      backdropLarge: imageUrl(details.backdrop_path, "w1280"),
      addedAt: Date.now(),
    });
  } else {
    await deleteDoc(ref);
  }
}
