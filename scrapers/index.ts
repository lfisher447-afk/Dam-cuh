// import { scrapeNetflix } from "./netflix";
// import { scrapeAppleTV } from "./appletv";
// import { scrapeGoogleTV } from "./googletv";

// export async function scrapeAll(query: string) {

//   const results = await Promise.all([
//     scrapeNetflix(query),

//     scrapeAppleTV(query),

//     scrapeGoogleTV(query),
//   ]);

//   //console.log("SCRAPER RAW:", results);

//   const flattened = results.flat();

//   //console.log("SCRAPER FLAT:", flattened);

//   return flattened;
// }

import { fetchJustWatchOffers } from "@/lib/justwatch";

export async function scrapeAll(query: string){
  const offers = await fetchJustWatchOffers(query)
  return offers;
}