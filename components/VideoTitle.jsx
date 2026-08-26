import { FaPlay, FaInfoCircle } from "react-icons/fa";

const VideoTitle = ({ title, overview }) => {
  return (
    <div className="absolute bottom-6 left-4 md:bottom-70 md:left-10 text-white">
      <h1 className="text-3xl md:text-6xl font-bold drop-shadow-lg">{title}</h1>

      <p className="mt-3 w-[90%] md:w-[40%] text-sm md:text-lg leading-6 md:leading-7 drop-shadow-md line-clamp-3 md:line-clamp-none">
        {overview}
      </p>

      <div className="mt-4 md:mt-6 flex gap-3 md:gap-4">
        <button className="flex items-center gap-2 rounded-md bg-white px-4 py-2 md:px-8 md:py-3 text-sm md:text-lg font-semibold text-black hover:bg-white/80 transition">
          <FaPlay className="text-xs md:text-sm" />
          Play
        </button>

        <button className="flex items-center gap-2 rounded-md bg-gray-500/70 px-4 py-2 md:px-8 md:py-3 text-sm md:text-lg font-semibold text-white hover:bg-gray-500/50 transition">
          <FaInfoCircle className="text-xs md:text-sm" />
          More Info
        </button>
      </div>
    </div>
  );
};

export default VideoTitle;
