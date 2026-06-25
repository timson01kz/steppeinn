"use client";

import { localeLabels, supportedLocales, useI18n } from "@/i18n";

type LanguageSwitcherProps = {
  variant?: "light" | "dark";
  size?: "default" | "mobile";
};

export function LanguageSwitcher({ variant = "light", size = "default" }: LanguageSwitcherProps) {
  const isLight = variant === "light";
  const isMobile = size === "mobile";
  const { locale, setLocale } = useI18n();

  return (
    <div
      className={`flex flex-nowrap items-center rounded-full text-xs font-semibold whitespace-nowrap shadow-sm backdrop-blur-xl pointer-events-auto ${
        isMobile ? "h-10 w-[126px] gap-1 p-0.5" : "h-9 p-0"
      } ${
        isLight
          ? "border border-white/45 bg-white/18 text-white"
          : "border border-stone-200 bg-white text-[#17130f]"
      }`}
    >
      {supportedLocales.map((lang) => (
        <button
          className={`rounded-full leading-none whitespace-nowrap transition pointer-events-auto ${
            isMobile
              ? "flex h-9 min-w-0 flex-1 items-center justify-center px-0"
              : "h-9 min-w-9 px-2.5"
          } ${
            lang === locale
              ? isMobile
                ? "bg-white text-[#1d403a] shadow-sm"
                : isLight
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
