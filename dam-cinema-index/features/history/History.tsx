import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getWatchHistory, removeFromHistory } from "../../services/apiWatchHistory";
import Heading from "../../ui/Heading";
import Spinner from "../../ui/Spinner";
import { imageUrl } from "../../lib/tmdb";
import { Link } from "react-router-dom";

function History() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: entries, isPending } = useQuery({
    queryKey: ["watchHistory"],
    queryFn: () => getWatchHistory(),
  });

  const handleRemove = async (tmdbId: number) => {
    await removeFromHistory(tmdbId);
    queryClient.invalidateQueries({ queryKey: ["watchHistory"] });
  };

  return (
    <div className="h-screen">
      <Heading>{t("history.heading")}</Heading>

      {isPending && <Spinner />}

      {!isPending && (!entries || entries.length === 0) && (
        <p className="mt-8 text-center text-grayishBlue">
          {t("history.empty")}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {entries?.map((entry) => (
          <div
            key={entry.tmdbId}
            className="flex items-center gap-4 rounded-lg bg-semiDarkBlue p-3"
          >
            <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded">
              <img
                src={
                  entry.posterPath
                    ? imageUrl(entry.posterPath, "w185")
                    : ""
                }
                alt={entry.title}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='64' viewBox='0 0 48 64'%3E%3Crect fill='%235A698F' width='48' height='64'/%3E%3C/svg%3E";
                }}
              />
            </div>

            <div className="min-w-0 flex-1">
              <Link
                to={`/${entry.category === "movie" ? "movie" : "tv"}/${entry.tmdbId}`}
                className="font-medium hover:text-red"
              >
                {entry.title}
              </Link>
              {entry.season && (
                <p className="text-xs text-grayishBlue">
                  S{entry.season} E{entry.episode}
                </p>
              )}
              <p className="text-xs text-grayishBlue">
                {entry.category === "movie" ? t("history.movieLabel") : t("history.seriesLabel")}
              </p>
            </div>

            <button
              onClick={() => handleRemove(entry.tmdbId)}
              className="flex-shrink-0 text-grayishBlue hover:text-red"
              title={t("history.removeTitle")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;
