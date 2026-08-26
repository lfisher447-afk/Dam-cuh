import { auth, db } from "../lib/firebase";
import {
  collection,
  getDocs,
  getCountFromServer,
  query,
  orderBy,
  limit,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";

export type AdminStats = {
  totalUsers: number;
  totalWatches: number;
  popularContent: { title: string; count: number; category: string }[];
  countryBreakdown: { country: string; count: number }[];
  recentSignups: { uid: string; email: string; createdAt: string; country: string }[];
};

export async function isAdmin(): Promise<boolean> {
  const user = auth.currentUser;
  if (!user) return false;
  const ref = doc(db, "admins", user.uid);
  const snap = await getDoc(ref);
  return snap.exists() && snap.data()?.role === "admin";
}

export async function getTotalUsers(): Promise<number> {
  const snap = await getCountFromServer(collection(db, "users"));
  return snap.data().count;
}

export async function getTotalWatches(): Promise<number> {
  const snap = await getDocs(collection(db, "users"));
  let total = 0;
  for (const userDoc of snap.docs) {
    const historySnap = await getCountFromServer(
      collection(db, "users", userDoc.id, "history"),
    );
    total += historySnap.data().count;
  }
  return total;
}

export async function getPopularContent(limitCount = 10): Promise<{ title: string; count: number; category: string }[]> {
  const snap = await getDocs(collection(db, "users"));
  const titleCount = new Map<string, { count: number; category: string }>();
  for (const userDoc of snap.docs) {
    const historySnap = await getDocs(
      collection(db, "users", userDoc.id, "history"),
    );
    for (const hDoc of historySnap.docs) {
      const data = hDoc.data();
      const key = data.title || "Unknown";
      const existing = titleCount.get(key);
      if (existing) {
        existing.count++;
      } else {
        titleCount.set(key, { count: 1, category: data.category || "movie" });
      }
    }
  }
  return Array.from(titleCount.entries())
    .map(([title, info]) => ({ title, count: info.count, category: info.category }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limitCount);
}

export async function getCountryBreakdown(): Promise<{ country: string; count: number }[]> {
  const snap = await getDocs(collection(db, "users"));
  const countryCount = new Map<string, number>();
  for (const userDoc of snap.docs) {
    const data = userDoc.data();
    const country = data.country || "Unknown";
    countryCount.set(country, (countryCount.get(country) || 0) + 1);
  }
  return Array.from(countryCount.entries())
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getRecentSignups(limitCount = 20): Promise<AdminStats["recentSignups"]> {
  const snap = await getDocs(
    query(collection(db, "users"), orderBy("createdAt", "desc"), limit(limitCount)),
  );
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      uid: d.id,
      email: data.email || "unknown",
      createdAt: data.createdAt
        ? (data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt)).toLocaleDateString()
        : "N/A",
      country: data.country || "Unknown",
    };
  });
}

export async function getAllAdminStats(): Promise<AdminStats> {
  const [totalUsers, popularContent, countryBreakdown, recentSignups] =
    await Promise.all([
      getTotalUsers(),
      getPopularContent(),
      getCountryBreakdown(),
      getRecentSignups(),
    ]);
  const totalWatches = popularContent.reduce((sum, item) => sum + item.count, 0);
  return { totalUsers, totalWatches, popularContent, countryBreakdown, recentSignups };
}
