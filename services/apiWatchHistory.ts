import { db, auth } from "../lib/firebase";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  Timestamp,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
export type WatchHistoryEntry = {
  tmdbId: number;
  title: string;
  category: "movie" | "tv series";
  posterPath: string | null;
  backdropPath: string | null;
  season?: number;
  episode?: number;
  progress: number;
  resumeSeconds?: number;
  watchedAt: Timestamp;
};

export async function updateWatchProgress(
  tmdbId: number,
  data: {
    title: string;
    category: "movie" | "tv series";
    posterPath: string | null;
    backdropPath: string | null;
    season?: number;
    episode?: number;
    progress: number;
    resumeSeconds?: number;
  },
): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) return;

  const ref = doc(db, "users", uid, "history", String(tmdbId));
  await setDoc(ref, { ...data, watchedAt: Timestamp.now() });
}

export async function getWatchHistory(
  limitCount = 20,
): Promise<WatchHistoryEntry[]> {
  const uid = auth.currentUser?.uid;
  if (!uid) return [];

  const ref = collection(db, "users", uid, "history");
  const q = query(ref, orderBy("watchedAt", "desc"), limit(limitCount));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    ...(d.data() as WatchHistoryEntry),
    tmdbId: Number(d.id),
  }));
}

export async function removeFromHistory(tmdbId: number): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) return;

  const ref = doc(db, "users", uid, "history", String(tmdbId));
  await deleteDoc(ref);
}

export async function getWatchEntry(
  tmdbId: number,
): Promise<{ progress: number; resumeSeconds?: number } | null> {
  const uid = auth.currentUser?.uid;
  if (!uid) return null;

  const ref = doc(db, "users", uid, "history", String(tmdbId));
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as { progress: number; resumeSeconds?: number };
}

export async function clearWatchHistory(): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) return;

  const ref = collection(db, "users", uid, "history");
  const snap = await getDocs(ref);
  const batch = writeBatch(db);
  snap.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
}
