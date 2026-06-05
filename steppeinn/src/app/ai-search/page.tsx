import Link from "next/link";

export default function AiSearchPage() {
  return (
    <main className="min-h-screen bg-[#f6f3ed] px-5 py-12 text-[#17130f] sm:px-8">
      <div className="mx-auto max-w-4xl">
        <Link className="font-semibold text-[#2f4d46]" href="/">
          SteppeInn
        </Link>
        <h1 className="mt-8 text-4xl font-semibold">AI search</h1>
        <p className="mt-3 max-w-2xl text-stone-600">
          Prompt-led hotel discovery placeholder. No AI service is connected in
          this MVP shell.
        </p>
        <div className="mt-8 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <label className="grid gap-3 font-semibold">
            Travel prompt
            <textarea
              className="min-h-40 rounded-md border border-stone-300 p-4 font-normal outline-none"
              defaultValue="I need a quiet hotel near the mountains for two nights."
            />
          </label>
        </div>
      </div>
    </main>
  );
}
