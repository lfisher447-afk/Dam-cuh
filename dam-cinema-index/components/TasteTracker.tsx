"use client";

import { useEffect } from "react";
import { recordTaste, TASTE_WEIGHT } from "@/lib/taste";

export default function TasteTracker({ item }: { item: any }) {
  useEffect(() => {
    if (item) {
      recordTaste(
        {
          id: item.id,
          title: item.title || item.name,
          genre_ids: item.genre_ids || [],
        },
        TASTE_WEIGHT.DETAILS_OPEN
      );
    }
  }, [item]);

  return null;
}
