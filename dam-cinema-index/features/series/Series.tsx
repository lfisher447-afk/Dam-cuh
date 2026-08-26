import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useSeries } from "../../hooks/useSeries";
import { useGenres } from "../../hooks/useGenres";
import MovieCard from "../../ui/MovieCard";
import Heading from "../../ui/Heading";
import Spinner from "../../ui/Spinner";
import MovieCardSkeleton from "../../ui/skeletons/MovieCardSkeleton";
import StaggerContainer, { cardVariants } from "../../ui/StaggerContainer";

function Series() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [genreFilter, setGenreFilter] = useState<number | null>(null);
  const { tvGenres } = useGenres();

  const {
    series,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSeries(query, genreFilter ?? undefined);

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 },
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="h-screen">
      {isPending && !series.length && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!query && (
        <Heading>{t("series.heading")}</Heading>
      )}

      <Heading>
        {query ? t("series.searchResults", { count: series.length, query }) : ""}
      </Heading>

      {!query && tvGenres.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setGenreFilter(null)}
            className={`rounded-full px-3 py-1 text-sm transition-colors ${
              genreFilter === null
                ? "bg-red text-white"
                : "bg-semiDarkBlue text-white hover:bg-white/20"
            }`}
          >
            {t("series.filterAll")}
          </button>
          {tvGenres.map((g) => (
            <button
              key={g.id}
              onClick={() => setGenreFilter(g.id)}
              className={`rounded-full px-3 py-1 text-sm transition-colors ${
                genreFilter === g.id
                  ? "bg-red text-white"
                  : "bg-semiDarkBlue text-white hover:bg-white/20"
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={`${genreFilter ?? "all"}-${query}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {!isPending && series.length === 0 && <p>{t("series.noResults")}</p>}

          <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {series.map((serie) => (
              <motion.div key={serie.id} variants={cardVariants}>
                <MovieCard movie={serie} />
              </motion.div>
            ))}
          </StaggerContainer>
        </motion.div>
      </AnimatePresence>

      {hasNextPage && (
        <div ref={sentinelRef} className="flex justify-center py-8">
          {isFetchingNextPage && <Spinner />}
        </div>
      )}
    </div>
  );
}

export default Series;
