import { cookies } from "next/headers";
import { en } from "./en";
import { kz } from "./kz";
import { ru } from "./ru";
import type { DictionaryKey, Locale } from "./provider";

const dictionaries: Record<Locale, Record<DictionaryKey, string>> = { en, ru, kz };
const cookieName = "steppeinn_locale";

function normalizeLocale(value: string | undefined): Locale {
  return value === "ru" || value === "kz" ? value : "en";
}

export async function getServerI18n() {
  const cookieStore = await cookies();
  const locale = normalizeLocale(cookieStore.get(cookieName)?.value);
  const dictionary = dictionaries[locale] ?? en;

  return {
    locale,
    t(key: DictionaryKey) {
      return dictionary[key] || en[key] || key;
    },
  };
}
