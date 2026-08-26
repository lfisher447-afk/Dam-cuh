export type Thumbnail = {
  trending?: {
    small: string;
    large: string;
  };
  regular: {
    small: string;
    medium: string;
    large: string;
  };
};

export type Movie = {
  id: number;
  title: string;
  year: string;
  category: string;
  rating: string;
  thumbnail: Thumbnail;
  videoUrl?: string;
  isBookmarked: boolean;
};

export type MoviesProps = {
  movie: Movie;
};

export type HeadingProp = {
  children: React.ReactNode;
};

export type ButtonProp = {
  children: React.ReactNode;
};

export type PlayIconProps = {
  className: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export type AuthProps = {
  email: string;
  password: string;
  confirmPassword?: string;
  message?: string;
};

/* ─────────── TMDB API types ─────────── */

export type TMDBMovieResult = {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  original_language: string;
  popularity: number;
};

export type TMDBPage<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

export type TMDBDetail = {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  genres: { id: number; name: string }[];
  runtime: number | null;
  tagline: string;
  status: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
  seasons?: {
    air_date: string | null;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    season_number: number;
    vote_average: number;
  }[];
  spoken_languages: { english_name: string; iso_639_1: string }[];
  belongs_to_collection?: {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  } | null;
};

export type TMDBVideo = {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
};

export type TMDBVideosResponse = {
  id: number;
  results: TMDBVideo[];
};

export type TMDBCastMember = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  known_for_department: string;
  order: number;
};

export type TMDBCreditsResponse = {
  id: number;
  cast: TMDBCastMember[];
  crew: { id: number; name: string; job: string; department: string }[];
};

export type TMDBGenre = {
  id: number;
  name: string;
};

export type TMDBGenreListResponse = {
  genres: TMDBGenre[];
};

export type TMDBWatchProvider = {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority: number;
};

export type TMDBWatchProvidersResponse = {
  id: number;
  results: {
    US?: {
      flatrate?: TMDBWatchProvider[];
      rent?: TMDBWatchProvider[];
      buy?: TMDBWatchProvider[];
      link: string;
    };
    [country: string]: unknown;
  };
};

export type TMDBEpisode = {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string | null;
  episode_number: number;
  season_number: number;
  runtime: number | null;
  vote_average: number;
  vote_count: number;
};

export type TMDBSeasonDetail = {
  _id: string;
  air_date: string | null;
  name: string;
  overview: string;
  id: number;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
  episodes: TMDBEpisode[];
};

export type TMDBCollection = {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  parts: TMDBMovieResult[];
};
