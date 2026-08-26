import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useWatchProviders } from "../../hooks/useWatchProviders";
import { imageUrl } from "../../lib/tmdb";
import Heading from "../../ui/Heading";
import Spinner from "../../ui/Spinner";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "hi", name: "Hindi" },
  { code: "zh", name: "Chinese" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "ar", name: "Arabic" },
];

const MOODS = [
  { genreId: 28, tKey: "action" },
  { genreId: 35, tKey: "feelGood" },
  { genreId: 27, tKey: "scary" },
  { genreId: 10749, tKey: "romantic" },
  { genreId: 878, tKey: "sciFi" },
  { genreId: 53, tKey: "thrilling" },
  { genreId: 18, tKey: "heartfelt" },
  { genreId: 12, tKey: "epic" },
  { genreId: 9648, tKey: "mysterious" },
  { genreId: 16, tKey: "animated" },
  { genreId: 14, tKey: "fantasy" },
  { genreId: 36, tKey: "historical" },
];

const DECADES = [
  { year: "1980", tKey: "80s" },
  { year: "1990", tKey: "90s" },
  { year: "2000", tKey: "2000s" },
  { year: "2010", tKey: "2010s" },
  { year: "2020", tKey: "2020s" },
];

const GRADIENTS = [
  "from-red-600 to-red-900",
  "from-blue-600 to-blue-900",
  "from-emerald-600 to-emerald-900",
  "from-purple-600 to-purple-900",
  "from-orange-600 to-orange-900",
  "from-pink-600 to-pink-900",
  "from-teal-600 to-teal-900",
  "from-amber-600 to-amber-900",
  "from-indigo-600 to-indigo-900",
  "from-rose-600 to-rose-900",
  "from-cyan-600 to-cyan-900",
  "from-lime-600 to-lime-900",
];

function CategoriesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { providers, isPending: provPending } = useWatchProviders();

  return (
    <div className="px-6 pb-12 pt-6 md:px-12">
      <Heading>{t("categories.heading")}</Heading>

      {/* Moods */}
      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold">{t("categories.moods")}</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {MOODS.map((mood, i) => (
            <button
              key={mood.genreId}
              onClick={() =>
                navigate(
                  `/categories/${mood.genreId}?name=${encodeURIComponent(t(`categories.moodNames.${mood.tKey}`))}`,
                )
              }
              className={`flex aspect-[16/10] w-40 shrink-0 items-end justify-start rounded-xl bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} p-4 text-left text-base font-bold text-white shadow-lg transition-transform hover:scale-105 hover:shadow-xl`}
            >
              <span className="drop-shadow-lg">{t(`categories.moodNames.${mood.tKey}`)}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Decades */}
      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold">{t("categories.decades")}</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {DECADES.map((decade, i) => (
            <button
              key={decade.year}
              onClick={() =>
                navigate(
                  `/browse/decade/${decade.year}?name=${encodeURIComponent(t(`categories.decadeLabels.${decade.tKey}`))}`,
                )
              }
              className={`flex aspect-[16/10] w-40 shrink-0 items-end justify-start rounded-xl bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} p-4 text-left text-base font-bold text-white shadow-lg transition-transform hover:scale-105 hover:shadow-xl`}
            >
              <span className="drop-shadow-lg">{t(`categories.decadeLabels.${decade.tKey}`)}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Languages */}
      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold">{t("categories.languages")}</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {LANGUAGES.map((lang, i) => (
            <button
              key={lang.code}
              onClick={() =>
                navigate(
                  `/browse/language/${lang.code}?name=${encodeURIComponent(t(`categories.languageNames.${lang.code}`))}`,
                )
              }
              className={`flex aspect-[16/10] w-36 shrink-0 items-end justify-start rounded-xl bg-gradient-to-br ${GRADIENTS[(i + 4) % GRADIENTS.length]} p-4 text-left text-base font-bold text-white shadow-lg transition-transform hover:scale-105 hover:shadow-xl`}
            >
              <span className="drop-shadow-lg">{t(`categories.languageNames.${lang.code}`)}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Platforms */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">{t("categories.platforms")}</h2>
        {provPending ? (
          <Spinner />
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {providers.slice(0, 36).map((provider, i) => (
              <button
                key={provider.provider_id}
                onClick={() =>
                  navigate(
                    `/platform/${provider.provider_id}?name=${encodeURIComponent(provider.provider_name)}`,
                  )
                }
                className={`flex w-24 shrink-0 flex-col items-center gap-2 rounded-xl p-4 transition-transform hover:scale-105 hover:shadow-xl bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]}`}
              >
                <div className="h-10 w-10 overflow-hidden rounded-lg sm:h-12 sm:w-12">
                  <img
                    src={imageUrl(provider.logo_path, "w92")}
                    alt={provider.provider_name}
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                </div>
                <span className="text-center text-[10px] font-medium text-white/80 sm:text-xs">
                  {provider.provider_name}
                </span>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default CategoriesPage;
