export function cleanOffers(offers: any[]) {
  const seen = new Set<string>();

  return offers
    .map((o) => ({
      ...o,
      platform: o.platform ?? "Unknown",
    }))
    .filter((o) => {
      const key = `${o.type}-${o.platform}-${o.price ?? "x"}`;

      if (seen.has(key)) return false;
      seen.add(key);

      return true;
    });
}