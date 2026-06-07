import Link from "next/link";
import { getServerI18n } from "@/i18n/server";
import { signInAction } from "@/lib/auth/actions";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;
  const { t } = await getServerI18n();

  return (
    <main className="grid min-h-screen place-items-center bg-[#f6f3ed] px-5 text-[#17130f]">
      <form
        action={signInAction}
        className="w-full max-w-md rounded-lg border border-stone-200 bg-white p-6 shadow-sm"
      >
        <Link className="font-semibold text-[#2f4d46]" href="/">
          SteppeInn
        </Link>
        <h1 className="mt-8 text-3xl font-semibold">{t("Login")}</h1>
        {error ? (
          <p className="mt-4 rounded-md border border-[#f7dfdc] bg-[#fff2f0] px-4 py-3 text-sm font-semibold text-[#9b2d25]">
            {error}
          </p>
        ) : null}
        <div className="mt-6 grid gap-4">
          <input
            className="h-12 rounded-md border border-stone-300 px-4 outline-none"
            name="email"
            placeholder={t("Email")}
            required
            type="email"
          />
          <input
            className="h-12 rounded-md border border-stone-300 px-4 outline-none"
            name="password"
            placeholder={t("Password")}
            required
            type="password"
          />
          <button className="h-12 rounded-md bg-[#2f4d46] font-bold text-white" type="submit">
            {t("Continue")}
          </button>
        </div>
        <Link
          className="mt-5 inline-flex font-semibold text-[#2f4d46]"
          href="/register"
        >
          {t("Create account")}
        </Link>
      </form>
    </main>
  );
}
