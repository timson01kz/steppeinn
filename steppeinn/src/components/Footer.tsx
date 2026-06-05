import Link from "next/link";

const links = [
  { label: "Hotels", href: "/hotels" },
  { label: "Map", href: "/map" },
  { label: "AI Search", href: "/ai-search" },
  { label: "For hotels", href: "/for-hotels" },
];

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-[#17130f] px-5 py-12 text-white sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.2fr_.8fr]">
        <div>
          <Link className="text-xl font-semibold tracking-[0.08em]" href="/">
            SteppeInn
          </Link>
          <p className="mt-4 max-w-xl leading-7 text-white/62">
            Premium Kazakhstan travel shell for hotels, city discovery, and
            partner operations. Built with mock data for the MVP stage.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 md:justify-end">
          {links.map((link) => (
            <Link className="text-sm font-semibold text-white/70 hover:text-white" href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
