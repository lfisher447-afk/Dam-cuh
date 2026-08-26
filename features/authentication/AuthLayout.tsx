import { useTrendingMovies } from "../../hooks/useTrendingMovie";
import { useTranslation } from "react-i18next";

const GRID_LAYOUT = [
  "col-span-1 row-span-1",
  "col-span-1 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
];

function AuthLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const { trendingMovies } = useTrendingMovies();
  const images = trendingMovies?.slice(0, 5) ?? [];

  return (
    <div className="flex min-h-screen bg-darkBlue font-outfit">
      {/* Left Banner - hidden on small phones */}
      <div className="relative hidden w-0 overflow-hidden sm:block sm:w-1/2">
        {images.length > 0 && (
          <div className="grid h-full grid-cols-2 grid-rows-3 gap-2 p-2">
            {images.map((movie, i) => (
              <div
                key={movie.id}
                className={`overflow-hidden rounded-lg ${GRID_LAYOUT[i]}`}
              >
                <img
                  src={
                    movie.thumbnail.trending?.large ||
                    movie.thumbnail.regular?.large
                  }
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-darkBlue via-darkBlue/60 to-darkBlue/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-darkBlue/70 via-darkBlue/30 to-transparent" />

        {/* Branding */}
        <div className="absolute bottom-10 left-10">
          <div className="mb-3 flex items-center gap-3">
            <img src="/favicon-32x32.svg" alt="" className="h-8 w-8" />
            <span className="text-2xl font-bold text-white">{t("authLayout.brand")}</span>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-white/60">
            {t("authLayout.tagline")}
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex w-full items-center justify-center sm:w-1/2">
        <div className="w-full px-6 py-10 sm:px-8 sm:py-12 lg:px-10">
          {/* Mobile branding */}
          <div className="mb-8 flex flex-col items-center sm:hidden">
            <div className="mb-2 flex items-center gap-2">
              <img src="/favicon-32x32.svg" alt="" className="h-7 w-7" />
              <span className="text-xl font-bold text-white">{t("authLayout.brand")}</span>
            </div>
            <p className="text-xs text-white/40">
              {t("authLayout.tagline")}
            </p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;

