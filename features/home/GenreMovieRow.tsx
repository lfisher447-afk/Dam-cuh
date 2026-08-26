import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import { useGenreMovies } from "../../hooks/useGenreMovies";
import Heading from "../../ui/Heading";
import MovieCard from "../../ui/MovieCard";

type Props = {
  genreId: number;
  genreName: string;
};

function GenreMovieRow({ genreId, genreName }: Props) {
  const { movies, isPending } = useGenreMovies(genreId);

  if (isPending || movies.length === 0) return null;

  return (
    <div className="pb-6">
      <Heading>{genreName}</Heading>
      <Swiper
        modules={[FreeMode, Mousewheel]}
        spaceBetween={16}
        freeMode
        grabCursor
        mousewheel={{ forceToAxis: true }}
        className="-my-2 py-2"
        breakpoints={{
          320: { slidesPerView: 1.5, spaceBetween: 8, slidesOffsetAfter: 16 },
          640: { slidesPerView: 2.5, spaceBetween: 16, slidesOffsetAfter: 32 },
          1024: { slidesPerView: 3.5, spaceBetween: 16, slidesOffsetAfter: 32 },
        }}
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <MovieCard movie={movie} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default GenreMovieRow;
