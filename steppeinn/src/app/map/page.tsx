import Link from "next/link";

export default function MapPage() {
  return (
    <main className="min-h-screen bg-[#f6f3ed] px-5 py-12 text-[#17130f] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Link className="font-semibold text-[#2f4d46]" href="/">
          SteppeInn
        </Link>
        <h1 className="mt-8 text-4xl font-semibold">Almaty map</h1>
        <p className="mt-3 max-w-2xl text-stone-600">
          Interactive map placeholder for hotel search, landmarks, routes, and
          nearby recommendations.
        </p>
        <div className="mt-8 h-[560px] rounded-lg border border-stone-200 bg-[linear-gradient(135deg,#c8d6c9,#f2d49b_45%,#8aa8b5)] shadow-sm" />
      </div>
    </main>
  );
}
