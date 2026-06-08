import Link from "next/link";
import {
  DashboardField,
  FieldLabel,
  SectionHeader,
  StatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import { HotelCard } from "@/components/HotelCard";
import { favoriteHotels } from "@/data/hotels";
import {
  clientCountries,
  clientNotifications,
  clientProfile,
  clientStats,
  clientSupportRequests,
} from "@/data/users";
import { getServerI18n } from "@/i18n/server";
import { signOutAction } from "@/lib/auth/actions";
import { getClientBookingRequests } from "@/lib/services/bookingService";
import type { DictionaryKey } from "@/i18n";

export const dynamic = "force-dynamic";

const sidebarItems = [
  { label: "Overview", href: "#overview" },
  { label: "My bookings", href: "#bookings" },
  { label: "Favorites", href: "#favorites" },
  { label: "Profile", href: "#profile" },
  { label: "Notifications", href: "#notifications" },
  { label: "Support", href: "#support" },
] satisfies Array<{ label: DictionaryKey; href: string }>;

const languageOptions = ["EN", "RU", "KZ"];

export default async function ClientDashboardPage() {
  const { t } = await getServerI18n();
  const { data: bookingRequests, error: bookingRequestsError } =
    await getClientBookingRequests();
  const dashboardStats = clientStats.map((stat) => {
    if (stat.label === "Active bookings") {
      return {
        ...stat,
        value: String(
          bookingRequests.filter((booking) => booking.status === "confirmed").length,
        ),
      };
    }

    if (stat.label === "Pending requests") {
      return {
        ...stat,
        value: String(
          bookingRequests.filter((booking) => booking.status === "pending").length,
        ),
      };
    }

    return stat;
  });

  return (
    <main className="min-h-screen bg-[#f6f3ed] text-[#17130f]">
      <div className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link className="flex items-center gap-3" href="/">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-[#2f4d46] text-lg font-black text-white shadow-lg">
              S
            </span>
            <span className="text-xl font-semibold tracking-[0.08em]">
              SteppeInn
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              className="rounded-full bg-[#17130f] px-5 py-2.5 text-sm font-bold text-white"
              href="/hotels"
            >
              {t("dashboard.client.findHotels")}
            </Link>
            <form action={signOutAction}>
              <button
                className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-bold text-[#17130f]"
                type="submit"
              >
                {t("Sign out")}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-lg border border-stone-200 bg-white p-4 shadow-sm lg:sticky lg:top-6">
          <p className="px-3 text-xs font-bold uppercase tracking-[0.18em] text-[#a66f2d]">
            {t("Client dashboard")}
          </p>
          <nav className="mt-4 grid gap-1">
            {sidebarItems.map((item) => (
              <a
                className="rounded-md px-3 py-2.5 text-sm font-semibold text-stone-600 transition hover:bg-[#f6f3ed] hover:text-[#17130f]"
                href={item.href}
                key={item.href}
              >
                {t(item.label)}
              </a>
            ))}
          </nav>
        </aside>

        <div className="grid gap-8">
          <section
            className="rounded-lg bg-[#17130f] p-6 text-white shadow-[0_28px_90px_rgba(34,28,18,.16)] sm:p-8"
            id="overview"
          >
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f0bb67]">
              {t("Overview")}
            </p>
            <h1 className="mt-3 text-4xl font-semibold sm:text-6xl">
              {t("Your Almaty trips.")}
            </h1>
            <p className="mt-4 max-w-3xl leading-7 text-white/68">
              {t("dashboard.client.overviewDescription")}
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {dashboardStats.map((stat) => (
                <article className="rounded-lg border border-white/12 bg-white/10 p-5" key={stat.label}>
                  <p className="text-sm font-semibold text-white/62">
                    {t(stat.label as DictionaryKey)}
                  </p>
                  <p className="mt-3 text-3xl font-semibold">{stat.value}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8" id="bookings">
            <SectionHeader eyebrow="My bookings" title="Requests and stays" />
            {bookingRequestsError ? (
              <div className="mt-6 rounded-lg border border-[#efc4bd] bg-[#fff0ed] px-5 py-4 text-sm font-semibold text-[#9b2d25]">
                {t("dashboard.client.bookingsError")} {bookingRequestsError}
              </div>
            ) : null}
            <div className="mt-6 grid gap-4">
              {bookingRequests.map((booking) => (
                <article
                  className="grid gap-4 rounded-lg border border-stone-200 bg-[#fbf8f1] p-5 xl:grid-cols-[1fr_auto] xl:items-center"
                  key={booking.id}
                >
                  <div className="grid gap-3 md:grid-cols-5">
                    <DashboardField label="Hotel" value={booking.propertyName} />
                    <DashboardField label="Dates" value={booking.dates} />
                    <DashboardField label="Guests" value={booking.guests} />
                    <DashboardField label="Room" value={booking.roomName} />
                    <div>
                      <FieldLabel label="Status" />
                      <div className="mt-1">
                        <StatusBadge status={booking.status} />
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    {booking.responseMessage ? (
                      <p className="rounded-md bg-white px-4 py-3 text-sm font-semibold text-stone-700">
                        {t("Hotel response:")} {booking.responseMessage}
                      </p>
                    ) : (
                      <p className="rounded-md bg-white px-4 py-3 text-sm font-semibold text-stone-600">
                        {t("Awaiting hotel response.")}
                      </p>
                    )}
                    {booking.specialRequests ? (
                      <p className="text-sm text-stone-600">
                        {t("Request:")} {booking.specialRequests}
                      </p>
                    ) : null}
                  </div>
                </article>
              ))}
              {bookingRequests.length === 0 ? (
                <p className="rounded-lg border border-dashed border-stone-300 bg-[#fbf8f1] p-5 text-sm font-semibold text-stone-600">
                  {t("dashboard.client.noBookings")}
                </p>
              ) : null}
            </div>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8" id="favorites">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <SectionHeader eyebrow="Favorites" title="Saved hotels" />
              <Link className="font-bold text-[#2f4d46]" href="/hotels">
                {t("dashboard.client.exploreMore")}
              </Link>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {favoriteHotels.map((hotel) => (
                <div className="grid gap-3" key={hotel.slug}>
                  <HotelCard hotel={hotel} />
                  <button
                    className="h-11 rounded-md border border-stone-300 bg-white text-sm font-bold"
                    type="button"
                  >
                    {t("dashboard.client.removeFavorite")}
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8" id="profile">
            <SectionHeader eyebrow="Profile" title="Personal details" />
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {clientProfile.map((item) => (
                <label className="grid gap-2 text-sm font-bold" key={item.label}>
                  {t(item.label as DictionaryKey)}
                  <input
                    className="h-12 rounded-md border border-stone-300 bg-[#fbf8f1] px-4 font-normal outline-none"
                    defaultValue={item.value}
                  />
                </label>
              ))}
              <label className="grid gap-2 text-sm font-bold">
                {t("Preferred language")}
                <select
                  className="h-12 rounded-md border border-stone-300 bg-[#fbf8f1] px-4 font-normal outline-none"
                  defaultValue="RU"
                >
                  {languageOptions.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold">
                {t("Country")}
                <select
                  className="h-12 rounded-md border border-stone-300 bg-[#fbf8f1] px-4 font-normal outline-none"
                  defaultValue="Kazakhstan"
                >
                  {clientCountries.map((country) => (
                    <option key={country} value={country}>
                      {t(country as DictionaryKey)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button className="mt-6 rounded-md bg-[#17130f] px-5 py-3 font-bold text-white" type="button">
              {t("dashboard.client.saveProfile")}
            </button>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8" id="notifications">
            <SectionHeader eyebrow="Notifications" title="Recent updates" />
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {clientNotifications.map((notification) => (
                <article className="rounded-lg border border-stone-200 bg-[#fbf8f1] p-5" key={notification.type}>
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#a66f2d]">
                    {t(notification.type as DictionaryKey)}
                  </p>
                  <p className="mt-3 leading-7 text-stone-700">
                    {t(notification.text as DictionaryKey)}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8" id="support">
            <SectionHeader eyebrow="Support" title="Need help?" />
            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_.9fr]">
              <form className="grid gap-4 rounded-lg bg-[#fbf8f1] p-5">
                <label className="grid gap-2 text-sm font-bold">
                  {t("dashboard.client.supportSubject")}
                  <input className="h-12 rounded-md border border-stone-300 px-4 font-normal outline-none" />
                </label>
                <label className="grid gap-2 text-sm font-bold">
                  {t("dashboard.client.supportMessage")}
                  <textarea
                    className="min-h-36 rounded-md border border-stone-300 p-4 font-normal outline-none"
                    placeholder={t("dashboard.client.supportPlaceholder")}
                  />
                </label>
                <button className="h-12 rounded-md bg-[#17130f] font-bold text-white" type="button">
                  {t("dashboard.client.sendSupportRequest")}
                </button>
              </form>
              <div className="grid gap-3">
                <h3 className="text-xl font-semibold">{t("dashboard.client.sentSupportRequests")}</h3>
                {clientSupportRequests.map((request) => (
                  <article className="rounded-lg border border-stone-200 bg-[#fbf8f1] p-5" key={`${request.topic}-${request.createdDate}`}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h4 className="font-semibold">{t(request.topic as DictionaryKey)}</h4>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#2f4d46]">
                        {t(request.status as DictionaryKey)}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-stone-600">
                      {t(request.messagePreview as DictionaryKey)}
                    </p>
                    <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
                      {request.createdDate}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
