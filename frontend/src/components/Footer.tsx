"use client";

import { useLanguage } from "@/lib/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="py-10 text-center text-slate-600 text-[10px] font-bold uppercase tracking-[0.3em] z-10">
      {t("footer")}
    </footer>
  );
}
