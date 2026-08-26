import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { getCollection } from "../../services/apiCollections";
import { imageUrl } from "../../lib/tmdb";
import type { Movie, TMDBMovieResult } from "types";
import Heading from "../../ui/Heading";
import MovieCard from "../../ui/MovieCard";
import Spinner from "../../ui/Spinner";
import StaggerContainer, { cardVariants } from "../../ui/StaggerContainer";

function mapToMovie(item: TMDBMovieResult): Movie {
  return {
    id: item.id,
    title: item.title || item.name || "",
    year: (item.release_date || item.first_air_date || "").slice(0, 4),
    category: item.title ? ("movie" as const) : ("tv series" as const),
    rating: item.vote_average ? item.vote_average.toFixed(1) : "N/A",
    thumbnail: {
      regular: {
        small: imageUrl(item.poster_path, "w185"),
        medium: imageUrl(item.poster_path, "w342"),
        large:
          imageUrl(item.backdrop_path || item.poster_path, "w1280") ||
          imageUrl(item.poster_path, "w500"),
      },
    },
    isBookmarked: false,
  };
}

function CollectionPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name") || "Collection";
  const collectionId = Number(id);

  const { data: collection, isPending } = useQuery({
    queryKey: ["collection", collectionId],
    queryFn: () => getCollection(collectionId),
    enabled: !!collectionId,
  });

  if (isPending) return <Spinner />;
  if (!collection)
    return (
      <div className="flex h-screen items-center justify-center text-white">
        {t("collection.notFound")}
      </div>
    );

  const movies = (collection.parts || []).map(mapToMovie);

  return (
    <div className="px-6 pb-12 pt-6 md:px-12">
      {/* Header */}
      <div
        className="relative mb-8 flex h-48 items-end rounded-xl bg-cover bg-center sm:h-64"
        style={{
          backgroundImage: collection.backdrop_path
            ? `url(${imageUrl(collection.backdrop_path, "w1280")})`
            : undefined,
        }}
      >
        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-darkBlue to-transparent" />
        <div className="relative z-10 p-6">
          <Heading>{collection.name}</Heading>
          {collection.overview && (
            <p className="mt-2 max-w-2xl text-sm text-white/60 line-clamp-2">
              {collection.overview}
            </p>
          )}
          <p className="mt-1 text-xs text-white/40">
            {t("collection.resultCount", { count: collection.parts.length })}
          </p>
        </div>
      </div>

      {/* Movies grid */}
      <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {movies.map((movie) => (
          <motion.div key={movie.id} variants={cardVariants}>
            <MovieCard movie={movie} />
          </motion.div>
        ))}
      </StaggerContainer>
    </div>
  );
}

export default CollectionPage;
