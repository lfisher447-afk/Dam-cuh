import { auth, db } from "../lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

export type UserRating = {
  tmdbId: number;
  rating: number;
  title: string;
  posterPath: string | null;
  createdAt: number;
};

export async function getRating(tmdbId: number): Promise<number | null> {
  const user = auth.currentUser;
  if (!user) return null;
  const ref = doc(db, "users", user.uid, "ratings", String(tmdbId));
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data().rating as number;
}

export async function setRating(
  tmdbId: number,
  rating: number,
  title: string,
  posterPath: string | null,
): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");
  const ref = doc(db, "users", user.uid, "ratings", String(tmdbId));
  await setDoc(ref, {
    tmdbId,
    rating,
    title,
    posterPath,
    createdAt: Date.now(),
  });
}

export async function removeRating(tmdbId: number): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");
  const ref = doc(db, "users", user.uid, "ratings", String(tmdbId));
  await deleteDoc(ref);
}
