import { useState } from "react";
import Navbar from "../components/Navbar";
import ShimmerNavbar from "../shimmer/ShimmerNavbar";
import { Navigate } from "react-router";
import useFetchUser from "../hooks/useFetchUser";
import useNowPlayingMovies from "../hooks/useNowPlayingMovies";
import MainContainer from "../components/MainContainer";
import BrowseContainer from "../components/BrowseContainer";
import usePopularMovies from "../hooks/usePopularMovies";
import useTopRatedMovies from "../hooks/useTopRatedMovies";
import useUpcomingMovies from "../hooks/useUpcomingMovies";
import { useSelector } from "react-redux";
import GptSearch from "../components/GptSearch";
import MainContainerShimmer from "../shimmer/MainContainerShimmer";
import BrowseContainerShimmer from "../shimmer/BrowseContainerShimmer";

const Browse = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const viewSearch = useSelector((store) => store.gpt.showGptSearch);

  useFetchUser(setUser, setLoading);
  useNowPlayingMovies();
  usePopularMovies();
  useTopRatedMovies();
  useUpcomingMovies();

  if (loading) {
    return (
      <div>
        <ShimmerNavbar />
        <MainContainerShimmer />
        <BrowseContainerShimmer />
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;

  return (
    <div className="bg-black ">
      <Navbar email={user?.email} id={user?.id} username={user?.username} />
      {viewSearch ? (
        <GptSearch />
      ) : (
        <>
          <MainContainer />
          <BrowseContainer />
        </>
      )}
    </div>
  );
};

export default Browse;
