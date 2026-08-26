import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

type CustomVideoPlayerProps = {
  tmdbId: number;
  mediaType: "movie" | "tv";
  season?: number;
  episode?: number;
  title: string;
  onClose: () => void;
};

export default function CustomVideoPlayer({
  tmdbId,
  mediaType,
  season = 1,
  episode = 1,
  title,
  onClose,
}: CustomVideoPlayerProps) {
  const { t } = useTranslation();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  const src = `https://vidsrc.me/embed/${mediaType === "movie" ? "movie" : "tv"}?tmdb=${tmdbId}${mediaType === "tv" ? `&season=${season}&episode=${episode}` : ""}&autoplay=1`;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => {
    if (loaded || iframeError) return;
    const timer = setTimeout(() => setIframeError(true), 15000);
    return () => clearTimeout(timer);
  }, [loaded, iframeError]);

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-black">
      <div className="relative z-20 flex items-center gap-3 bg-gradient-to-b from-black/80 to-transparent px-4 py-3">
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
          aria-label={t("videoPlayer.close")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <span className="truncate text-sm font-medium text-white/80">{title}</span>
      </div>

      <div className="relative flex-1">
        {!loaded && !iframeError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-red" />
          </div>
        )}

        {iframeError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <p className="text-sm text-white/50">{t("videoPlayer.failedToLoad")}</p>
            <button
              onClick={() => { setLoaded(false); setIframeError(false); }}
              className="rounded-full bg-white/10 px-5 py-2 text-sm text-white hover:bg-white/20"
            >
              {t("videoPlayer.retry")}
            </button>
            <button onClick={onClose} className="text-xs text-white/30 hover:text-white/60">
              {t("videoPlayer.close")}
            </button>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={src}
          title={title}
          className={`h-full w-full ${loaded ? "" : "invisible absolute"}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setLoaded(true)}
          onError={() => setIframeError(true)}
        />
      </div>
    </div>
  );
}
