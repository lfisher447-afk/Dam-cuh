/* Cinema Index component: focused, cinematic playback with readable exit controls and restrained chrome. */
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Plyr, { type APITypes, type PlyrOptions } from "plyr-react";
import "plyr-react/plyr.css";

type CustomPlayerProps = {
  src: string;
  poster?: string;
  resumeAt?: number;
  title: string;
  onProgress?: (currentTime: number, duration: number) => void;
  onClose: () => void;
};

const PLAYER_OPTIONS: PlyrOptions = {
  controls: [
    "play-large",
    "rewind",
    "play",
    "fast-forward",
    "progress",
    "current-time",
    "duration",
    "mute",
    "volume",
    "settings",
    "fullscreen",
  ],
  seekTime: 10,
  keyboard: { focused: true, global: false },
  settings: ["quality", "speed"],
};

export default function CustomPlayer({
  src,
  poster,
  resumeAt,
  title,
  onProgress,
  onClose,
}: CustomPlayerProps) {
  const { t } = useTranslation();
  const plyrRef = useRef<APITypes>(null);

  useEffect(() => {
    const player = plyrRef.current?.plyr;
    if (!player) return;

    player.on("timeupdate", () => {
      onProgress?.(player.currentTime, player.duration);
    });
  }, [onProgress]);

  useEffect(() => {
    if (resumeAt == null) return;
    const player = plyrRef.current?.plyr;
    if (!player) return;
    if (player.currentTime > 0) {
      player.currentTime = resumeAt;
    } else {
      player.once("canplay", () => {
        player.currentTime = resumeAt;
      });
    }
  }, [resumeAt]);

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

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-black">
      <div className="relative z-20 flex items-center gap-3 bg-gradient-to-b from-black/80 to-transparent px-4 py-3">
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
          aria-label={t("videoPlayer.close")}
        >
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
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <span className="truncate text-sm font-medium text-white/80">{title}</span>
        <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/50">
          {t("detail.demoQuality")}
        </span>
      </div>
      <div className="relative flex-1">
        <Plyr
          ref={plyrRef}
          source={{
            type: "video",
            sources: [{ src, type: "video/mp4" }],
            poster,
          }}
          options={PLAYER_OPTIONS}
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
