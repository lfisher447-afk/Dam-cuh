import { NavLink } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useTranslation } from "react-i18next";
import { auth } from "../lib/firebase";

const NAV_ITEMS = [
  { to: "/", key: "home", icon: "home" },
  { to: "/movies", key: "movies", icon: "movies" },
  { to: "/series", key: "series", icon: "series" },
  { to: "/categories", key: "browse", icon: "categories" },
  { to: "/bookmarks", key: "bookmarks", icon: "bookmarks" },
  { to: "/history", key: "history", icon: "history" },
] as const;

function NavIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "home":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" clipRule="evenodd" d="M1 0H8C8.6 0 9 0.4 9 1V8C9 8.6 8.6 9 8 9H1C0.4 9 0 8.6 0 8V1C0 0.4 0.4 0 1 0ZM1 11H8C8.6 11 9 11.4 9 12V19C9 19.6 8.6 20 8 20H1C0.4 20 0 19.6 0 19V12C0 11.4 0.4 11 1 11ZM19 0H12C11.4 0 11 0.4 11 1V8C11 8.6 11.4 9 12 9H19C19.6 9 20 8.6 20 8V1C20 0.4 19.6 0 19 0ZM12 11H19C19.6 11 20 11.4 20 12V19C20 19.6 19.6 20 19 20H12C11.4 20 11 19.6 11 19V12C11 11.4 11.4 11 12 11Z" />
        </svg>
      );
    case "movies":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" clipRule="evenodd" d="M16.9556 0H3.04444C1.36304 0 0 1.36304 0 3.04444V16.9556C0 18.637 1.36304 20 3.04444 20H16.9556C17.763 20 18.5374 19.6792 19.1083 19.1083C19.6792 18.5374 20 17.763 20 16.9556V3.04444C20 2.23701 19.6792 1.46264 19.1083 0.891697C18.5374 0.320753 17.763 0 16.9556 0ZM4 9H2V7H4V9ZM4 11H2V13H4V11ZM18 9H16V7H18V9ZM18 11H16V13H18V11ZM18 2.74V4H16V2H17.26C17.4563 2 17.6445 2.07796 17.7833 2.21674C17.922 2.35552 18 2.54374 18 2.74ZM4 2H2.74C2.54374 2 2.35552 2.07796 2.21674 2.21674C2.07796 2.35552 2 2.54374 2 2.74V4H4V2ZM2 17.26V16H4V18H2.74C2.54374 18 2.35552 17.922 2.21674 17.7833C2.07796 17.6445 2 17.4563 2 17.26ZM17.26 18C17.6687 18 18 17.6687 18 17.26V16H16V18H17.26Z" />
        </svg>
      );
    case "series":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" clipRule="evenodd" d="M9.08 4.48109H20V20H0V4.48109H4.92L2.22 1.20272L3.78 0.029098L7 3.90883L10.22 0L11.78 1.20272L9.08 4.48109ZM2 6.42095V18.0601H12V6.42095H2ZM17 14.1804H15V12.2405H17V14.1804ZM15 10.3007H17V8.36082H15V10.3007Z" />
        </svg>
      );
    case "categories":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      );
    case "bookmarks":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="20" viewBox="0 0 17 20" fill="currentColor">
          <path d="M15.3866 0C15.5893 0 15.7832 0.0396563 15.9683 0.118969C16.2591 0.233532 16.4904 0.414188 16.6623 0.660939C16.8341 0.907689 16.92 1.18088 16.92 1.4805V18.5195C16.92 18.8191 16.8341 19.0923 16.6623 19.3391C16.4904 19.5858 16.2591 19.7665 15.9683 19.881C15.8008 19.9515 15.607 19.9868 15.3866 19.9868C14.9636 19.9868 14.5979 19.8458 14.2895 19.5638L8.46001 13.959L2.63054 19.5638C2.31328 19.8546 1.94757 20 1.53338 20C1.33069 20 1.13681 19.9603 0.951751 19.881C0.660939 19.7665 0.42961 19.5858 0.257766 19.3391C0.085922 19.0923 0 18.8191 0 18.5195V1.4805C0 1.18088 0.085922 0.907689 0.257766 0.660939C0.42961 0.414188 0.660939 0.233532 0.951751 0.118969C1.13681 0.0396563 1.33069 0 1.53338 0H15.3866Z" />
        </svg>
      );
    case "history":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    default:
      return null;
  }
}

function Navbar() {
  const { t } = useTranslation();
  const { logout, isPending } = useLogout();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-semiDarkBlue px-4 py-3 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:w-[6rem] lg:flex-shrink-0 lg:flex-col lg:justify-between lg:rounded-[1.25rem] lg:py-8">
      <img
        src="/assets/icon-nav-movies.svg"
        alt={t("nav.navIconAlt")}
        className="hidden lg:block lg:pb-12"
      />

      <div className="flex items-center gap-6 lg:flex-col lg:gap-[3.75rem]">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `group/item relative flex items-center justify-center lg:w-full ${isActive ? "text-white" : "text-grayishBlue"} transition-colors duration-200 hover:text-red focus:border-none focus:text-white focus:outline-none`
            }
          >
            <NavIcon icon={item.icon} />
            <span className="pointer-events-none absolute left-full top-1/2 z-[9999] ml-3 hidden -translate-y-1/2 whitespace-nowrap rounded-md bg-red px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 before:absolute before:right-full before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-transparent before:border-r-red group-hover/item:opacity-100 lg:block">
              {t(`nav.${item.key}`)}
            </span>
          </NavLink>
        ))}
      </div>

      <div className="hidden items-center gap-3 lg:mt-auto lg:flex lg:flex-col lg:pb-12">
        <NavLink
          to="/profile"
          className="group/item relative flex items-center justify-center lg:w-full text-grayishBlue transition-colors duration-200 hover:text-white focus:outline-none"
        >
          <div className="h-[2.5rem] w-[2.5rem] shrink-0 overflow-hidden rounded-full border border-white">
            <img
              src={auth.currentUser?.photoURL || "/assets/image-avatar.png"}
              alt={t("nav.avatarAlt")}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="pointer-events-none absolute left-full top-1/2 z-[9999] ml-3 hidden -translate-y-1/2 whitespace-nowrap rounded-md bg-red px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 before:absolute before:right-full before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-transparent before:border-r-red group-hover/item:opacity-100 lg:block">
            {t("nav.profile")}
          </span>
        </NavLink>

        <button
          onClick={() => logout()}
          disabled={isPending}
          className="group/item relative flex items-center justify-center lg:w-full text-grayishBlue transition-colors duration-200 hover:text-red focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className="pointer-events-none absolute left-full top-1/2 z-[9999] ml-3 hidden -translate-y-1/2 whitespace-nowrap rounded-md bg-red px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 before:absolute before:right-full before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-transparent before:border-r-red group-hover/item:opacity-100 lg:block">
            {t("nav.logout")}
          </span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
