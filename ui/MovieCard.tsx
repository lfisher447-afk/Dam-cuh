import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useBookmark } from "../hooks/useBookmark";
import { useBookmarkedIds } from "../hooks/useBookmarkedIds";
import { usePrefetchDetail } from "../hooks/usePrefetchDetail";
import type { MoviesProps } from "types";
import Playicon from "./Playicon";
import SpinnerMini from "./SpinnerMini";
import QuickViewPopover from "./QuickViewPopover";

function MovieCard({ movie }: MoviesProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { prefetchVideos } = usePrefetchDetail();
  const bookmarkedIds = useBookmarkedIds();
  const movieWithStatus = { ...movie, isBookmarked: bookmarkedIds.has(movie.id) };
  const { bookmarked, isPending, handleClick } = useBookmark(movieWithStatus);
  const { title, year, category, rating, thumbnail } = movie;
  const { regular } = thumbnail;

  const isHoverDevice = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(hover: hover)").matches,
  ).current;

  const [isHovered, setIsHovered] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const mediaType = category === "tv series" ? "tv" : "movie";
  const route =
    mediaType === "tv" ? `/tv/${movie.id}` : `/movie/${movie.id}`;

  const goToDetail = () => {
    prefetchVideos(movie.id, mediaType);
    navigate(route);
  };

  const handleMouseEnter = () => {
    if (!isHoverDevice) return;
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setIsHovered(true), 200);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimer.current);
    setIsHovered(false);
  };

  return (
    <motion.div
      className="relative mb-4 origin-left"
      animate={{ scale: isHovered ? 1.1 : 1 }}
      transition={{
        scale: {
          type: "spring",
          stiffness: 300,
          damping: 25,
        },
      }}
      style={{ zIndex: isHovered ? 50 : 1 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col">
        <div
          onClick={goToDetail}
          style={{
            backgroundImage: regular.large && `url(${isHovered ? regular.medium : regular.large})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
          className="group relative z-10 aspect-[16/9] w-full rounded-lg bg-cover bg-no-repeat md:cursor-pointer"
        >
          <div className="absolute inset-0 z-0 bg-black opacity-0 transition duration-300 group-hover:opacity-50"></div>

          <div className="z-20">
            <Playicon
              onClick={(e) => {
                e.stopPropagation();
                goToDetail();
              }}
              className="transition duration-300 md:flex md:group-hover:flex"
            />
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            className="absolute right-0 z-20 mr-[0.5rem] mt-[0.5rem] h-8 w-8 rounded-[2rem] bg-darkBlue opacity-[0.5006] md:mr-6"
          >
            {isPending ? (
              <div className="m-auto flex h-full items-center justify-center">
                <SpinnerMini />
              </div>
            ) : (
              <img
                src={
                  bookmarked
                    ? "/assets/icon-bookmark-full.svg"
                    : "/assets/icon-bookmark-empty.svg"
                }
                alt={t("movieCard.bookmarkAlt")}
                className="m-auto flex items-center justify-center py-[0.56rem]"
              />
            )}
          </div>
        </div>

        <div className="mt-2 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <p className="text-[0.875rem] font-normal text-white lg:text-2xl">
              {title}
            </p>
            <span className="rounded bg-white/10 px-2 py-0.5 text-xs font-semibold text-white/80">
              {year}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-normal text-white opacity-80 lg:text-[0.9375rem]">
            <p className="flex items-center gap-[0.38rem]">
              <span>
                <img
                  src={
                    category === "movie"
                      ? "/assets/icon-category-movies.svg"
                      : "/assets/icon-category-tv.svg"
                  }
                  alt={t("movieCard.categoryAlt", { category })}
                />
              </span>
              <span>{category}</span>
            </p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="3"
              height="3"
              viewBox="0 0 3 3"
              fill="none"
            >
              <circle opacity="0.5" cx="1.5" cy="1.5" r="1.5" fill="white" />
            </svg>
            <p>{rating}</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute left-0 right-0 z-50 pt-2"
            style={{ top: "100%" }}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <QuickViewPopover movie={movie} inline />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default MovieCard;
