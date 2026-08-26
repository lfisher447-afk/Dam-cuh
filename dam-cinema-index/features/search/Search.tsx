import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Search() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState(searchParams.get("q") || "");
  const [holder, setHolder] = useState("");
  const isDetailRoute = location.pathname.match(/^\/(movie|tv)\/\d+$|^\/history$/);
  const isBrowsePage = location.pathname.match(/^\/(categories\/\d+|browse\/|platform\/|collection\/)/);

  // Sync from URL when navigating to a new page
  useEffect(() => {
    setValue(searchParams.get("q") || "");
  }, [location.pathname, searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setValue(raw);
    if (isBrowsePage) {
      navigate(raw.trim() ? `/?q=${encodeURIComponent(raw.trim())}` : "/");
    } else {
      setSearchParams(raw.trim() ? { q: raw } : {});
    }
  };

  useEffect(() => {
    const path = location.pathname;
    if (path === "/") setHolder(t("search.allPlaceholder"));
    else if (path === "/movies") setHolder(t("search.moviesPlaceholder"));
    else if (path === "/series") setHolder(t("search.seriesPlaceholder"));
    else if (path.match(/^\/(categories\/\d+|browse\/|platform\/|collection\/)/))
      setHolder(t("search.browsePlaceholder"));
    else setHolder(t("search.bookmarksPlaceholder"));
  }, [location.pathname, t]);

  if (isDetailRoute) return null;

  return (
    <div className="flex w-full items-center gap-4">
      <img
        src="/assets/icon-search.svg"
        alt={t("search.iconAlt")}
        className="h-5 w-5 object-contain sm:h-6 sm:w-6 lg:h-8 lg:w-8"
      />
      <input
        onChange={handleChange}
        value={value}
        type="text"
        placeholder={holder}
        className="w-full min-w-0 border-b border-b-darkBlue bg-darkBlue pb-2 font-light tracking-wide outline-none hover:cursor-pointer focus:border-b-grayishBlue sm:text-base lg:text-2xl"
      />
    </div>
  );
}

export default Search;
