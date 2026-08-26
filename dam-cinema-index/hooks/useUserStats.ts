import { useQuery } from "@tanstack/react-query";
import { auth, db } from "../lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import type { WatchHistoryEntry } from "../services/apiWatchHistory";

export type UserStats = {
  totalWatched: number;
  bookmarkCount: number;
  favoriteGenre: string | null;
  recentHistory: (WatchHistoryEntry & { tmdbId: number })[];
};

async function fetchStats(): Promise<UserStats> {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    return { totalWatched: 0, bookmarkCount: 0, favoriteGenre: null, recentHistory: [] };
  }

  const [historySnap, bookmarkSnap] = await Promise.all([
    getDocs(collection(db, "users", uid, "history")),
    getDocs(collection(db, "users", uid, "bookmarks")),
  ]);

  const historyEntries = historySnap.docs.map((d) => ({
    ...(d.data() as WatchHistoryEntry),
    tmdbId: Number(d.id),
  }));

  const bookmarkCount = bookmarkSnap.size;
  const totalWatched = historyEntries.length;

  const genreCount: Record<string, number> = {};
  for (const entry of historyEntries.slice(0, 50)) {
    if (entry.category) {
      genreCount[entry.category] = (genreCount[entry.category] || 0) + 1;
    }
  }
  const favoriteGenre = Object.entries(genreCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  const recentQuery = query(
    collection(db, "users", uid, "history"),
    orderBy("watchedAt", "desc"),
    limit(5),
  );
  const recentSnap = await getDocs(recentQuery);
  const recentHistory = recentSnap.docs.map((d) => ({
    ...(d.data() as WatchHistoryEntry),
    tmdbId: Number(d.id),
  }));

  return { totalWatched, bookmarkCount, favoriteGenre, recentHistory };
}

export function useUserStats() {
  return useQuery({
    queryKey: ["userStats"],
    queryFn: fetchStats,
    staleTime: 1000 * 60 * 2,
  });
}
