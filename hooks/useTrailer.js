import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addTrailer } from "../utils/moviesSlice";
import { API_OPTIONS } from "../utils/constants";

const useTrailer = (movieId) => {
  const dispatch = useDispatch();
  const getTrailerVideo = async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
      API_OPTIONS,
    );
    const json = await data.json();

    const filterData = json.results.filter((video) => {
      return video.type == "Trailer";
    });

    const trailer = filterData.length ? filterData[0] : json.results[0];
    dispatch(addTrailer(trailer));
  };

  useEffect(() => {
    getTrailerVideo();
  }, []);
};

export default useTrailer;
