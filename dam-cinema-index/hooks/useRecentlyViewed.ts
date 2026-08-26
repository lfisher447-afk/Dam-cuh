import { useState, useCallback } from "react";

export type RecentlyViewedItem = {
  tmdbId: number;
  title: string;
  mediaType: "movie" | "tv";
  posterPath: string | null;
  timestamp: number;
};

const STORAGE_KEY = "recentlyViewed";
const MAX_ITEMS = 5;

function read(): RecentlyViewedItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(items: RecentlyViewedItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useRecentlyViewed() {
  const [items, setItems] = useState<RecentlyViewedItem[]>(read);

  const add = useCallback((item: Omit<RecentlyViewedItem, "timestamp">) => {
    setItems((prev) => {
      const filtered = prev.filter((i) => i.tmdbId !== item.tmdbId);
      const updated = [{ ...item, timestamp: Date.now() }, ...filtered].slice(
        0,
        MAX_ITEMS,
      );
      write(updated);
      return updated;
    });
  }, []);

  return { recentlyViewed: items, add };
}
