import { normalizePlatform } from "@/lib/normalizePlatform";
import type { Offer } from "@/types/movie";

export function buildOffers(rawOffers: any[] = []): Offer[] {
  const offers: Offer[] = [];

  const seen = new Set<string>();

  for (const o of rawOffers) {
    const platform = normalizePlatform(o.platform);
    if (!platform) continue;

    const type = o.type?.toLowerCase();

    const normalizedType =
      type === "flatrate" || type === "subscription"
        ? "subscription"
        : type === "rent"
        ? "rent"
        : type === "buy"
        ? "buy"
        : null;

    if (!normalizedType) continue;

    // DEDUPE KEY
    const key = `${platform}-${normalizedType}`;

    if (seen.has(key)) continue;
    seen.add(key);

    offers.push({
      platform,
      type: normalizedType,
      price: o.price ?? null,
    });
  }

  return offers;
}