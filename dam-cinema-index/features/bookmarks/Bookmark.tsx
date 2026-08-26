import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getBookmark } from "../../services/apiBookmark";
import MovieCard from "../../ui/MovieCard";
import Heading from "../../ui/Heading";
import Spinner from "../../ui/Spinner";
import StaggerContainer, { cardVariants } from "../../ui/StaggerContainer";

type Tab = "all" | "movie" | "tv series";

function Bookmark() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [tab, setTab] = useState<Tab>("all");

  const { data: isBookmarked, isPending } = useQuery({
    queryKey: ["bookmarkedMovies"],
    queryFn: getBookmark,
  });

  const normalizedQuery = query.trim().toLowerCase();

  const allBookmarked = isBookmarked || [];

  const displayedMovies = normalizedQuery
    ? allBookmarked.filter((movie) =>
        movie.title.toLowerCase().includes(normalizedQuery),
      )
    : tab === "all"
      ? allBookmarked
      : allBookmarked.filter((m) => m.category === tab);

  const movieCount = allBookmarked.filter((m) => m.category === "movie").length;
  const seriesCount = allBookmarked.filter((m) => m.category === "tv series").length;

  if (isPending) return <Spinner />;

  if (allBookmarked.length === 0 && !query) {
    return (
      <div className="h-screen">
        <Heading>{t("bookmarks.heading")}</Heading>
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <img
            src="/assets/icon-nav-bookmark.svg"
            alt={t("bookmarks.bookmarkAlt")}
            className="h-16 w-16 opacity-30"
          />
          <p className="text-lg text-grayishBlue">{t("bookmarks.emptyTitle")}</p>
          <p className="text-sm text-grayishBlue/60">
            {t("bookmarks.emptyDesc")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      {!query ? (
        <Heading>{t("bookmarks.heading")}</Heading>
      ) : (
        <Heading>{t("bookmarks.searchResults", { count: displayedMovies?.length ?? 0, query })}</Heading>
      )}

      {!query && (
        <div className="mb-6 flex gap-2">
          {[
            { key: "all" as Tab, label: t("bookmarks.tabAll", { count: allBookmarked.length }) },
            { key: "movie" as Tab, label: t("bookmarks.tabMovies", { count: movieCount }) },
            { key: "tv series" as Tab, label: t("bookmarks.tabSeries", { count: seriesCount }) },
          ].map((tabItem) => (
            <button
              key={tabItem.key}
              onClick={() => setTab(tabItem.key)}
              className={`rounded-full px-3 py-1 text-sm transition-colors ${
                tab === tabItem.key
                  ? "bg-red text-white"
                  : "bg-semiDarkBlue text-white hover:bg-white/20"
              }`}
            >
              {tabItem.label}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={`${tab}-${normalizedQuery}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayedMovies.map((bookmarkedMovie) => (
              <motion.div key={bookmarkedMovie.id} variants={cardVariants}>
                <MovieCard movie={bookmarkedMovie} />
              </motion.div>
            ))}
            {displayedMovies.length === 0 && (
              <p className="col-span-full text-center text-grayishBlue">
                {t("bookmarks.emptyFilter", {
                  type: tab === "all" ? t("bookmarks.emptyFilterAll") : tab === "movie" ? t("bookmarks.emptyFilterMovie") : t("bookmarks.emptyFilterSeries"),
                })}
              </p>
            )}
          </StaggerContainer>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default Bookmark;
