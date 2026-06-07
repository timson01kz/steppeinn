import Link from "next/link";
import { getServerI18n } from "@/i18n/server";

export default async function ForHotelsPage() {
  const { t } = await getServerI18n();

  return (
    <main className="min-h-screen bg-[#f6f3ed] px-5 py-12 text-[#17130f] sm:px-8">
      <div className="mx-auto max-w-4xl">
        <Link className="font-semibold text-[#2f4d46]" href="/">
          SteppeInn
        </Link>
        <h1 className="mt-8 text-4xl font-semibold">{t("forHotelsPage.title")}</h1>
        <p className="mt-3 max-w-2xl text-stone-600">
          {t("forHotelsPage.description")}
        </p>
        <Link
          className="mt-8 inline-flex rounded-md bg-[#2f4d46] px-5 py-3 font-bold text-white"
          href="/dashboard/owner"
        >
          {t("forHotelsPage.openOwnerDashboard")}
        </Link>
      </div>
    </main>
  );
}
