"use client";

import { useI18n } from "@/i18n";

type SectionTitleProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
};

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
}: SectionTitleProps) {
  const isDark = tone === "dark";
  const { translate } = useI18n();

  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p
        className={`text-sm font-bold uppercase tracking-[0.22em] ${
          isDark ? "text-[#f0bb67]" : "text-[#a66f2d]"
        }`}
      >
        {translate(eyebrow)}
      </p>
      <h2
        className={`mt-3 text-3xl font-semibold leading-tight sm:text-5xl ${
          isDark ? "text-white" : "text-[#17130f]"
        }`}
      >
        {translate(title)}
      </h2>
      {description ? (
        <p
          className={`mt-4 text-base leading-7 sm:text-lg ${
            isDark ? "text-white/68" : "text-stone-600"
          }`}
        >
          {translate(description)}
        </p>
      ) : null}
    </div>
  );
}
