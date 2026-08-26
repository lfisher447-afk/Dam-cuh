import { auth, db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export async function detectCountry(): Promise<string | null> {
  try {
    const res = await fetch("https://ipinfo.io/json");
    if (!res.ok) return null;
    const data = await res.json();
    return data.country || null;
  } catch {
    return null;
  }
}

export async function trackUserCountry(): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;
  const country = await detectCountry();
  const ref = doc(db, "users", user.uid);
  await setDoc(
    ref,
    {
      email: user.email || "unknown",
      country: country || "Unknown",
      createdAt: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
    },
    { merge: true },
  );
}
