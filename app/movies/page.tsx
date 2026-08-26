import { Clapperboard } from "lucide-react";
/* Cinema Index page: editorial movie rails with dark graphite space and Projection Amber interaction cues. */
import { Separator } from "@/components/ui/separator";
import Carousel from "@/components/MediaRail";
import LazyCarousel from "@/components/LazyCarousel";
import {
  getMoviesByGenre,
  getNowPlaying,
  getPopular,
  getTopRated,
  getTrending,
  getUpcoming,
  movieToMedia,
} from "@/lib/tmdb";

export const revalidate = 3600;

export default async function MoviesPage() {
  const [
    trending,
    popular,
    topRated,
    nowPlaying,
    upcoming,
    action,
    comedy,
    drama,
    horror,
    scifi,
  ] = await Promise.all([
    getTrending(),
    getPopular(),
    getTopRated(),
    getNowPlaying(),
    getUpcoming(),
    getMoviesByGenre(28),
    getMoviesByGenre(35),
    getMoviesByGenre(18),
    getMoviesByGenre(27),
    getMoviesByGenre(878),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 pb-16 pt-24 sm:pt-28">
      <header className="px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Clapperboard className="h-7 w-7 text-accent-red sm:h-8 sm:w-8" />
          <h1
            className="text-2xl font-bold tracking-tight sm:text-3xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Movies
          </h1>
        </div>
        <Separator className="mt-5 bg-white/10" />
      </header>

      <Carousel
        title="Trending Movies"
        items={(Array.isArray(trending) ? trending : []).map(movieToMedia)}
        priority
      />
      <LazyCarousel title="Popular Movies" items={(Array.isArray(popular) ? popular : []).map(movieToMedia)} />
      <LazyCarousel title="Top Rated Movies" items={(Array.isArray(topRated) ? topRated : []).map(movieToMedia)} />
      <LazyCarousel title="Now Playing" items={(Array.isArray(nowPlaying) ? nowPlaying : []).map(movieToMedia)} />
      <LazyCarousel title="Upcoming" items={(Array.isArray(upcoming) ? upcoming : []).map(movieToMedia)} />
      <LazyCarousel title="Action" items={(Array.isArray(action) ? action : []).map(movieToMedia)} />
      <LazyCarousel title="Comedy" items={(Array.isArray(comedy) ? comedy : []).map(movieToMedia)} />
      <LazyCarousel title="Drama" items={(Array.isArray(drama) ? drama : []).map(movieToMedia)} />
      <LazyCarousel title="Horror" items={(Array.isArray(horror) ? horror : []).map(movieToMedia)} />
      <LazyCarousel title="Sci-Fi" items={(Array.isArray(scifi) ? scifi : []).map(movieToMedia)} />
    </div>
  );
}
