import Link from "next/link";
import { StatusBadge } from "@/components/dashboard/DashboardPrimitives";
import { HeaderAuthActions } from "@/components/HeaderAuthActions";
import { ownerBillingPlans } from "@/data/tariffs";
import {
  addPropertySteps,
  ownerMetrics,
  ownerProperties,
  ownerTopLocations,
} from "@/data/users";
import { getServerI18n } from "@/i18n/server";
import { respondToBookingRequestAction } from "@/lib/actions/bookingActions";
import { getOwnerBookingRequests } from "@/lib/services/bookingService";
import { getCurrentOwnerProperties } from "@/lib/services/propertyService";
import type { DictionaryKey } from "@/i18n";

export const dynamic = "force-dynamic";

const sidebarItems = [
  { label: "Overview", href: "#overview" },
  { label: "My properties", href: "#properties" },
  { label: "Add property", href: "/dashboard/owner/properties/new" },
  { label: "dashboard.owner.nav.requests", href: "#requests" },
  { label: "Billing", href: "#billing" },
  { label: "Statistics", href: "#statistics" },
] satisfies Array<{ label: DictionaryKey; href: string }>;

export default async function OwnerDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ booking_error?: string; booking_success?: string }>;
}) {
  const params = await searchParams;
  const { t } = await getServerI18n();
  const { data: supabaseProperties, error: propertiesError } =
    await getCurrentOwnerProperties();
  const { data: bookingRequests, error: bookingRequestsError } =
    await getOwnerBookingRequests();
  const displayedProperties =
    supabaseProperties.length > 0
      ? supabaseProperties
      : ownerProperties.map((property) => ({
          ...property,
          id: property.name,
          slug: slugFromName(property.name),
          moderationNotes: null,
          moderationHistory: [],
          photos: [],
          rooms: [],
        }));

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
          <HeaderAuthActions />
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-lg border border-stone-200 bg-white p-4 shadow-sm lg:sticky lg:top-6">
          <p className="px-3 text-xs font-bold uppercase tracking-[0.18em] text-[#a66f2d]">
            {t("Owner dashboard")}
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
            <div className="mt-4 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
              <div>
                <h1 className="text-4xl font-semibold sm:text-6xl">
                  {t("Manage your stays.")}
                </h1>
                <p className="mt-4 max-w-3xl leading-7 text-white/68">
                  {t("dashboard.owner.overviewDescription")}
                </p>
              </div>
              <Link
                className="inline-flex rounded-md bg-white px-5 py-3 font-bold text-[#17130f]"
                href="/dashboard/owner/properties/new"
              >
                {t("dashboard.owner.addObject")}
              </Link>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {ownerMetrics.map((metric) => (
                <article
                  className="rounded-lg border border-white/12 bg-white/10 p-5 backdrop-blur"
                  key={metric.label}
                >
                  <p className="text-sm font-semibold text-white/62">
                    {t(metric.label as DictionaryKey)}
                  </p>
                  <p className="mt-3 text-3xl font-semibold">{metric.value}</p>
                  <p className="mt-2 text-sm text-[#f0bb67]">
                    {t(metric.trend as DictionaryKey)}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8" id="properties">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#a66f2d]">
                  {t("My properties")}
                </p>
                <h2 className="mt-2 text-3xl font-semibold">{t("Listings")}</h2>
              </div>
              <Link className="font-bold text-[#2f4d46]" href="/dashboard/owner/properties/new">
                {t("dashboard.owner.addObject")}
              </Link>
            </div>
            {propertiesError ? (
              <div className="mt-6 rounded-lg border border-[#efc4bd] bg-[#fff0ed] px-5 py-4 text-sm font-semibold text-[#9b2d25]">
                {t("dashboard.owner.propertiesError")} {propertiesError}
              </div>
            ) : null}
            <div className="mt-6 grid gap-4">
              {displayedProperties.map((property) => (
                <article
                  className="grid gap-4 rounded-lg border border-stone-200 bg-[#fbf8f1] p-5 md:grid-cols-[1fr_auto] md:items-center"
                  key={property.name}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-semibold">{property.name}</h3>
                      <StatusBadge status={property.status} />
                    </div>
                    <p className="mt-2 text-sm text-stone-600">
                      {property.location} · {property.views} {t("dashboard.owner.views")} ·{" "}
                      {property.requests} {t("dashboard.owner.requests")}
                    </p>
                    {property.moderationNotes ? (
                      <p className="mt-3 rounded-md bg-white px-4 py-3 text-sm font-semibold text-stone-700">
                        {t("Moderation notes for the owner")} {property.moderationNotes}
                      </p>
                    ) : null}
                    {property.moderationHistory.length > 0 ? (
                      <div className="mt-4 grid gap-2">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
                          {t("dashboard.owner.moderationHistory")}
                        </p>
                        {property.moderationHistory.slice(0, 3).map((event) => (
                          <div
                            className="flex flex-wrap items-center gap-2 text-sm text-stone-600"
                            key={event.id}
                          >
                            <StatusBadge status={event.status} />
                            <span>{event.date}</span>
                            {event.notes ? <span>{event.notes}</span> : null}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      className="rounded-md border border-stone-300 px-4 py-2 text-sm font-bold"
                      href="/dashboard/owner/properties"
                    >
                      {t("dashboard.owner.editPhotos")}
                    </Link>
                    <Link
                      className="rounded-md bg-[#17130f] px-4 py-2 text-sm font-bold text-white"
                      href={`/hotels/${property.slug ?? "kok-tobe-skyline-residence"}`}
                    >
                      {t("dashboard.owner.preview")}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8" id="add-property">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#a66f2d]">
              {t("Add property")}
            </p>
            <h2 className="mt-2 text-3xl font-semibold">{t("dashboard.owner.addPropertyTitle")}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {addPropertySteps.map((step, index) => (
                <article
                  className="rounded-lg border border-stone-200 bg-[#f6f3ed] p-5"
                  key={step}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2f4d46] text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold">{t(step as DictionaryKey)}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    {t(`dashboard.owner.addSteps.${step}` as DictionaryKey)}
                  </p>
                </article>
              ))}
            </div>
            <Link
              className="mt-6 inline-flex rounded-md bg-[#17130f] px-5 py-3 font-bold text-white"
              href="/dashboard/owner/properties/new"
            >
              {t("Submit for moderation")}
            </Link>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8" id="requests">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#a66f2d]">
              {t("Booking requests")}
            </p>
            <h2 className="mt-2 text-3xl font-semibold">{t("Guest inquiries")}</h2>
            {params.booking_success ? (
              <div className="mt-6 rounded-lg border border-[#b8dcc7] bg-[#e9f8ee] px-5 py-4 text-sm font-semibold text-[#1f6b43]">
                {t("dashboard.owner.bookingResponseSaved")}
              </div>
            ) : null}
            {params.booking_error || bookingRequestsError ? (
              <div className="mt-6 rounded-lg border border-[#efc4bd] bg-[#fff0ed] px-5 py-4 text-sm font-semibold text-[#9b2d25]">
                {params.booking_error ?? bookingRequestsError}
              </div>
            ) : null}
            <div className="mt-6 grid gap-4">
              {bookingRequests.map((request) => (
                <article
                  className="grid gap-4 rounded-lg border border-stone-200 bg-[#fbf8f1] p-5 xl:grid-cols-[1fr_auto] xl:items-center"
                  key={request.id}
                >
                  <div className="grid gap-3 md:grid-cols-5">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
                        {t("dashboard.owner.guest")}
                      </p>
                      <p className="mt-1 font-semibold">{request.guestName}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
                        {t("Dates")}
                      </p>
                      <p className="mt-1 font-semibold">{request.dates}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
                        {t("Guests")}
                      </p>
                      <p className="mt-1 font-semibold">{request.guests}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
                        {t("Room")}
                      </p>
                      <p className="mt-1 font-semibold">{request.roomName}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
                        {t("Status")}
                      </p>
                      <div className="mt-1">
                        <StatusBadge status={request.status} />
                      </div>
                    </div>
                  </div>
                  <form action={respondToBookingRequestAction} className="grid gap-3">
                    <input name="booking_id" type="hidden" value={request.id} />
                    <textarea
                      className="min-h-20 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-[#2f4d46]"
                      defaultValue={request.responseMessage ?? ""}
                      name="response_message"
                      placeholder={t("Response message for the guest")}
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="rounded-md bg-[#2f4d46] px-4 py-2 text-sm font-bold text-white"
                        name="action"
                        type="submit"
                        value="confirm"
                      >
                        {t("Confirm")}
                      </button>
                      <button
                        className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-bold"
                        name="action"
                        type="submit"
                        value="decline"
                      >
                        {t("Decline")}
                      </button>
                    </div>
                  </form>
                </article>
              ))}
              {bookingRequests.length === 0 ? (
                <p className="rounded-lg border border-dashed border-stone-300 bg-[#fbf8f1] p-5 text-sm font-semibold text-stone-600">
                  {t("dashboard.owner.noBookingRequests")}
                </p>
              ) : null}
            </div>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8" id="billing">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#a66f2d]">
              {t("Billing")}
            </p>
            <h2 className="mt-2 text-3xl font-semibold">{t("dashboard.owner.billingTitle")}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {ownerBillingPlans.map((plan) => (
                <article
                  className="rounded-lg border border-stone-200 bg-[#f6f3ed] p-5"
                  key={plan.name}
                >
                  <h3 className="text-lg font-semibold">{t(plan.name as DictionaryKey)}</h3>
                  <p className="mt-4 text-2xl font-bold text-[#2f4d46]">
                    {t(plan.price as DictionaryKey)}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-stone-600">
                    {t(plan.note as DictionaryKey)}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8" id="statistics">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#a66f2d]">
              {t("Statistics")}
            </p>
            <h2 className="mt-2 text-3xl font-semibold">{t("dashboard.owner.statisticsTitle")}</h2>
            <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_.8fr]">
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: "dashboard.owner.stats.views", value: "18 420" },
                  { label: "dashboard.owner.stats.inquiries", value: "126" },
                  { label: "dashboard.owner.stats.conversionRate", value: "6.8%" },
                ].map((stat) => (
                  <article className="rounded-lg bg-[#f6f3ed] p-5" key={stat.label}>
                    <p className="text-sm font-semibold text-stone-500">
                      {t(stat.label as DictionaryKey)}
                    </p>
                    <p className="mt-3 text-3xl font-semibold">{stat.value}</p>
                  </article>
                ))}
              </div>
              <div className="rounded-lg bg-[#17130f] p-5 text-white">
                <h3 className="text-xl font-semibold">{t("Top locations")}</h3>
                <div className="mt-5 grid gap-4">
                  {ownerTopLocations.map((location) => (
                    <div key={location.name}>
                      <div className="flex justify-between text-sm font-semibold">
                        <span>{location.name}</span>
                        <span>{location.value}</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-white/12">
                        <div
                          className="h-2 rounded-full bg-[#f0bb67]"
                          style={{ width: location.value }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function slugFromName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
