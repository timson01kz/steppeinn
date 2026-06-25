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
      className={`flex h-9 flex-nowrap items-center rounded-full p-0 text-xs font-semibold whitespace-nowrap shadow-sm backdrop-blur-xl ${
        isLight
          ? "border border-white/45 bg-white/18 text-white"
          : "border border-stone-200 bg-white text-[#17130f]"
      }`}
    >
      {supportedLocales.map((lang) => (
        <button
          className={`h-9 min-w-9 rounded-full px-2.5 leading-none whitespace-nowrap transition ${
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
