import { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useDetail } from "../../hooks/useDetail";
import { useVideos } from "../../hooks/useVideos";
import { useCredits } from "../../hooks/useCredits";
import { useSimilar } from "../../hooks/useSimilar";
import { useRecommendations } from "../../hooks/useRecommendations";
import { imageUrl } from "../../lib/tmdb";
import { isUnreleased } from "../../lib/releaseStatus";
import { updateWatchProgress } from "../../services/apiWatchHistory";
import { updateBookmark } from "../../services/apiUpdateBookmark";
import { getBookmark } from "../../services/apiBookmark";
import {
  getReminder,
  setReminder,
  removeReminder,
} from "../../services/apiReminders";
import { useCertification } from "../../hooks/useCertification";
import { useRecentlyViewed } from "../../hooks/useRecentlyViewed";
import { useRating } from "../../hooks/useRating";
import { getWatchEntry } from "../../services/apiWatchHistory";
import MovieCard from "../../ui/MovieCard";
import SeasonDropdown from "../../ui/SeasonDropdown";
import Spinner from "../../ui/Spinner";
import CastRow from "./CastRow";
import EpisodeList from "./EpisodeList";
import StarRating from "./StarRating";
import CustomVideoPlayer from "../../ui/CustomVideoPlayer";
import CustomPlayer from "../../ui/CustomPlayer";
import StaggerContainer, { cardVariants } from "../../ui/StaggerContainer";

function DetailPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const location = useLocation();
  const mediaType = location.pathname.startsWith("/movie") ? "movie" : "tv";
  const tmdbId = Number(id);

  const { data: detail, isPending } = useDetail(tmdbId, mediaType);
  const { trailer } = useVideos(tmdbId, mediaType);
  const { cast } = useCredits(tmdbId, mediaType);
  const { similar } = useSimilar(tmdbId, mediaType);
  const { recommendations } = useRecommendations(tmdbId, mediaType);
  const { certification } = useCertification(tmdbId);
  const { add: addRecentlyViewed } = useRecentlyViewed();
  const {
    rating: userRating,
    setRating: setUserRating,
    removeRating: removeUserRating,
    isPending: ratingPending,
  } = useRating(tmdbId);
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);

  useEffect(() => {
    if (!tmdbId || !detail) return;
    addRecentlyViewed({
      tmdbId,
      title: detail.title || detail.name || "",
      mediaType: mediaType === "movie" ? "movie" : "tv",
      posterPath: detail.poster_path,
    });
  }, [tmdbId, detail, mediaType, addRecentlyViewed]);

  useEffect(() => {
    if (!tmdbId) return;
    getWatchEntry(tmdbId).then((entry) => {
      setWatchEntry(entry);
    });
  }, [tmdbId]);

  useEffect(() => {
    if (!tmdbId) return;
    getWatchEntry(tmdbId).then((entry) => {
      setDemoWatchEntry(entry);
    });
  }, [tmdbId]);

  const DEMO_SOURCES: Record<number, string> = {
    10378: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    45745: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    133701: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  };

  const [mode, setMode] = useState<"hero" | "watch">(
    searchParams.get("play") === "1" ? "watch" : "hero",
  );
  const [season, setSeason] = useState(
    Number(searchParams.get("season")) || 1,
  );
  const [episode, setEpisode] = useState(
    Number(searchParams.get("episode")) || 1,
  );
  const [muted, setMuted] = useState(false);
  const trailerIframeRef = useRef<HTMLIFrameElement>(null);
  const [isReminded, setIsReminded] = useState(false);
  const [isLoadingReminder, setIsLoadingReminder] = useState(false);
  const [watchEntry, setWatchEntry] = useState<{ progress: number } | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [demoWatchEntry, setDemoWatchEntry] = useState<{ progress: number; resumeSeconds?: number } | null>(null);
  const queryClient = useQueryClient();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkPending, setBookmarkPending] = useState(false);
  const [trailerReady, setTrailerReady] = useState(false);
  const watched = watchEntry?.progress === 100;

  useEffect(() => {
    if (!tmdbId) return;
    getReminder(tmdbId).then((r) => setIsReminded(!!r));
  }, [tmdbId]);

  useEffect(() => {
    if (!tmdbId) return;
    getBookmark()
      .then((items) => {
        setIsBookmarked(items.some((item) => item.id === tmdbId));
      })
      .catch(() => setIsBookmarked(false));
  }, [tmdbId]);

  const toggleBookmark = async () => {
    if (bookmarkPending) return;
    setBookmarkPending(true);
    const newValue = !isBookmarked;
    setIsBookmarked(newValue);
    try {
      await updateBookmark({ newValue, id: tmdbId });
      queryClient.invalidateQueries({ queryKey: ["bookmarkedIds"] });
      queryClient.invalidateQueries({ queryKey: ["bookmarkedMovies"] });
      toast.success(
        newValue
          ? `${title} has been added to bookmarks`
          : `${title} has been removed from bookmarks`,
        { style: { fontSize: "0.875rem", textAlign: "center" } },
      );
    } catch {
      setIsBookmarked(!newValue);
      toast.error("Failed to update bookmark");
    } finally {
      setBookmarkPending(false);
    }
  };

  const handleToggleReminder = async () => {
    if (isLoadingReminder) return;
    setIsLoadingReminder(true);
    try {
      if (isReminded) {
        await removeReminder(tmdbId);
        setIsReminded(false);
      } else {
        await setReminder({
          tmdbId,
          title,
          mediaType,
          releaseDate: detail?.release_date || detail?.first_air_date || "",
          posterPath: detail?.poster_path ?? null,
          createdAt: Date.now(),
        });
        setIsReminded(true);
      }
    } catch {
      // silently fail
    } finally {
      setIsLoadingReminder(false);
    }
  };

  const trailerKey = trailer?.key;
  const backdropImage = detail?.backdrop_path
    ? imageUrl(detail.backdrop_path, "original")
    : "";

  const heroVideoUrl =
    trailerKey && mode === "hero"
      ? `https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&loop=1&controls=0&playlist=${trailerKey}&rel=0&showinfo=0&modestbranding=1&iv_load_policy=3&enablejsapi=1`
      : null;

  useEffect(() => {
    setTrailerReady(false);
  }, [heroVideoUrl]);

  useEffect(() => {
    if (!trailerIframeRef.current?.contentWindow) return;
    trailerIframeRef.current.contentWindow.postMessage(
      JSON.stringify({ event: "command", func: muted ? "mute" : "unMute", args: "" }),
      "https://www.youtube.com",
    );
  }, [muted]);

  const airedSeasons = detail?.seasons?.filter(
    (s) => s.air_date && s.episode_count > 0 && s.season_number > 0,
  ) ?? [];

  const handleSelectEpisode = (ep: { episode_number: number }) => {
    setEpisode(ep.episode_number);
    updateWatchProgress(tmdbId, {
      title,
      category: "tv series",
      posterPath: detail!.poster_path,
      backdropPath: detail!.backdrop_path,
      progress: 1,
      season,
      episode: ep.episode_number,
    });
    setWatchEntry({ progress: 1 });
    setMode("watch");
  };

  if (isPending) return <Spinner />;
  if (!detail)
    return (
      <div className="flex h-screen items-center justify-center text-white">
        {t("detail.notFound")}
      </div>
    );

  const title = detail.title || detail.name || "";
  const year = (detail.release_date || detail.first_air_date || "").slice(0, 4);
  const releaseDate = detail.release_date || detail.first_air_date || "";
  const unreleased =
    mediaType === "tv"
      ? !airedSeasons.some((s) => s.season_number === season)
      : isUnreleased(detail.status, releaseDate);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="fixed inset-0 z-10 h-screen bg-darkBlue">
        <img
          src={backdropImage}
          alt={title}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            trailerReady ? "opacity-0" : "opacity-100"
          }`}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />

        {heroVideoUrl && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <iframe
              ref={trailerIframeRef}
              className={`absolute left-1/2 top-0 -translate-x-1/2 md:top-1/2 md:-translate-y-1/2 h-[56.25vw] min-h-[100vh] w-[100vw] min-w-[177.77vh] transition-opacity duration-700 ${
                trailerReady ? "opacity-100" : "opacity-0"
              }`}
              src={heroVideoUrl}
              title={title}
              allow="autoplay"
              onLoad={() => {
                setTrailerReady(true);
                setTimeout(() => {
                  trailerIframeRef.current?.contentWindow?.postMessage(
                    JSON.stringify({ event: "command", func: "unMute", args: "" }),
                    "https://www.youtube.com",
                  );
                }, 500);
              }}
            />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-darkBlue via-darkBlue/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-darkBlue/50 to-transparent" />

        <button
          onClick={() => navigate(-1)}
          className="absolute left-6 top-6 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70"
          aria-label={t("detail.back")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="relative z-10 flex h-full flex-col justify-end max-md:justify-start p-6 pb-[10vh] md:p-12 max-md:pt-[30vh] max-md:overflow-y-auto">
          <h1 className="text-4xl font-bold md:text-6xl">{title}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/80">
            <span className="rounded bg-yellow-500 px-2 py-0.5 text-sm font-bold text-black">
              {detail.vote_average?.toFixed(1) || "N/A"}
            </span>
            <span className="rounded bg-white/10 px-2 py-0.5 text-sm font-semibold">{year}</span>
            {certification && (
              <span className="rounded border border-white/20 px-2 py-0.5 text-[11px] font-semibold uppercase">
                {certification}
              </span>
            )}
            {detail.runtime && <span>{detail.runtime} min</span>}
            {detail.number_of_seasons && (
              <span>{detail.number_of_seasons} {t("detail.seasonPrefix").toLowerCase()}s</span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {(detail.genres || []).map((g) => (
              <span
                key={g.id}
                className="rounded-full bg-white/10 px-3 py-1 text-xs md:text-sm"
              >
                {g.name}
              </span>
            ))}
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
            {detail.overview}
          </p>

          {detail.belongs_to_collection && (
            <button
              onClick={() =>
                navigate(
                  `/collection/${detail.belongs_to_collection!.id}?name=${encodeURIComponent(detail.belongs_to_collection!.name)}`,
                )
              }
              className="mt-3 flex items-center gap-2 text-sm text-white/60 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
              {t("detail.partOf")}
              <span className="font-medium text-red">
                {detail.belongs_to_collection.name}
              </span>
              <span className="text-xs text-white/40">&rarr;</span>
            </button>
          )}

          <CastRow cast={cast} />

          {/* User rating */}
          <div className="mt-4">
            <span className="mr-3 text-xs text-white/50">{t("detail.yourRating")}</span>
            <StarRating
              rating={userRating}
              onRate={(r) =>
                setUserRating({
                  rating: r,
                  title,
                  posterPath: detail.poster_path,
                })
              }
              onRemove={removeUserRating}
              disabled={ratingPending}
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            {unreleased ? (
              <>
                <span className="flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm text-white/60">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {t("detail.comingSoon")}
                </span>
                <button
                  onClick={handleToggleReminder}
                  disabled={isLoadingReminder}
                  className="flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm hover:bg-white/20 disabled:opacity-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill={isReminded ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                  </svg>
                  {isReminded ? t("detail.reminded") : t("detail.remindMe")}
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  updateWatchProgress(tmdbId, {
                    title,
                    category: mediaType === "movie" ? "movie" : "tv series",
                    posterPath: detail.poster_path,
                    backdropPath: detail.backdrop_path,
                    progress: 1,
                    ...(mediaType === "tv" ? { season, episode } : {}),
                  });
                  setWatchEntry({ progress: 1 });
                  setMode("watch");
                }}
                className="flex items-center gap-2 rounded-full bg-red px-6 py-3 hover:bg-red/80"
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
                <span className="text-sm font-medium">
                  {watchEntry && watchEntry.progress > 0 && watchEntry.progress < 100
                    ? t("detail.continueWatching")
                    : t("detail.watchNow")}
                </span>
              </button>
            )}
            {mediaType === "tv" && (
              <SeasonDropdown
                seasons={airedSeasons}
                value={season}
                onChange={(n) => {
                  setSeason(n);
                  setEpisode(1);
                }}
              />
            )}

            {/* Share */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success(t("detail.linkCopied"), {
                  style: { fontSize: "0.875rem", textAlign: "center" },
                });
              }}
              className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-3 text-sm hover:bg-white/20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              {t("detail.share")}
            </button>

            {/* Bookmark */}
            <button
              onClick={toggleBookmark}
              disabled={bookmarkPending}
              className={`flex items-center gap-2 rounded-full px-4 py-3 text-sm ${
                isBookmarked
                  ? "bg-red/20 text-red border border-red/40"
                  : "bg-white/10 text-white hover:bg-white/20 border border-transparent"
              } disabled:opacity-50`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={isBookmarked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              <span className="text-sm font-medium">
                {isBookmarked ? t("detail.bookmarked") : t("detail.bookmark")}
              </span>
            </button>

            {/* Watch Demo */}
            {DEMO_SOURCES[tmdbId] && (
              <button
                onClick={() => setDemoMode(true)}
                className="flex items-center gap-2 rounded-full border border-red/50 px-6 py-3 text-sm text-red hover:bg-red/10"
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
                <span className="text-sm font-medium">{t("detail.watchDemo")}</span>
              </button>
            )}

            {/* Mark as Watched */}
            {!unreleased && (
              <button
                onClick={() => {
                  updateWatchProgress(tmdbId, {
                    title,
                    category: mediaType === "movie" ? "movie" : "tv series",
                    posterPath: detail.poster_path,
                    backdropPath: detail.backdrop_path,
                    progress: 100,
                    ...(mediaType === "tv" ? { season, episode } : {}),
                  });
                  setWatchEntry({ progress: 100 });
                  toast.success(t("detail.markedWatched"), {
                    style: { fontSize: "0.875rem", textAlign: "center" },
                  });
                }}
                className={`flex items-center gap-2 rounded-full px-4 py-3 text-sm ${
                  watched
                    ? "bg-red/20 text-red border border-red/40"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill={watched ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {t("detail.watched")}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="h-screen" />

      <div className="relative z-20 bg-darkBlue">
        {/* Episode Guide */}
        {mediaType === "tv" && (
          <section className="px-6 pb-8 pt-6 md:px-12">
            <h2 className="mb-4 text-xl font-semibold">
              {t("detail.episodesHeading", { season })}
            </h2>
            <EpisodeList
              seriesId={tmdbId}
              seasonNumber={season}
              onSelectEpisode={handleSelectEpisode}
            />
          </section>
        )}

        {/* Similar */}
        {similar.length > 0 && (
          <section className="px-6 pb-8 md:px-12">
            <h2 className="mb-4 text-xl font-semibold">{t("detail.moreLikeThis")}</h2>
            <StaggerContainer className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {similar.map((m) => (
                <motion.div key={m.id} variants={cardVariants}>
                  <MovieCard movie={m} />
                </motion.div>
              ))}
            </StaggerContainer>
          </section>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <section className="px-6 pb-12 md:px-12">
            <h2 className="mb-4 text-xl font-semibold">{t("detail.recommendations")}</h2>
            <StaggerContainer className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {recommendations.map((m) => (
                <motion.div key={m.id} variants={cardVariants}>
                  <MovieCard movie={m} />
                </motion.div>
              ))}
            </StaggerContainer>
          </section>
        )}
      </div>

      {/* Sound toggle */}
      {mode === "hero" && trailerKey && (
        <button
          onClick={() => setMuted((m) => !m)}
          className="fixed bottom-20 right-8 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 lg:bottom-8"
        >
          {muted ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          )}
        </button>
      )}

      {/* Custom Player */}
      {mode === "watch" && (
        <CustomVideoPlayer
          tmdbId={tmdbId}
          mediaType={mediaType}
          season={season}
          episode={episode}
          title={title}
          onClose={() => setMode("hero")}
        />
      )}

      {/* Demo Player */}
      {demoMode && DEMO_SOURCES[tmdbId] && (
        <CustomPlayer
          src={DEMO_SOURCES[tmdbId]}
          poster={backdropImage || undefined}
          resumeAt={
            demoWatchEntry && demoWatchEntry.progress > 0 && demoWatchEntry.progress < 100
              ? demoWatchEntry.resumeSeconds
              : undefined
          }
          title={title}
          onProgress={(currentTime, duration) => {
            if (duration && duration > 0) {
              const pct = Math.min(Math.round((currentTime / duration) * 100), 99);
              updateWatchProgress(tmdbId, {
                title,
                category: mediaType === "movie" ? "movie" : "tv series",
                posterPath: detail.poster_path,
                backdropPath: detail.backdrop_path,
                progress: pct,
                resumeSeconds: Math.round(currentTime),
                ...(mediaType === "tv" ? { season, episode } : {}),
              });
            }
          }}
          onClose={() => setDemoMode(false)}
        />
      )}
    </div>
  );
}

export default DetailPage;

