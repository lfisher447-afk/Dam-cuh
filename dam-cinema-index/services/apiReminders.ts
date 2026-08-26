import { auth, db } from "../lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
} from "firebase/firestore";

export type Reminder = {
  tmdbId: number;
  title: string;
  mediaType: string;
  releaseDate: string;
  posterPath: string | null;
  createdAt: number;
};

export async function getReminder(tmdbId: number) {
  const user = auth.currentUser;
  if (!user) return null;
  const ref = doc(collection(db, "users", user.uid, "reminders"), String(tmdbId));
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as Reminder;
}

export async function setReminder(data: Reminder) {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");
  const ref = doc(collection(db, "users", user.uid, "reminders"), String(data.tmdbId));
  await setDoc(ref, data);
}

export async function removeReminder(tmdbId: number) {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");
  const ref = doc(collection(db, "users", user.uid, "reminders"), String(tmdbId));
  await deleteDoc(ref);
}
