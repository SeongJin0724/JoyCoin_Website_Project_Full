"use client";

import { useLanguage } from "@/lib/LanguageContext";

export default function HeaderNav() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div className="flex items-center space-x-4 pointer-events-auto">
      <nav className="hidden lg:flex items-center space-x-8 text-base font-bold text-white/80 mr-4">
        <a href="/mypage" className="hover:text-blue-400 transition-colors">
          {t("myPage")}
        </a>
        <a href="/buy" className="hover:text-blue-400 transition-colors">
          {t("buy")}
        </a>
      </nav>

      {/* 언어 선택 토글 */}
      <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-0.5">
        <button
          onClick={() => setLocale("ko")}
          className={`px-3 py-1.5 rounded-full text-[11px] font-black tracking-wide transition-all ${
            locale === "ko"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          한국어
        </button>
        <button
          onClick={() => setLocale("en")}
          className={`px-3 py-1.5 rounded-full text-[11px] font-black tracking-wide transition-all ${
            locale === "en"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          ENG
        </button>
      </div>
    </div>
  );
}
