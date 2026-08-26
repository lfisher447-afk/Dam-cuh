export function normalizePlatform(name: string) {
  const key = name.toLowerCase().trim();

  const map: Record<string, string> = {
    // streaming services (real names)
    nfx: "Netflix",
    netflix: "Netflix",

    prv: "Amazon Prime Video",
    amz: "Amazon Prime Video",
    prime: "Amazon Prime Video",

    zee: "Zee5",
    zee5: "Zee5",

    asa: "SonyLIV",
    sony: "SonyLIV",

    vim: "Vimeo",

    pva: "Apple TV",
    itu: "Apple TV",

    lgp: "Lionsgate Play",
    lpa: "Lionsgate Play",
    lga: "Lionsgate Play",
  };

  return map[key] ?? null;
}