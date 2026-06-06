"use client";

import { localeLabels, supportedLocales, useI18n } from "@/i18n";

type LanguageSwitcherProps = {
  variant?: "light" | "dark";
};

export function LanguageSwitcher({ variant = "light" }: LanguageSwitcherProps) {
  const isLight = variant === "light";
  const { locale, setLocale } = useI18n();

  return (
    <div
      className={`rounded-full p-1 text-xs font-semibold shadow-sm backdrop-blur-xl ${
        isLight
          ? "border border-white/45 bg-white/18 text-white"
          : "border border-stone-200 bg-white text-[#17130f]"
      }`}
    >
      {supportedLocales.map((lang) => (
        <button
          className={`rounded-full px-3 py-1.5 transition ${
            lang === locale
              ? isLight
                ? "bg-white text-[#1d403a]"
                : "bg-[#17130f] text-white"
              : isLight
                ? "hover:bg-white/20"
                : "hover:bg-stone-100"
          }`}
          key={lang}
          onClick={() => setLocale(lang)}
          type="button"
        >
          {localeLabels[lang]}
        </button>
      ))}
    </div>
  );
}
