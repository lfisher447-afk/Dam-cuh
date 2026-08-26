import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Movie } from "types";
import { useBookmark } from "../../hooks/useBookmark";
import { usePrefetchDetail } from "../../hooks/usePrefetchDetail";
import SpinnerMini from "../../ui/SpinnerMini";
import Playicon from "../../ui/Playicon";

type TrendingMovieCardProps = {
  movie: Movie;
  index: number;
};

function TrendingMovieCard({ movie, index }: TrendingMovieCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { prefetchVideos } = usePrefetchDetail();
  const { bookmarked, handleClick, isPending } = useBookmark(movie);

  const mediaType = movie.category === "tv series" ? "tv" : "movie";
  const route = mediaType === "tv" ? `/tv/${movie.id}` : `/movie/${movie.id}`;

  const goToDetail = () => {
    prefetchVideos(movie.id, mediaType);
    navigate(route);
  };

  return (
    <div
      onClick={goToDetail}
      className="group relative z-10 flex aspect-[16/9] w-full flex-col rounded-lg bg-cover bg-no-repeat md:cursor-pointer"
      style={{
        backgroundImage: `url(${movie.thumbnail.trending?.large})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 z-0 bg-black opacity-0 transition duration-300 group-hover:opacity-50"></div>

      <div className="z-20">
        <Playicon
          onClick={(e) => {
            e.stopPropagation();
            goToDetail();
          }}
          className="transition duration-300 group-hover:flex"
        />
      </div>

      <div className="absolute left-2 top-2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-red/80 text-lg font-bold text-white md:left-4 md:top-4 md:h-12 md:w-12 md:text-2xl">
        {index + 1}
      </div>

      <div
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
        className="absolute right-0 z-20 mr-[0.56rem] mt-[0.5rem] h-8 w-8 rounded-[2rem] bg-darkBlue md:mr-6"
      >
        {isPending ? (
          <div className="m-auto flex h-full items-center justify-center">
            <SpinnerMini />
          </div>
        ) : (
          <img
              src={
                bookmarked
                  ? "/assets/icon-bookmark-full.svg"
                  : "/assets/icon-bookmark-empty.svg"
              }
            alt={t("trendingCard.bookmarkAlt")}
            className="m-auto flex items-center justify-center py-[0.56rem]"
          />
        )}
      </div>

      <div className="relative z-20 mt-auto p-4">
        <div className="flex items-center gap-2">
          <p className="font-outfit text-[0.9375rem] font-normal text-white lg:text-2xl">
            {movie.title}
          </p>
          <span className="rounded bg-white/20 px-2 py-0.5 text-xs font-semibold text-white/90">
            {movie.year}
          </span>
        </div>

        <div className="mt-1 flex items-center gap-2 text-xs font-normal text-white opacity-80 lg:text-[0.9375rem]">
          <p className="flex items-center gap-[0.38rem]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="white"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.9556 0H3.04444C1.36304 0 0 1.36304 0 3.04444V16.9556C0 18.637 1.36304 20 3.04444 20H16.9556C17.763 20 18.5374 19.6792 19.1083 19.1083C19.6792 18.5374 20 17.763 20 16.9556V3.04444C20 2.23701 19.6792 1.46264 19.1083 0.891697C18.5374 0.320753 17.763 0 16.9556 0ZM4 9H2V7H4V9ZM4 11H2V13H4V11ZM18 9H16V7H18V9ZM18 11H16V13H18V11ZM18 2.74V4H16V2H17.26C17.4563 2 17.6445 2.07796 17.7833 2.21674C17.922 2.35552 18 2.54374 18 2.74ZM4 2H2.74C2.54374 2 2.35552 2.07796 2.21674 2.21674C2.07796 2.35552 2 2.54374 2 2.74V4H4V2ZM2 17.26V16H4V18H2.74C2.54374 18 2.35552 17.922 2.21674 17.7833C2.07796 17.6445 2 17.4563 2 17.26ZM17.26 18C17.6687 18 18 17.6687 18 17.26V16H16V18H17.26Z"
              />
            </svg>
            <span>{movie.category}</span>
          </p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="3"
            height="3"
            fill="none"
            viewBox="0 0 3 3"
          >
            <circle opacity="0.5" cx="1.5" cy="1.5" r="1.5" fill="white" />
          </svg>
          <p>{movie.rating}</p>
        </div>
      </div>
    </div>
  );
}

export default TrendingMovieCard;
