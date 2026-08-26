import type { Offer } from "@/types/movie";

export function groupOffers(offers: Offer[]) {
  const seen = new Set<string>();
  const unique: Offer[] = [];

  for (const o of offers) {
    const key = `${o.platform}-${o.type}`;
    if (seen.has(key)) continue;

    seen.add(key);
    unique.push(o);
  }

  return {
    subscription: unique.filter(o => o.type === "subscription"),
    rent: unique.filter(o => o.type === "rent"),
    buy: unique.filter(o => o.type === "buy"),
  };
}