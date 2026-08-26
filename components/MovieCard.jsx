import { IMG_CDN_URL } from "../utils/constants";

const MovieCard = ({ imgPath }) => {
  return (
    <div className="shrink-0 cursor-pointer transform transition-all duration-300 ease-out hover:scale-110 hover:z-10 hover:shadow-(--shadow-m)">
      {imgPath ? (
        <img className="w-48" src={IMG_CDN_URL + imgPath} alt="Movie poster" />
      ) : (
        <div className="w-48 h-72 bg-zinc-800 flex items-center justify-center text-zinc-400">
          No Poster
        </div>
      )}
    </div>
  );
};

export default MovieCard;
