import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f6f3ed] px-5 text-[#17130f]">
      <form className="w-full max-w-md rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <Link className="font-semibold text-[#2f4d46]" href="/">
          SteppeInn
        </Link>
        <h1 className="mt-8 text-3xl font-semibold">Login</h1>
        <div className="mt-6 grid gap-4">
          <input
            className="h-12 rounded-md border border-stone-300 px-4 outline-none"
            placeholder="Email"
            type="email"
          />
          <input
            className="h-12 rounded-md border border-stone-300 px-4 outline-none"
            placeholder="Password"
            type="password"
          />
          <button className="h-12 rounded-md bg-[#2f4d46] font-bold text-white">
            Continue
          </button>
        </div>
        <Link
          className="mt-5 inline-flex font-semibold text-[#2f4d46]"
          href="/register"
        >
          Create account
        </Link>
      </form>
    </main>
  );
}
