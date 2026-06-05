"use client";

const languages = ["RU", "KZ", "EN"];

type LanguageSwitcherProps = {
  variant?: "light" | "dark";
};

export function LanguageSwitcher({ variant = "light" }: LanguageSwitcherProps) {
  const isLight = variant === "light";

  return (
    <div
      className={`rounded-full p-1 text-xs font-semibold shadow-sm backdrop-blur-xl ${
        isLight
          ? "border border-white/45 bg-white/18 text-white"
          : "border border-stone-200 bg-white text-[#17130f]"
      }`}
    >
      {languages.map((lang) => (
        <button
          className={`rounded-full px-3 py-1.5 transition ${
            lang === "RU"
              ? isLight
                ? "bg-white text-[#1d403a]"
                : "bg-[#17130f] text-white"
              : isLight
                ? "hover:bg-white/20"
                : "hover:bg-stone-100"
          }`}
          key={lang}
          type="button"
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
