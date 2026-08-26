import { useEffect, useRef } from "react";
import {
  Outlet,
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import Search from "../features/search/Search";
import Navbar from "./Navbar";
import ProtectedRoute from "./ProtectedRoute";
import { useLogout } from "../hooks/useLogout";
import { auth } from "../lib/firebase";

function AppLayout() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const mainRef = useRef<HTMLDivElement>(null);

  const isDetailRoute = pathname.match(/^\/(movie|tv)\/\d+$/);
  const isHome = pathname === "/";
  const isCategoriesLanding = pathname === "/categories";

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
    window.scrollTo(0, 0);
  }, [pathname]);

  const { logout, isPending: logoutPending } = useLogout();

  return (
    <ProtectedRoute>
      <div className="h-screen overflow-hidden bg-darkBlue font-outfit text-white">
        <div className="mx-auto flex h-full max-w-[1500px] gap-9 p-8 pb-20 lg:pb-8">
          <Navbar />

          <div className="flex min-w-0 flex-1 flex-col gap-9 min-h-0">
            {!isDetailRoute && (
              <header className="flex flex-col gap-4 shrink-0 lg:flex-row lg:items-center lg:gap-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {!isHome && (
                      <button
                        onClick={() => navigate(-1)}
                        className="shrink-0 text-white/60 transition-colors hover:text-white"
                        aria-label={t("appLayout.back")}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="15 18 9 12 15 6" />
                        </svg>
                      </button>
                    )}
                    <Link
                      to="/"
                      className="shrink-0 text-3xl font-black tracking-[0.08em] text-red transition-colors duration-200 hover:text-red/80 sm:text-4xl"
                      aria-label={t("appLayout.homeLink")}
                    >
                      WòFlix
                    </Link>
                  </div>

                  <div className="flex items-center gap-3 lg:hidden">
                    <NavLink
                      to="/profile"
                      className="h-8 w-8 overflow-hidden rounded-full border border-white/50"
                    >
                      <img
                        src={
                          auth.currentUser?.photoURL ||
                          "/assets/image-avatar.png"
                        }
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </NavLink>
                    <button
                      onClick={() => logout()}
                      disabled={logoutPending}
                      className="text-white/60 transition-colors hover:text-red"
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
                    </button>
                  </div>
                </div>
                {!isCategoriesLanding && (
                  <div className="min-w-0 flex-1">
                    <Search />
                  </div>
                )}
              </header>
            )}

            <main
              ref={mainRef}
              className="flex-1 overflow-y-auto min-h-0 bg-darkBlue [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default AppLayout;
