import MovieList from "./MovieList";
import { useSelector } from "react-redux";

const BrowseContainer = () => {
  const movies = useSelector((store) => store.movies);
  if (!movies) return null;
  return (
    <div className="py-6 md:-mt-70 md:relative md:z-10 px-3 md:px-5">
      <MovieList title={"Now Playing"} movies={movies.nowPlayingMovies} />
      <MovieList title={"Popular"} movies={movies.popularMovies} />
      <MovieList title={"Top Rated"} movies={movies.topRatedMovies} />
      <MovieList title={"Upcoming"} movies={movies.upcomingMovies} />
    </div>
  );
};

export default BrowseContainer;
