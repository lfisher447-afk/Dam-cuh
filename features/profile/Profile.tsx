import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  auth,
} from "../../lib/firebase";
import {
  updateProfile,
  updatePassword,
  sendEmailVerification,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
} from "firebase/auth";
import { useLogout } from "../../hooks/useLogout";
import { useUserPreferences } from "../../hooks/useUserPreferences";
import { useUserStats } from "../../hooks/useUserStats";
import { clearWatchHistory } from "../../services/apiWatchHistory";
import Heading from "../../ui/Heading";
import SpinnerMini from "../../ui/SpinnerMini";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import i18n from "../../lib/i18n/config";

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

function formatDate(dateString: string | undefined): string {
  if (!dateString) return "Unknown";
  try {
    return new Date(dateString).toLocaleDateString(i18n.language, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "Unknown";
  }
}

function LanguageSelect({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = LANGUAGES.find((l) => l.code === value);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, handleClickOutside]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setOpen((p) => !p)}
        disabled={disabled}
        className="flex w-full items-center justify-between rounded-lg bg-white/10 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-red disabled:opacity-50"
      >
        <span>{selected?.name ?? t("profile.selectLanguage")}</span>
        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-lg bg-semiDarkBlue py-1 shadow-2xl ring-1 ring-white/10">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => {
                onChange(lang.code);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-3 py-2 text-sm transition-colors hover:bg-red ${
                lang.code === value ? "text-white" : "text-white/70"
              }`}
            >
              <span>{lang.name}</span>
              {lang.code === value && (
                <svg
                  className="h-4 w-4 text-red"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Profile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = auth.currentUser;
  const { logout, isPending: logoutPending } = useLogout();
  const { t } = useTranslation();
  const { preferences, updatePreferences, isSaving: savingPrefs } = useUserPreferences();
  const { data: stats, isPending: loadingStats } = useUserStats();

  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [savingName, setSavingName] = useState(false);
  const [sendingVerification, setSendingVerification] = useState(false);
  const [refreshingVerification, setRefreshingVerification] = useState(false);
  const [verified, setVerified] = useState(user?.emailVerified ?? false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleting, setDeleting] = useState(false);

  const [clearingHistory, setClearingHistory] = useState(false);

  useEffect(() => {
    if (!user) return;
    user.getIdTokenResult(true).then(() => {
      setVerified(user.emailVerified);
    });
  }, [user]);

  const handleRefreshVerification = async () => {
    if (!user) return;
    setRefreshingVerification(true);
    try {
      await user.reload();
      setVerified(user.emailVerified);
      toast.success(
        user.emailVerified
          ? "Email verified"
          : "Still not verified. Check your inbox.",
      );
    } catch {
      toast.error("Failed to refresh status");
    } finally {
      setRefreshingVerification(false);
    }
  };

  const handleSaveName = async () => {
    if (!user || !displayName.trim()) return;
    setSavingName(true);
    try {
      await updateProfile(user, { displayName: displayName.trim() });
      toast.success("Display name updated");
    } catch {
      toast.error("Failed to update display name");
    } finally {
      setSavingName(false);
    }
  };

  const handleSendVerification = async () => {
    if (!user) return;
    setSendingVerification(true);
    try {
      await sendEmailVerification(user);
      toast.success("Verification email sent");
    } catch {
      toast.error("Failed to send verification email");
    } finally {
      setSendingVerification(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user || !user.email || !currentPassword || !newPassword) return;
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    setSavingPassword(true);
    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword,
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setShowPasswordForm(false);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
        toast.error("Current password is incorrect");
      } else {
        toast.error("Failed to change password");
      }
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || !user.email || !deletePassword) return;
    setDeleting(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, deletePassword);
      await reauthenticateWithCredential(user, credential);
      await deleteUser(user);
      toast.success("Account deleted");
      navigate("/login", { replace: true });
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
        toast.error("Password is incorrect");
      } else {
        toast.error("Failed to delete account");
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleClearHistory = async () => {
    setClearingHistory(true);
    try {
      await clearWatchHistory();
      toast.success("Watch history cleared");
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
      queryClient.invalidateQueries({ queryKey: ["watchHistory"] });
    } catch {
      toast.error("Failed to clear watch history");
    } finally {
      setClearingHistory(false);
    }
  };

  const memberSince = formatDate(user?.metadata.creationTime);

  if (!user) {
    return (
      <div className="px-6 pb-12 pt-6 md:px-12">
        <Heading>{t("profile.heading")}</Heading>
        <p className="mt-8 text-center text-grayishBlue">
          {t("profile.notSignedIn")}
        </p>
      </div>
    );
  }

  return (
    <div className="px-6 pb-12 pt-6 md:px-12">
      <Heading>{t("profile.heading")}</Heading>

      <div className="mx-auto mt-8 max-w-2xl space-y-6">
        {/* Profile Header */}
        <section className="rounded-xl bg-semiDarkBlue p-6">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border-2 border-white">
              <img
                src={auth.currentUser?.photoURL || "/assets/image-avatar.png"}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="flex-1 rounded-lg bg-white/10 px-3 py-2 text-lg font-semibold text-white outline-none focus:ring-2 focus:ring-red"
                  placeholder="Your name"
                />
                <button
                  onClick={handleSaveName}
                  disabled={savingName}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-red text-white hover:bg-red/80 disabled:opacity-50"
                >
                  {savingName ? (
                    <SpinnerMini />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              </div>

              <div className="mt-2 flex items-center gap-2 text-sm text-grayishBlue">
                <span>{user.email}</span>
                {user.emailVerified || verified ? (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    {t("profile.verified")}
                  </span>
                ) : (
                  <>
                    <span className="text-yellow-400">{t("profile.notVerified")}</span>
                    <button
                      onClick={handleSendVerification}
                      disabled={sendingVerification}
                      className="text-xs text-red underline hover:text-red/80 disabled:opacity-50"
                    >
                      {sendingVerification ? t("profile.sending") : t("profile.resendVerification")}
                    </button>
                    <button
                      onClick={handleRefreshVerification}
                      disabled={refreshingVerification}
                      className="text-xs text-grayishBlue underline hover:text-white disabled:opacity-50"
                    >
                      {refreshingVerification ? t("profile.refreshing") : t("profile.refreshStatus")}
                    </button>
                  </>
                )}
              </div>
              <p className="mt-1 text-xs text-grayishBlue">
                {t("profile.memberSince", { date: memberSince })}
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="rounded-xl bg-semiDarkBlue p-6">
          <h3 className="mb-4 text-lg font-semibold">{t("profile.statsTitle")}</h3>
          {loadingStats ? (
            <div className="flex h-16 items-center justify-center">
              <SpinnerMini />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-white/5 p-3 text-center">
                <p className="text-2xl font-bold text-red">{stats?.totalWatched ?? 0}</p>
                <p className="mt-1 text-xs text-grayishBlue">{t("profile.watched")}</p>
              </div>
              <div className="rounded-lg bg-white/5 p-3 text-center">
                <p className="text-2xl font-bold text-red">{stats?.bookmarkCount ?? 0}</p>
                <p className="mt-1 text-xs text-grayishBlue">{t("profile.bookmarks")}</p>
              </div>
              <div className="rounded-lg bg-white/5 p-3 text-center">
                <p className="text-lg font-bold text-red capitalize">
                  {stats?.favoriteGenre
                    ? stats.favoriteGenre === "movie"
                      ? t("profile.categoryMovie")
                      : t("profile.categorySeries")
                    : "—"}
                </p>
                <p className="mt-1 text-xs text-grayishBlue">{t("profile.topCategory")}</p>
              </div>
            </div>
          )}
        </section>

        {/* Preferred Language */}
        <section className="rounded-xl bg-semiDarkBlue p-6">
          <h3 className="mb-4 text-lg font-semibold">{t("profile.languageTitle")}</h3>
          <LanguageSelect
            value={preferences.preferredLanguage}
            onChange={(v) => {
              updatePreferences({ preferredLanguage: v });
              i18n.changeLanguage(v);
              localStorage.setItem("language", v);
            }}
            disabled={savingPrefs}
          />
          <p className="mt-1.5 text-xs text-grayishBlue">
            {t("profile.languageDesc")}
          </p>
        </section>

        {/* Security */}
        <section className="rounded-xl bg-semiDarkBlue p-6">
          <h3 className="mb-4 text-lg font-semibold">{t("profile.securityTitle")}</h3>

          {showPasswordForm ? (
            <div className="space-y-3">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder={t("profile.currentPassword")}
                className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-red"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t("profile.newPassword")}
                className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-red"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleChangePassword}
                  disabled={savingPassword}
                  className="rounded-lg bg-red px-4 py-2 text-sm font-medium hover:bg-red/80 disabled:opacity-50"
                >
                  {savingPassword ? <SpinnerMini /> : t("profile.savePassword")}
                </button>
                <button
                  onClick={() => {
                    setShowPasswordForm(false);
                    setCurrentPassword("");
                    setNewPassword("");
                  }}
                  className="rounded-lg bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
                >
                  {t("profile.cancel")}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="rounded-lg bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
            >
              {t("profile.changePassword")}
            </button>
          )}
        </section>

        {/* Danger Zone */}
        <section className="rounded-xl border border-red/30 bg-semiDarkBlue p-6">
          <h3 className="mb-4 text-lg font-semibold text-red">{t("profile.dangerZone")}</h3>
          <div className="space-y-4">
            {/* Sign Out */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t("profile.signOutLabel")}</p>
                <p className="text-xs text-grayishBlue">
                  {t("profile.signOutDesc")}
                </p>
              </div>
              <button
                onClick={() => logout()}
                disabled={logoutPending}
                className="rounded-lg bg-white/10 px-4 py-2 text-sm hover:bg-white/20 disabled:opacity-50"
              >
                {logoutPending ? <SpinnerMini /> : t("profile.signOutLabel")}
              </button>
            </div>

            <hr className="border-white/10" />

            {/* Clear Watch History */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t("profile.clearHistoryLabel")}</p>
                <p className="text-xs text-grayishBlue">
                  {t("profile.clearHistoryDesc")}
                </p>
              </div>
              <button
                onClick={handleClearHistory}
                disabled={clearingHistory}
                className="rounded-lg bg-red px-4 py-2 text-sm font-medium hover:bg-red/80 disabled:opacity-50"
              >
                {clearingHistory ? <SpinnerMini /> : t("profile.clear")}
              </button>
            </div>

            <hr className="border-white/10" />

            {/* Delete Account */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red">{t("profile.deleteAccountLabel")}</p>
                <p className="text-xs text-grayishBlue">
                  {t("profile.deleteAccountDesc")}
                </p>
              </div>
              {showDeleteConfirm ? (
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder={t("profile.enterPassword")}
                    className="w-40 rounded-lg bg-white/10 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-red"
                  />
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleting || !deletePassword}
                    className="rounded-lg bg-red px-3 py-2 text-sm font-medium hover:bg-red/80 disabled:opacity-50"
                  >
                    {deleting ? <SpinnerMini /> : t("profile.confirm")}
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeletePassword("");
                    }}
                    className="rounded-lg bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
                  >
                    {t("profile.cancel")}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="rounded-lg border border-red/50 px-4 py-2 text-sm text-red hover:bg-red/10 disabled:opacity-50"
                >
                  {t("profile.delete")}
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Profile;
