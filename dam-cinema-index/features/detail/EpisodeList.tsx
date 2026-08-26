import { imageUrl } from "../../lib/tmdb";
import { useSeasonDetails } from "../../hooks/useSeasonDetails";
import type { TMDBEpisode } from "types";
import i18n from "../../lib/i18n/config";

type EpisodeListProps = {
  seriesId: number;
  seasonNumber: number;
  onSelectEpisode: (episode: TMDBEpisode) => void;
};

function EpisodeSkeleton() {
  return (
    <div className="animate-pulse rounded-lg bg-white/5 p-3">
      <div className="aspect-video w-full rounded-md bg-white/10" />
      <div className="mt-3 h-4 w-3/4 rounded bg-white/10" />
      <div className="mt-2 h-3 w-1/3 rounded bg-white/10" />
      <div className="mt-2 h-3 w-full rounded bg-white/10" />
      <div className="mt-1 h-3 w-2/3 rounded bg-white/10" />
    </div>
  );
}

function EpisodeList({ seriesId, seasonNumber, onSelectEpisode }: EpisodeListProps) {
  const { season, isPending } = useSeasonDetails(seriesId, seasonNumber);

  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <EpisodeSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!season || !season.episodes?.length) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {season.episodes.map((ep) => (
        <button
          key={ep.id}
          onClick={() => onSelectEpisode(ep)}
          className="group cursor-pointer rounded-lg bg-white/5 text-left transition hover:bg-white/10"
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
            {ep.still_path ? (
              <img
                src={imageUrl(ep.still_path, "w300")}
                alt={ep.name}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : null}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-darkBlue/80 to-darkBlue/60">
              <span className="text-2xl font-bold text-white/40">
                {ep.episode_number}
              </span>
            </div>
            <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-[11px] font-semibold">
              Ep. {ep.episode_number}
            </span>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="white"
                className="drop-shadow-lg"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          <div className="p-3">
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-semibold leading-tight">{ep.name}</h4>
              {ep.air_date && (
                <span className="shrink-0 text-[11px] text-white/40">
                  {new Date(ep.air_date).toLocaleDateString(i18n.language, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>
            {ep.overview && (
              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-white/50">
                {ep.overview}
              </p>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

export default EpisodeList;
