import { buildOffers } from "./buildOffers";
import { cleanOffers } from "./cleanOffers";

export function processMovie(rawMovie: any) {
  

  const offers = buildOffers(rawMovie.rawOffers.offers);
  const clean = cleanOffers(offers);

  return {
    id: rawMovie.id,
    title: rawMovie.title,
    year: rawMovie.year,
    poster: rawMovie.poster,
    offers: clean,
    genres: rawMovie.genres,
    offersUnavailable: rawMovie.rawOffers.unavailable,
  };
}