import "swiper/css";
import "swiper/css/free-mode";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Mousewheel } from "swiper/modules";
import { useTrendingMovies } from "../../hooks/useTrendingMovie";
import TrendingMovieCard from "./TrendingMovieCard";

function TrendingMovie() {
  const { trendingMovies, isPending } = useTrendingMovies();

  if (isPending) return <p className="text-white">Loading...</p>;

  return (
    <Swiper
      modules={[Autoplay, FreeMode, Mousewheel]}
      spaceBetween={32}
      grabCursor
      mousewheel={{ forceToAxis: true }}
      loop
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      breakpoints={{
        320: { slidesPerView: 1.2, spaceBetween: 6 },
        640: { slidesPerView: 2.2, spaceBetween: 12 },
      }}
    >
      {trendingMovies?.map((movie, i) => (
        <SwiperSlide key={movie.id}>
          <TrendingMovieCard movie={movie} index={i} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default TrendingMovie;
