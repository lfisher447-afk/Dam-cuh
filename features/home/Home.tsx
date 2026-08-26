import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import { useTranslation } from "react-i18next";
import { useHomeMovies } from "../../hooks/useHomeMovies";
import { useHeroMovies } from "../../hooks/useHeroMovies";
import { useTopRated } from "../../hooks/useTopRated";
import { useContinueWatching } from "../../hooks/useContinueWatching";
import { useUpcoming } from "../../hooks/useUpcoming";
import { useTrendingMovies } from "../../hooks/useTrendingMovie";
import { useGenres } from "../../hooks/useGenres";
import { useRecentlyViewed } from "../../hooks/useRecentlyViewed";
import { useRecommended } from "../../hooks/useRecommended";
import Heading from "../../ui/Heading";
import MovieCard from "../../ui/MovieCard";
import TrendingMovies from "./TrendingMovie";
import ContinueWatchingCard from "./ContinueWatchingCard";
import GenreMovieRow from "./GenreMovieRow";
import HeroSection from "./HeroSection";
import { imageUrl } from "../../lib/tmdb";
import MovieCardSkeleton from "../../ui/skeletons/MovieCardSkeleton";
import TrendingSkeleton from "../../ui/skeletons/TrendingSkeleton";
import HeroSkeleton from "../../ui/skeletons/HeroSkeleton";
import StaggerContainer, { cardVariants } from "../../ui/StaggerContainer";

const POPULAR_GENRES = [28, 12, 35, 18, 10749, 14, 27, 878];

function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { allMovies, isPending, isFetching } = useHomeMovies(query);
  const { heroMovies, isPending: heroPending } = useHeroMovies();
  const { topMovies, isPending: topPending } = useTopRated();
  const { continueWatching, isPending: cwPending } = useContinueWatching();
  const { upcomingMovies, isPending: upPending } = useUpcoming();
  const { movieGenres } = useGenres();
  const { recentlyViewed } = useRecentlyViewed();
  const { recommended, isPending: recPending, hasBookmarks } = useRecommended();
  const { trendingMovies } = useTrendingMovies();

  const handleFeelingLucky = () => {
    if (!trendingMovies?.length) return;
    const pick = trendingMovies[Math.floor(Math.random() * trendingMovies.length)];
    navigate(`/movie/${pick.id}`);
  };

  const genreRows = movieGenres
    .filter((g) => POPULAR_GENRES.includes(g.id))
    .slice(0, 6);

  return (
    <div className="h-screen">
      {!query && (
        <>
          {heroPending ? (
            <HeroSkeleton />
          ) : (
            <HeroSection heroMovies={heroMovies} />
          )}

          {/* Feeling Lucky */}
          <div className="flex justify-end px-6 pb-4 md:px-12">
            <button
              onClick={handleFeelingLucky}
              disabled={!trendingMovies?.length}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-red to-red/70 px-5 py-2 text-sm font-medium text-white shadow-lg transition hover:scale-105 hover:from-red/90 hover:to-red/60 disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {t("home.feelingLucky")}
            </button>
          </div>

          {isPending ? (
            <div className="pb-6 pt-6">
              <Heading>{t("home.trending")}</Heading>
              <TrendingSkeleton />
            </div>
          ) : (
            <div className="pb-6 pt-6">
              <Heading>{t("home.trending")}</Heading>
              <div className="flex">
                <TrendingMovies />
              </div>
            </div>
          )}

          {!cwPending && continueWatching.length > 0 && (
            <div className="pb-6">
              <Heading>{t("home.continueWatching")}</Heading>
              <Swiper
                modules={[FreeMode, Mousewheel]}
                spaceBetween={16}
                freeMode
                grabCursor
                mousewheel={{ forceToAxis: true }}
                className="-my-2 py-2"
                breakpoints={{
                  320: { slidesPerView: 1.5, spaceBetween: 8, slidesOffsetAfter: 16 },
                  640: { slidesPerView: 2.5, spaceBetween: 16, slidesOffsetAfter: 32 },
                  1024: { slidesPerView: 3.5, spaceBetween: 16, slidesOffsetAfter: 32 },
                }}
              >
                {continueWatching.map((entry) => (
                  <SwiperSlide key={entry.tmdbId}>
                    <ContinueWatchingCard entry={entry} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}

          {topPending ? (
            <div className="pb-6">
              <Heading>{t("home.topRated")}</Heading>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <MovieCardSkeleton key={i} />
                ))}
              </div>
            </div>
          ) : topMovies.length > 0 ? (
            <div className="pb-6">
              <Heading>{t("home.topRated")}</Heading>
              <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {topMovies.slice(0, 6).map((m) => (
                  <motion.div key={m.id} variants={cardVariants}>
                    <MovieCard movie={m} />
                  </motion.div>
                ))}
              </StaggerContainer>
            </div>
          ) : null}

          {/* Upcoming */}
          {upPending ? (
            <div className="pb-6">
              <Heading>{t("home.comingSoon")}</Heading>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <MovieCardSkeleton key={i} />
                ))}
              </div>
            </div>
          ) : upcomingMovies.length > 0 ? (
            <div className="pb-6">
              <Heading>{t("home.comingSoon")}</Heading>
              <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingMovies.slice(0, 6).map((m) => (
                  <motion.div key={m.id} variants={cardVariants}>
                    <MovieCard movie={m} />
                  </motion.div>
                ))}
              </StaggerContainer>
            </div>
          ) : null}

          {/* Recently Viewed */}
          {recentlyViewed.length > 0 && (
            <div className="pb-6">
              <Heading>{t("home.recentlyViewed")}</Heading>
              <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recentlyViewed.map((item) => (
                  <motion.div key={item.tmdbId} variants={cardVariants}>
                    <MovieCard
                      movie={{
                        id: item.tmdbId,
                        title: item.title,
                        year: "",
                        category: item.mediaType === "movie" ? "movie" : "tv series",
                        rating: "N/A",
                        thumbnail: {
                          regular: {
                            small: imageUrl(item.posterPath, "w185"),
                            medium: imageUrl(item.posterPath, "w342"),
                            large: imageUrl(item.posterPath, "w500"),
                          },
                        },
                        isBookmarked: false,
                      }}
                    />
                  </motion.div>
                ))}
              </StaggerContainer>
            </div>
          )}

          {/* Recommended For You */}
          {hasBookmarks && !recPending && recommended.length > 0 && (
            <div className="pb-6">
              <Heading>{t("home.recommended")}</Heading>
              <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recommended.slice(0, 6).map((m) => (
                  <motion.div key={m.id} variants={cardVariants}>
                    <MovieCard movie={m} />
                  </motion.div>
                ))}
              </StaggerContainer>
            </div>
          )}

          {genreRows.map((genre) => (
            <GenreMovieRow key={genre.id} genreId={genre.id} genreName={genre.name} />
          ))}
        </>
      )}

      {query && (
        <>
          <Heading>{t("home.searchResults", { count: allMovies?.length ?? 0, query })}</Heading>

          {isFetching && (
            <p className="mb-4 text-sm text-grayishBlue">{t("home.updating")}</p>
          )}

          <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allMovies?.length === 0 && !isPending && <p>{t("home.noResults")}</p>}
            {allMovies
              ?.filter(Boolean)
              .map((movie) => (
                <motion.div key={movie.id} variants={cardVariants}>
                  <MovieCard movie={movie} />
                </motion.div>
              ))}
          </StaggerContainer>
        </>
      )}
    </div>
  );
}

export default Home;
