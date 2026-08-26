import { useSelector } from "react-redux";
import useTrailer from "../hooks/useTrailer";
import TrailerVideoShimmer from "../shimmer/TrailerVideoShimmer";

const VideoBackground = ({ movieId }) => {
  useTrailer(movieId);
  const data = useSelector((store) => store.movies.trailer);

  if (!data) {
    return <TrailerVideoShimmer />;
  }
  return (
    <div className=" relative  ">
      <iframe
        className="w-full aspect-video pointer-events-none"
        src={`https://www.youtube.com/embed/${data.key}?autoplay=1&mute=1&controls=0&loop=1&playlist=${data.key}&cc_load_policy=0`}
        title="Trailer"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default VideoBackground;
