"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { en } from "./en";
import { kz } from "./kz";
import { ru } from "./ru";

export type Locale = "en" | "ru" | "kz";
export type DictionaryKey = keyof typeof en;
type Dictionary = Partial<Record<keyof typeof en, string>>;

const dictionaries: Record<Locale, Dictionary> = { en, ru, kz };
const labels: Record<Locale, string> = { en: "EN", ru: "RU", kz: "KZ" };
const cookieName = "steppeinn_locale";
const missingTranslationWarnings = new Set<string>();

type I18nContextValue = {
  locale: Locale;
  label: string;
  setLocale: (locale: Locale) => void;
  t: (key: DictionaryKey) => string;
  translate: (text: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
}) {
  const normalizedInitialLocale = normalizeLocale(initialLocale);
  const [locale, setLocaleState] = useState<Locale>(() => {
    logI18nRuntime("before hydration", normalizedInitialLocale);
    return normalizedInitialLocale;
  });

  const reverseLookup = useMemo(() => buildReverseLookup(), []);
  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      label: labels[locale] ?? labels.en,
      setLocale(nextLocale) {
        const normalizedNextLocale = normalizeLocale(nextLocale);
        setLocaleState(normalizedNextLocale);
        document.cookie = `${cookieName}=${normalizedNextLocale}; path=/; max-age=31536000; samesite=lax`;
      },
      t(key) {
        return readTranslation(locale, key);
      },
      translate(text) {
        const directKey = Object.prototype.hasOwnProperty.call(en, text)
          ? (text as keyof typeof en)
          : reverseLookup.get(normalizeText(text));

        return directKey ? readTranslation(locale, directKey) : text;
      },
    }),
    [locale, reverseLookup],
  );

  useEffect(() => {
    document.documentElement.lang = locale === "kz" ? "kk" : locale;
    logI18nRuntime("after hydration", locale);
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }

  return context;
}

export const supportedLocales: Locale[] = ["en", "ru", "kz"];
export const localeLabels = labels;

function buildReverseLookup() {
  const lookup = new Map<string, keyof typeof en>();

  (Object.keys(en) as Array<keyof typeof en>).forEach((key) => {
    [en[key], ru[key], kz[key]].forEach((value) => {
      if (typeof value !== "string" || !value.trim()) return;
      lookup.set(normalizeText(value), key);
    });
  });

  return lookup;
}

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeLocale(value: string | undefined): Locale {
  return value === "ru" || value === "kz" ? value : "en";
}

function readTranslation(locale: Locale, key: keyof typeof en) {
  const dictionary = dictionaries[locale] ?? en;
  const value = dictionary[key];

  if (typeof value === "string" && value.trim()) {
    return value;
  }

  warnMissingTranslation(locale, key);

  const fallback = en[key];
  if (typeof fallback === "string" && fallback.trim()) {
    return fallback;
  }

  return key;
}

function getDictionarySize(locale: Locale) {
  const dictionary = dictionaries[locale] ?? en;

  return Object.values(dictionary).filter(
    (value) => typeof value === "string" && value.trim(),
  ).length;
}

function logI18nRuntime(phase: "before hydration" | "after hydration", locale: Locale) {
  if (process.env.NODE_ENV === "production") return;

  console.info("[i18n]", {
    phase,
    locale,
    heroTitle: readTranslation(locale, "home.hero.title"),
    searchDestination: readTranslation(locale, "search.destination"),
    dictionarySize: getDictionarySize(locale),
  });
}

function warnMissingTranslation(locale: Locale, key: string) {
  if (process.env.NODE_ENV === "production") return;

  const warningKey = `${locale}:${key}`;
  if (missingTranslationWarnings.has(warningKey)) return;

  missingTranslationWarnings.add(warningKey);
  console.warn(`[i18n] Missing translation for "${key}" in locale "${locale}".`);
}
