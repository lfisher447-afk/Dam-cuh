"use client";

import { X } from "lucide-react";
import Player from "./Player";

interface Props {
  tvId?: number | string;
  showId?: number | string;
  showName?: string;
  season?: number;
  episode?: number;
  title?: string;
  onClose: () => void;
  [key: string]: any;
}

export default function TvWatchModal({ tvId, showId, showName, season = 1, episode = 1, title, onClose }: Props) {
  const actualId = tvId ?? showId ?? 0;
  const actualTitle = title ?? showName ?? "Watch TV Show";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <div className="relative w-full max-w-5xl rounded-2xl bg-neutral-900 overflow-hidden border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <h3 className="font-semibold text-white text-sm">{actualTitle}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="aspect-video w-full">
          <Player type="tv" id={actualId} season={season} episode={episode} />
        </div>
      </div>
    </div>
  );
}
