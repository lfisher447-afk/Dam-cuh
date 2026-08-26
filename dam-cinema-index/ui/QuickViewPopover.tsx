import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useMoviePreview } from "../hooks/useMoviePreview";
import { useCertification } from "../hooks/useCertification";
import { useBookmark } from "../hooks/useBookmark";
import { usePrefetchDetail } from "../hooks/usePrefetchDetail";
import type { Movie } from "types";
import SpinnerMini from "./SpinnerMini";

function QuickViewPopover({ movie, inline = false }: { movie: Movie; inline?: boolean }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { prefetchVideos } = usePrefetchDetail();
  const { data: detail, isPending } = useMoviePreview(movie.id, movie.category);
  const { certification } = useCertification(movie.id);
  const { bookmarked, isPending: bmPending, handleClick } = useBookmark(movie);

  const mediaType = movie.category === "tv series" ? "tv" : "movie";
  const route =
    mediaType === "tv"
      ? `/tv/${movie.id}`
      : `/movie/${movie.id}`;

  const goToDetail = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    prefetchVideos(movie.id, mediaType);
    navigate(route);
  };

  if (inline) {
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.2 },
      },
    };

    const itemVariants = {
      hidden: { opacity: 0, y: -8 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
    };

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-2 rounded-lg bg-darkBlue p-3 shadow-2xl"
        onClick={() => goToDetail()}
      >
        {/* Rating, year, certification, category */}
        <motion.div variants={itemVariants} className="flex items-center gap-2 text-xs text-white/70">
          <span className="rounded bg-yellow-500 px-1.5 py-0.5 font-bold text-black">
            {movie.rating}
          </span>
          <span>{movie.year}</span>
          {certification && (
            <span className="rounded border border-white/20 px-1 py-0.5 text-[10px] font-semibold uppercase">
              {certification}
            </span>
          )}
          <span className="capitalize">{movie.category}</span>
        </motion.div>

        {/* Genres */}
        <motion.div variants={itemVariants}>
          {isPending ? (
            <div className="flex gap-1.5">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-5 w-16 animate-pulse rounded-full bg-semiDarkBlue"
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {(detail?.genres ?? []).slice(0, 3).map((g) => (
                <span
                  key={g.id}
                  className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/70"
                >
                  {g.name}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Overview */}
        <motion.p variants={itemVariants} className="text-[11px] leading-relaxed text-white/60 line-clamp-2">
          {isPending ? (
            <>
              <span className="inline-block h-3 w-full animate-pulse rounded bg-semiDarkBlue" />
              <span className="mt-1 inline-block h-3 w-3/4 animate-pulse rounded bg-semiDarkBlue" />
            </>
          ) : (
            detail?.overview ?? "No overview available."
          )}
        </motion.p>

        {/* Watch button */}
        <motion.div variants={itemVariants}>
          <button
            onClick={(e) => {
              goToDetail(e);
            }}
            className="flex w-full items-center justify-center gap-1.5 rounded-md bg-red py-1.5 text-xs font-medium hover:bg-red/80"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            {t("quickView.watchNow")}
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div
      className="absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[calc(100%+4rem)] max-w-[90vw] min-h-[calc(100%+5rem)] flex flex-col rounded-lg bg-darkBlue shadow-2xl"
      onClick={() => goToDetail()}
    >
      {/* Backdrop */}
      <div
        className="relative h-[200px] flex-shrink-0 bg-cover bg-center"
        style={{
          backgroundImage: movie.thumbnail.regular.large
            ? `url(${movie.thumbnail.regular.large})`
            : undefined,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-darkBlue to-transparent" />

        {/* Bookmark */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          className="absolute right-2 top-2 z-20 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-darkBlue/80"
        >
          {bmPending ? (
            <SpinnerMini />
          ) : (
            <img
              src={
                bookmarked
                  ? "/assets/icon-bookmark-full.svg"
                  : "/assets/icon-bookmark-empty.svg"
              }
              alt={t("quickView.bookmarkAlt")}
              className="h-4 w-4"
            />
          )}
        </div>

        {/* Play overlay */}
        <div
          onClick={(e) => {
            goToDetail(e);
          }}
          className="absolute left-1/2 top-1/2 z-20 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-red/90 hover:bg-red"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>

        {/* Title overlay at bottom of backdrop */}
        <div className="absolute bottom-2 left-3 right-3 z-20">
          <p className="text-sm font-bold text-white line-clamp-1">
            {movie.title}
          </p>
        </div>
      </div>

      {/* Info section */}
      <div className="flex flex-1 flex-col gap-2 px-3 py-2">
        <div className="flex items-center gap-2 text-xs text-white/70">
          <span className="rounded bg-yellow-500 px-1.5 py-0.5 font-bold text-black">
            {movie.rating}
          </span>
          <span>{movie.year}</span>
          {certification && (
            <span className="rounded border border-white/20 px-1 py-0.5 text-[10px] font-semibold uppercase">
              {certification}
            </span>
          )}
          <span className="capitalize">{movie.category}</span>
        </div>

        {/* Genres */}
        {isPending ? (
          <div className="flex gap-1.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-5 w-16 animate-pulse rounded-full bg-semiDarkBlue"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {(detail?.genres ?? []).slice(0, 3).map((g) => (
              <span
                key={g.id}
                className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/70"
              >
                {g.name}
              </span>
            ))}
          </div>
        )}

        {/* Overview */}
        <p className="text-[11px] leading-relaxed text-white/60 line-clamp-2">
          {isPending ? (
            <>
              <span className="inline-block h-3 w-full animate-pulse rounded bg-semiDarkBlue" />
              <span className="mt-1 inline-block h-3 w-3/4 animate-pulse rounded bg-semiDarkBlue" />
            </>
          ) : (
            detail?.overview ?? t("quickView.noOverview")
          )}
        </p>

        {/* Action */}
        <button
          onClick={(e) => {
            goToDetail(e);
          }}
          className="mt-auto flex items-center justify-center gap-1.5 rounded-md bg-red py-1.5 text-xs font-medium hover:bg-red/80"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
          {t("quickView.watchNow")}
        </button>
      </div>
    </div>
  );
}

export default QuickViewPopover;
