"use client";

import Link from "next/link";
import { useI18n } from "@/i18n";

const links = [
  { label: "nav.hotels", href: "/hotels" },
  { label: "nav.map", href: "/map" },
  { label: "nav.aiSearch", href: "/ai-search" },
  { label: "nav.forHotels", href: "/for-hotels" },
];

export function Footer() {
  const { translate } = useI18n();

  return (
    <footer className="border-t border-stone-200 bg-[#17130f] px-5 py-12 text-white sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.2fr_.8fr]">
        <div>
          <Link className="text-xl font-semibold tracking-[0.08em]" href="/">
            SteppeInn
          </Link>
          <p className="mt-4 max-w-xl leading-7 text-white/62">
            {translate(
              "Premium Kazakhstan travel shell for hotels, city discovery, and partner operations. Built with mock data for the MVP stage.",
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 md:justify-end">
          {links.map((link) => (
            <Link className="text-sm font-semibold text-white/70 hover:text-white" href={link.href} key={link.href}>
              {translate(link.label)}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
