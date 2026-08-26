import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useWatchProviders } from "../../hooks/useWatchProviders";
import { imageUrl } from "../../lib/tmdb";
import Heading from "../../ui/Heading";
import Spinner from "../../ui/Spinner";

function PlatformsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { providers, isPending } = useWatchProviders();

  if (isPending) return <Spinner />;

  return (
    <div className="px-6 pb-12 pt-6 md:px-12">
      <Heading>{t("platform.heading")}</Heading>
      <p className="mb-6 text-sm text-white/60">
        {t("platform.desc")}
      </p>

      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {providers.slice(0, 36).map((provider) => (
          <button
            key={provider.provider_id}
            onClick={() =>
              navigate(
                `/platform/${provider.provider_id}?name=${encodeURIComponent(provider.provider_name)}`,
              )
            }
            className="flex flex-col items-center gap-2 rounded-xl bg-semiDarkBlue p-4 transition-transform hover:scale-105 hover:bg-white/10"
          >
            <div className="h-12 w-12 overflow-hidden rounded-lg sm:h-16 sm:w-16">
              <img
                src={imageUrl(provider.logo_path, "w92")}
                alt={provider.provider_name}
                className="h-full w-full object-contain"
                loading="lazy"
              />
            </div>
            <span className="text-center text-[11px] font-medium text-white/80 sm:text-xs">
              {provider.provider_name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default PlatformsPage;
