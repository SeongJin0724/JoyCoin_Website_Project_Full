"use client";
import { useState, useEffect } from "react";
import { getMe, getUnreadNotificationCount } from "@/lib/api";
import { useLanguage } from "@/lib/LanguageContext";

type User = {
  id: number;
  email: string;
  username: string;
  role: string;
};

export default function Header() {
  const { locale, setLocale, t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      setLoading(false);
      return;
    }

    Promise.all([
      getMe(token).catch(() => null),
      getUnreadNotificationCount(token).catch(() => ({ count: 0 })),
    ]).then(([userData, notifData]) => {
      if (userData) {
        setUser(userData);
        setUnreadCount(notifData?.count || 0);
      } else {
        localStorage.removeItem("access");
      }
    }).finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    setUser(null);
    window.location.href = "/";
  };

  const toggleLocale = () => {
    setLocale(locale === "en" ? "ko" : "en");
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] px-4 md:px-10 py-5 flex justify-between items-center pointer-events-none">
      <div className="flex items-center space-x-4 pointer-events-auto">
        <a
          href="/"
          className="text-2xl md:text-3xl font-black tracking-tighter text-blue-500 cursor-pointer drop-shadow-lg"
        >
          JOYCOIN
        </a>
      </div>

      <div className="flex items-center space-x-4 pointer-events-auto">
        {/* Language Toggle */}
        <button
          onClick={toggleLocale}
          className="bg-slate-800/50 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-700/50 hover:bg-slate-700/50 transition-all"
        >
          {locale === "en" ? "한국어" : "English"}
        </button>

        <nav className="hidden lg:flex items-center space-x-8 text-base font-bold text-white/80 mr-4">
          <a href="/deposits" className="hover:text-blue-400 transition-colors">
            {t("myPage")}
          </a>
          <a href="/buy" className="hover:text-blue-400 transition-colors">
            {t("buy")}
          </a>
          {user?.role === "admin" && (
            <a href="/admin" className="hover:text-yellow-400 transition-colors text-yellow-500">
              {t("admin")}
            </a>
          )}
        </nav>

        {loading ? (
          <div className="w-20 h-10 bg-slate-800/50 rounded-2xl animate-pulse" />
        ) : user ? (
          <div className="flex items-center space-x-3">
            {/* Notification Bell */}
            <a
              href="/notifications"
              className="relative p-2 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </a>

            <span className="text-sm font-bold text-slate-400 hidden md:block">
              {user.username}
            </span>
            <button
              onClick={handleLogout}
              className="bg-slate-700/50 text-slate-300 px-4 py-2 rounded-2xl border border-slate-600/30 hover:bg-slate-600/50 transition-all active:scale-95 font-bold text-sm"
            >
              {t("logout")}
            </button>
          </div>
        ) : (
          <a
            href="/auth/login"
            className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-2xl border border-blue-500/30 hover:bg-blue-500/30 transition-all active:scale-95 font-bold text-sm"
          >
            {t("login")}
          </a>
        )}
      </div>
    </div>
  );
}
