"use client";

import Link from "next/link";
import type { RefObject } from "react";
import { useRef, useState } from "react";
import { useI18n } from "@/i18n";
import type { DictionaryKey } from "@/i18n";

type GuestKey = "adults" | "children" | "toddlers";

const cityOptions = [
  { key: "search.city.almaty", value: "Almaty" },
  { key: "search.city.astana", value: "Astana" },
  { key: "search.city.shymkent", value: "Shymkent" },
] satisfies Array<{ key: DictionaryKey; value: string }>;

const guestCategories = [
  { key: "adults", label: "search.guests.adults" },
  { key: "children", label: "search.guests.childrenFrom3" },
  { key: "toddlers", label: "search.guests.childrenUnder3" },
] satisfies Array<{ key: GuestKey; label: DictionaryKey }>;

const fieldLabelClass =
  "grid gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/72";
const fieldControlClass =
  "h-[52px] rounded-xl border border-white/18 bg-white/88 px-4 text-[15px] font-semibold text-[#17130f] shadow-[inset_0_1px_0_rgb(255_255_255_/_55%)] outline-none backdrop-blur-xl transition placeholder:text-stone-500 hover:bg-white/94 focus:border-white/70 focus:bg-white";

export function SearchBar() {
  const { locale, t } = useI18n();
  const checkInRef = useRef<HTMLInputElement>(null);
  const checkOutRef = useRef<HTMLInputElement>(null);
  const [guests, setGuests] = useState<Record<GuestKey, number>>({
    adults: 2,
    children: 0,
    toddlers: 0,
  });

  function openDatePicker(input: HTMLInputElement | null) {
    input?.focus();
    input?.showPicker?.();
  }

  function updateGuests(key: GuestKey, direction: 1 | -1) {
    setGuests((current) => {
      const minimum = key === "adults" ? 1 : 0;

      return {
        ...current,
        [key]: Math.max(minimum, current[key] + direction),
      };
    });
  }

  const childCount = guests.children + guests.toddlers;
  const adultLabel =
    guests.adults === 1 ? t("search.guests.adultOne") : t("search.guests.adultMany");
  const childLabel =
    childCount === 1 ? t("search.guests.childOne") : t("search.guests.childMany");
  const guestSummary =
    childCount > 0
      ? `${guests.adults} ${adultLabel}, ${childCount} ${childLabel}`
      : `${guests.adults} ${adultLabel}`;

  return (
    <form className="glass-panel animate-rise grid gap-3 p-3 sm:p-4">
      <div className="grid gap-2.5 rounded-2xl border border-white/16 bg-white/10 p-2.5 shadow-[inset_0_1px_0_rgb(255_255_255_/_18%)] lg:grid-cols-[1.1fr_.9fr_.9fr_1fr_auto]">
        <label className={fieldLabelClass}>
          {t("search.destination")}
          <select className={fieldControlClass} defaultValue="Almaty">
            {cityOptions.map((city) => (
              <option key={city.value} value={city.value}>
                {t(city.key)}
              </option>
            ))}
          </select>
        </label>

        <DateField
          inputRef={checkInRef}
          label={t("search.checkIn")}
          onOpen={() => openDatePicker(checkInRef.current)}
        />
        <DateField
          inputRef={checkOutRef}
          label={t("search.checkOut")}
          onOpen={() => openDatePicker(checkOutRef.current)}
        />

        <div className={`relative ${fieldLabelClass}`}>
          {t("search.guests")}
          <details className="group">
            <summary
              className={`${fieldControlClass} flex cursor-pointer list-none items-center justify-between focus-visible:ring-2 focus-visible:ring-white/80`}
            >
              <span>{guestSummary}</span>
              <span aria-hidden="true" className="text-sm text-stone-500">
                v
              </span>
            </summary>
            <div className="absolute left-0 right-0 z-30 mt-2 grid gap-3 rounded-2xl border border-white/70 bg-white/96 p-4 text-[#17130f] shadow-[0_24px_70px_rgba(23,19,15,.22)] backdrop-blur-xl">
              {guestCategories.map((category) => (
                <div className="flex items-center justify-between gap-4" key={category.key}>
                  <span className="text-sm font-bold normal-case tracking-normal">
                    {t(category.label)}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      aria-label={t("search.guests.decrease")}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 text-lg font-bold disabled:cursor-not-allowed disabled:opacity-40"
                      disabled={guests[category.key] <= (category.key === "adults" ? 1 : 0)}
                      onClick={() => updateGuests(category.key, -1)}
                      type="button"
                    >
                      -
                    </button>
                    <span className="w-5 text-center text-base font-bold">
                      {guests[category.key]}
                    </span>
                    <button
                      aria-label={t("search.guests.increase")}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2f4d46] text-lg font-bold text-white"
                      onClick={() => updateGuests(category.key, 1)}
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </details>
        </div>

        <div className="flex items-end">
          <Link
            className="flex h-[52px] w-full items-center justify-center rounded-xl bg-[#f0bb67] px-6 text-[15px] font-semibold tracking-normal text-[#17130f] shadow-[0_12px_34px_rgb(240_187_103_/_24%)] transition hover:-translate-y-0.5 hover:bg-[#ffd189]"
            href="/hotels"
          >
            {t("common.search")}
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-white/16 bg-white/10 p-2.5 shadow-[inset_0_1px_0_rgb(255_255_255_/_16%)] backdrop-blur-2xl">
        <p
          className="typing-effect max-w-4xl text-sm font-medium leading-6 text-white/88"
          key={locale}
        >
          {t("home.aiAssistant.prompt")}
        </p>
        <div className="mt-2.5 grid gap-2.5 md:grid-cols-[1fr_auto]">
          <input
            className="h-11 rounded-xl border border-white/18 bg-white/88 px-4 text-sm font-semibold text-[#17130f] shadow-[inset_0_1px_0_rgb(255_255_255_/_55%)] outline-none backdrop-blur-xl transition placeholder:text-stone-500 hover:bg-white/94 focus:border-white/70 focus:bg-white"
            placeholder={t("home.aiAssistant.placeholder")}
            type="text"
          />
          <Link
            className="flex h-11 items-center justify-center rounded-xl bg-white/94 px-6 text-sm font-bold uppercase tracking-[0.08em] text-[#2f4d46] shadow-[0_10px_26px_rgb(0_0_0_/_10%)] transition hover:-translate-y-0.5 hover:bg-white"
            href="/ai-search"
          >
            {t("home.aiAssistant.cta")}
          </Link>
        </div>
      </div>
    </form>
  );
}

function DateField({
  inputRef,
  label,
  onOpen,
}: {
  inputRef: RefObject<HTMLInputElement | null>;
  label: string;
  onOpen: () => void;
}) {
  return (
    <label className={fieldLabelClass}>
      {label}
      <input
        className={`${fieldControlClass} cursor-pointer`}
        onClick={onOpen}
        onFocus={onOpen}
        placeholder="dd.mm.yyyy"
        ref={inputRef}
        type="date"
      />
    </label>
  );
}
