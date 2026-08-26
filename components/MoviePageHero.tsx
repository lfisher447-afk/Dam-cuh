"use client";

import { useState } from "react";
import Link from "next/link";
import { Play, Star, ArrowLeft } from "lucide-react";
import WatchModal from "./WatchModal";

interface Props {
  showId: number | string;
  showName: string;
  overview: string;
  backdropPath: string | null;
  logo?: string | null;
  trailerKey?: string | null;
  genres?: ({ id?: number; name: string } | string)[];
  cast?: any[];
  rating?: number;
  year?: string | number;
  runtimeLabel?: string;
  status?: string | null;
  director?: string | null;
  directorId?: number | null;
}

export default function MoviePageHero({
  showId,
  showName,
  backdropPath,
  logo,
  genres = [],
  rating = 0,
  year,
  runtimeLabel,
}: Props) {
  const [showWatchModal, setShowWatchModal] = useState(false);

  const bgUrl = backdropPath
    ? `https://image.tmdb.org/t/p/original${backdropPath}`
    : null;

  return (
    <>
      {showWatchModal && (
        <WatchModal movieId={showId} title={showName} onClose={() => setShowWatchModal(false)} />
      )}
      <div className="relative min-h-[60vh] w-full overflow-hidden bg-black flex items-end">
        {bgUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 blur-xs transition-opacity duration-700"
            style={{ backgroundImage: `url(${bgUrl})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#010101] via-[#010101]/60 to-transparent" />

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-8 pb-12 pt-24 lg:px-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-6 text-sm text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>

          {logo ? (
            <img src={logo} alt={showName} className="max-h-24 max-w-xs object-contain mb-6" />
          ) : (
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-4">
              {showName}
            </h1>
          )}

          <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-300 mb-6">
            {rating > 0 && (
              <span className="flex items-center gap-1 font-bold text-amber-400">
                <Star className="h-4 w-4 fill-amber-400" />
                {rating.toFixed(1)}
              </span>
            )}
            {year && <span>· {year}</span>}
            {runtimeLabel && <span>· {runtimeLabel}</span>}
            {genres.length > 0 && (
              <span>· {genres.map((g) => (typeof g === "string" ? g : g.name)).join(", ")}</span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowWatchModal(true)}
              className="flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-black hover:bg-neutral-200 transition-all active:scale-95"
            >
              <Play className="h-4 w-4 fill-black" /> Watch Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
