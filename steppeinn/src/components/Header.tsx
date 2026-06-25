"use client";

import Link from "next/link";
import { HeaderAuthActions } from "./HeaderAuthActions";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useI18n } from "@/i18n";

const navItems = [
  { label: "nav.map", href: "/map" },
  { label: "nav.forHotels", href: "/for-hotels" },
];

type HeaderProps = {
  overlay?: boolean;
};

export function Header({ overlay = false }: HeaderProps) {
  const { translate } = useI18n();

  return (
    <header
      className={`relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 ${
        overlay ? "text-white" : "text-[#17130f]"
      }`}
    >
      <Link className="flex items-center gap-3" href="/">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-md text-lg font-black shadow-lg ${
            overlay ? "bg-white text-[#1f4d43]" : "bg-[#1f4d43] text-white"
          }`}
        >
          S
        </span>
        <span className="hidden text-xl font-semibold tracking-[0.08em] sm:inline">
          SteppeInn
        </span>
      </Link>

      <nav className="hidden items-center gap-8 text-sm font-semibold lg:flex">
        {navItems.map((item) => (
          <Link
            className={`transition ${
              overlay ? "text-white/82 hover:text-white" : "text-stone-600 hover:text-[#17130f]"
            }`}
            href={item.href}
            key={item.href}
          >
            {translate(item.label)}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <div>
          <LanguageSwitcher variant={overlay ? "light" : "dark"} />
        </div>
        <HeaderAuthActions overlay={overlay} />
      </div>
    </header>
  );
}
