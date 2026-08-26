"use client";

import MovieDetailsModal from "./MovieDetailsModal";

interface Props {
  tv?: any;
  show?: any;
  providers?: any[];
  onClose: () => void;
}

export default function TvDetailsModal({ tv, show, providers = [], onClose }: Props) {
  const item = tv || show || {};
  const formattedMovie = {
    ...item,
    id: item.id,
    title: item.name || item.title || "TV Show",
    overview: item.overview || "",
    backdrop_path: item.backdrop_path,
    genre_ids: item.genre_ids || [],
    vote_average: item.vote_average || 0,
    release_date: item.first_air_date || item.release_date || "",
  };

  return <MovieDetailsModal movie={formattedMovie} providers={providers} onClose={onClose} />;
}
