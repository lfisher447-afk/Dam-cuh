import { db, auth } from "../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export type UserPreferences = {
  preferredGenres: number[];
  preferredLanguage: string;
};

const defaults: UserPreferences = {
  preferredGenres: [],
  preferredLanguage: "en",
};

export async function getUserPreferences(): Promise<UserPreferences> {
  const uid = auth.currentUser?.uid;
  if (!uid) return defaults;

  const ref = doc(db, "users", uid, "preferences", "settings");
  const snap = await getDoc(ref);
  if (!snap.exists()) return defaults;

  return { ...defaults, ...snap.data() } as UserPreferences;
}

export async function updateUserPreferences(
  data: Partial<UserPreferences>,
): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) return;

  const ref = doc(db, "users", uid, "preferences", "settings");
  await setDoc(ref, data, { merge: true });
}
