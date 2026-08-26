import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { imageUrl } from "../../lib/tmdb";
import { usePrefetchDetail } from "../../hooks/usePrefetchDetail";
import type { WatchHistoryEntry } from "../../services/apiWatchHistory";

type Props = {
  entry: WatchHistoryEntry;
};

function ContinueWatchingCard({ entry }: Props) {
  const navigate = useNavigate();
  const { prefetchVideos } = usePrefetchDetail();
  const mediaType = entry.category === "tv series" ? "tv" : "movie";
  const route =
    mediaType === "tv"
      ? `/tv/${entry.tmdbId}`
      : `/movie/${entry.tmdbId}`;

  const goToDetail = () => {
    prefetchVideos(entry.tmdbId, mediaType);
    const params = new URLSearchParams({ play: "1" });
    if (entry.season) params.set("season", String(entry.season));
    if (entry.episode) params.set("episode", String(entry.episode));
    navigate(`${route}?${params}`);
  };

  const isHoverDevice = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(hover: hover)").matches,
  ).current;

  const [isHovered, setIsHovered] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

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
      onClick={goToDetail}
      className="group relative flex aspect-[16/9] w-full origin-left cursor-pointer flex-col rounded-lg bg-cover bg-no-repeat"
      style={{
        backgroundImage: `url(${imageUrl(entry.backdropPath, "w780")})`,
        zIndex: isHovered ? 50 : 1,
      }}
      animate={{ scale: isHovered ? 1.1 : 1 }}
      transition={{
        scale: {
          type: "spring",
          stiffness: 300,
          damping: 25,
        },
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute inset-0 z-0 rounded-lg bg-black opacity-0 transition duration-300 group-hover:opacity-50" />

      {/* Resume button on hover */}
      {isHovered && (
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red/90 hover:bg-red">
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
        </div>
      )}

      <div className="relative z-20 mt-auto p-4">
        <p className="font-outfit text-sm font-medium text-white lg:text-lg">
          {entry.title}
        </p>
        <p className="mt-1 text-xs text-white/60">
          {entry.category}
          {entry.season && ` - S${entry.season}:E${entry.episode}`}
        </p>
      </div>

      <div className="relative z-20 h-1 w-full bg-white/20">
        <div
          className="h-full bg-red transition-all"
          style={{ width: `${entry.progress}%` }}
        />
      </div>
    </motion.div>
  );
}

export default ContinueWatchingCard;
