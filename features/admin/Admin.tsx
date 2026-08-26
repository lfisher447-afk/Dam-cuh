import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { isAdmin, getAllAdminStats, type AdminStats } from "../../services/apiAdmin";
import Spinner from "../../ui/Spinner";

function Admin() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    isAdmin()
      .then((result) => {
        setAuthorized(result);
        setChecking(false);
        if (!result) {
          setTimeout(() => navigate("/", { replace: true }), 3000);
        }
      })
      .catch(() => {
        setAuthorized(false);
        setChecking(false);
      });
  }, [navigate]);

  useEffect(() => {
    if (!authorized) return;
    setLoading(true);
    getAllAdminStats()
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setStats(null);
        setLoading(false);
      });
  }, [authorized]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-darkBlue">
        <Spinner />
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-darkBlue text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <h1 className="text-xl font-semibold">Access Denied</h1>
        <p className="text-sm text-white/50">You do not have admin privileges.</p>
        <p className="text-xs text-white/30">Redirecting to home...</p>
      </div>
    );
  }

  if (loading || !stats) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-darkBlue">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darkBlue px-6 py-8 text-white md:px-12">
      <div className="mb-8 flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red">
          <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
        </svg>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white/5 p-5">
          <p className="text-xs text-white/40 uppercase tracking-wider">Total Users</p>
          <p className="mt-1 text-3xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="rounded-xl bg-white/5 p-5">
          <p className="text-xs text-white/40 uppercase tracking-wider">Total Watches</p>
          <p className="mt-1 text-3xl font-bold">{stats.totalWatches}</p>
        </div>
        <div className="rounded-xl bg-white/5 p-5">
          <p className="text-xs text-white/40 uppercase tracking-wider">Countries</p>
          <p className="mt-1 text-3xl font-bold">{stats.countryBreakdown.length}</p>
        </div>
        <div className="rounded-xl bg-white/5 p-5">
          <p className="text-xs text-white/40 uppercase tracking-wider">Recent Signups</p>
          <p className="mt-1 text-3xl font-bold">{stats.recentSignups.length}</p>
        </div>
      </div>

      {/* Popular Content */}
      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">Most Watched Content</h2>
        <div className="overflow-x-auto rounded-xl bg-white/5">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs text-white/40 uppercase">
                <th className="px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Watches</th>
              </tr>
            </thead>
            <tbody>
              {stats.popularContent.map((item, i) => (
                <tr key={item.title} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 text-white/40">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{item.title}</td>
                  <td className="px-4 py-3 text-white/60 capitalize">{item.category}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-red/20 px-2.5 py-0.5 text-xs font-medium text-red">
                      {item.count}
                    </span>
                  </td>
                </tr>
              ))}
              {stats.popularContent.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-white/30">No watch data yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Country Breakdown */}
        <section>
          <h2 className="mb-4 text-lg font-semibold">Users by Country</h2>
          <div className="overflow-x-auto rounded-xl bg-white/5">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs text-white/40 uppercase">
                  <th className="px-4 py-3 font-medium">Country</th>
                  <th className="px-4 py-3 font-medium">Users</th>
                  <th className="px-4 py-3 font-medium">%</th>
                </tr>
              </thead>
              <tbody>
                {stats.countryBreakdown.map((item) => (
                  <tr key={item.country} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 font-medium">{item.country}</td>
                    <td className="px-4 py-3">{item.count}</td>
                    <td className="px-4 py-3 text-white/50">
                      {stats.totalUsers > 0
                        ? ((item.count / stats.totalUsers) * 100).toFixed(1)
                        : "0"}%
                    </td>
                  </tr>
                ))}
                {stats.countryBreakdown.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-white/30">No user data yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent Signups */}
        <section>
          <h2 className="mb-4 text-lg font-semibold">Recent Signups</h2>
          <div className="overflow-x-auto rounded-xl bg-white/5">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs text-white/40 uppercase">
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Country</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentSignups.map((user) => (
                  <tr key={user.uid} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 font-medium truncate max-w-[200px]">{user.email}</td>
                    <td className="px-4 py-3 text-white/60">{user.country}</td>
                    <td className="px-4 py-3 text-white/50 text-xs">{user.createdAt}</td>
                  </tr>
                ))}
                {stats.recentSignups.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-white/30">No signups yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Admin;
