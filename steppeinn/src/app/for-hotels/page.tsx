import Link from "next/link";

export default function ForHotelsPage() {
  return (
    <main className="min-h-screen bg-[#f6f3ed] px-5 py-12 text-[#17130f] sm:px-8">
      <div className="mx-auto max-w-4xl">
        <Link className="font-semibold text-[#2f4d46]" href="/">
          SteppeInn
        </Link>
        <h1 className="mt-8 text-4xl font-semibold">For hotels</h1>
        <p className="mt-3 max-w-2xl text-stone-600">
          Partner onboarding placeholder for property owners and hotel teams.
        </p>
        <Link
          className="mt-8 inline-flex rounded-md bg-[#2f4d46] px-5 py-3 font-bold text-white"
          href="/dashboard/owner"
        >
          Open owner dashboard
        </Link>
      </div>
    </main>
  );
}
