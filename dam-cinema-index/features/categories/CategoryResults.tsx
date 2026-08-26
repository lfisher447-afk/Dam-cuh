import { useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useMovies } from "../../hooks/useMovies";
import Heading from "../../ui/Heading";
import MovieCard from "../../ui/MovieCard";
import Spinner from "../../ui/Spinner";
import MovieCardSkeleton from "../../ui/skeletons/MovieCardSkeleton";
import StaggerContainer, { cardVariants } from "../../ui/StaggerContainer";

function CategoryResults() {
  const { t } = useTranslation();
  const { genreId } = useParams<{ genreId: string }>();
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name") || "Category";
  const genreFilter = genreId ? Number(genreId) : undefined;

  const {
    movies,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMovies(undefined, genreFilter);

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
    <div className="px-6 pb-12 pt-6 md:px-12">
      <Heading>{name}</Heading>
      <p className="mb-6 text-sm text-white/60">{t("results.resultCount", { count: movies.length })}</p>

      {isPending && !movies.length && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isPending && movies.length === 0 && <p>{t("results.noResults")}</p>}

      <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {movies.map((movie) => (
          <motion.div key={movie.id} variants={cardVariants}>
            <MovieCard movie={movie} />
          </motion.div>
        ))}
      </StaggerContainer>

      {hasNextPage && (
        <div ref={sentinelRef} className="flex justify-center py-8">
          {isFetchingNextPage && <Spinner />}
        </div>
      )}
    </div>
  );
}

export default CategoryResults;
