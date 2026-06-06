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
type Dictionary = Record<keyof typeof en, string>;

const dictionaries: Record<Locale, Dictionary> = { en, ru, kz };
const labels: Record<Locale, string> = { en: "EN", ru: "RU", kz: "KZ" };
const storageKey = "steppeinn_locale";

type I18nContextValue = {
  locale: Locale;
  label: string;
  setLocale: (locale: Locale) => void;
  t: (key: keyof typeof en) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === "undefined") return "en";

    const stored = window.localStorage.getItem(storageKey);
    return isLocale(stored) ? stored : "en";
  });

  const reverseLookup = useMemo(() => buildReverseLookup(), []);
  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      label: labels[locale],
      setLocale(nextLocale) {
        setLocaleState(nextLocale);
        window.localStorage.setItem(storageKey, nextLocale);
      },
      t(key) {
        return dictionaries[locale][key] ?? en[key];
      },
    }),
    [locale],
  );

  useEffect(() => {
    document.documentElement.lang = locale === "kz" ? "kk" : locale;
    translateDom(document.body, locale, reverseLookup);

    const observer = new MutationObserver(() => {
      translateDom(document.body, locale, reverseLookup);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [locale, reverseLookup]);

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

function isLocale(value: string | null): value is Locale {
  return value === "en" || value === "ru" || value === "kz";
}

function buildReverseLookup() {
  const lookup = new Map<string, keyof typeof en>();

  (Object.keys(en) as Array<keyof typeof en>).forEach((key) => {
    lookup.set(normalize(en[key]), key);
    lookup.set(normalize(ru[key]), key);
    lookup.set(normalize(kz[key]), key);
  });

  return lookup;
}

function translateDom(
  root: HTMLElement,
  locale: Locale,
  reverseLookup: Map<string, keyof typeof en>,
) {
  const dictionary = dictionaries[locale];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];

  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    if (node.parentElement?.closest("script,style,textarea,input,select")) continue;
    textNodes.push(node);
  }

  textNodes.forEach((node) => {
    const key = reverseLookup.get(normalize(node.nodeValue ?? ""));
    if (key) {
      const translated = preserveSpacing(node.nodeValue ?? "", dictionary[key]);
      if (node.nodeValue !== translated) {
        node.nodeValue = translated;
      }
    }
  });

  root
    .querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement>(
      "input[placeholder], textarea[placeholder], button[value]",
    )
    .forEach((element) => {
      const placeholder = "placeholder" in element ? element.placeholder : "";
      const placeholderKey = reverseLookup.get(normalize(placeholder));
      if (placeholderKey && "placeholder" in element) {
        const translated = dictionary[placeholderKey];
        if (element.placeholder !== translated) {
          element.placeholder = translated;
        }
      }

      const valueKey = reverseLookup.get(normalize(element.value));
      if (valueKey && element.value !== dictionary[valueKey]) {
        element.value = dictionary[valueKey];
      }
    });
}

function normalize(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function preserveSpacing(original: string, translated: string) {
  const leading = original.match(/^\s*/)?.[0] ?? "";
  const trailing = original.match(/\s*$/)?.[0] ?? "";
  return `${leading}${translated}${trailing}`;
}
