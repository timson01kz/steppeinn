import Link from "next/link";
import {
  DashboardField,
  FieldLabel,
  SectionHeader,
  StatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import { adminLocations } from "@/data/locations";
import { adminTariffs } from "@/data/tariffs";
import {
  adminAdvertisements,
  adminMetrics,
  adminProperties,
  adminReviews,
  adminSearchedLocations,
  adminTrendBars,
  adminUsers,
  adminViewedHotels,
} from "@/data/users";
import { getServerI18n } from "@/i18n/server";
import { moderatePropertyAction } from "@/lib/actions/propertyActions";
import { getPendingModerationProperties } from "@/lib/services/propertyService";
import type { DictionaryKey } from "@/i18n";

const navItems = [
  "Dashboard",
  "Properties",
  "Users",
  "Bookings",
  "Locations",
  "Advertisements",
  "Tariffs",
  "Reviews",
  "Settings",
] satisfies DictionaryKey[];

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ moderation_error?: string; moderation_success?: string }>;
}) {
  const params = await searchParams;
  const { t } = await getServerI18n();
  const { data: pendingProperties, error: pendingPropertiesError } =
    await getPendingModerationProperties();
  const displayedProperties =
    pendingProperties.length > 0
      ? pendingProperties
      : adminProperties.map((property) => ({
          ...property,
          id: property.name,
        }));

  return (
    <main className="min-h-screen bg-[#f6f3ed] text-[#17130f]">
      <div className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link className="flex items-center gap-3" href="/">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-[#17130f] text-lg font-black text-white shadow-lg">
              S
            </span>
            <span className="text-xl font-semibold tracking-[0.08em]">
              SteppeInn Admin
            </span>
          </Link>
          <span className="rounded-full bg-[#2f4d46] px-4 py-2 text-sm font-bold text-white">
            {t("dashboard.admin.mockSystem")}
          </span>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-lg border border-stone-200 bg-white p-4 shadow-sm lg:sticky lg:top-6">
          <p className="px-3 text-xs font-bold uppercase tracking-[0.18em] text-[#a66f2d]">
            {t("Management")}
          </p>
          <nav className="mt-4 grid gap-1">
            {navItems.map((item) => (
              <a
                className="rounded-md px-3 py-2.5 text-sm font-semibold text-stone-600 transition hover:bg-[#f6f3ed] hover:text-[#17130f]"
                href={`#${item.toLowerCase().replaceAll(" ", "-")}`}
                key={item}
              >
                {t(item)}
              </a>
            ))}
          </nav>
        </aside>

        <div className="grid gap-8">
          <section className="rounded-lg bg-[#17130f] p-6 text-white shadow-[0_28px_90px_rgba(34,28,18,.16)] sm:p-8" id="dashboard">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f0bb67]">
              {t("Dashboard")}
            </p>
            <h1 className="mt-3 text-4xl font-semibold sm:text-6xl">
              {t("dashboard.admin.heroTitle")}
            </h1>
            <p className="mt-4 max-w-3xl leading-7 text-white/68">
              {t("dashboard.admin.heroDescription")}
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {adminMetrics.map((metric) => (
                <article className={`rounded-lg p-5 text-[#17130f] ${metric.tone}`} key={metric.label}>
                  <p className="text-sm font-semibold text-stone-600">
                    {t(metric.label as DictionaryKey)}
                  </p>
                  <p className="mt-3 text-3xl font-semibold">{metric.value}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8" id="properties">
            <SectionHeader eyebrow="Moderation" title="Property queue" />
            {params.moderation_success ? (
              <div className="mt-6 rounded-lg border border-[#b8dcc7] bg-[#e9f8ee] px-5 py-4 text-sm font-semibold text-[#1f6b43]">
                {t("dashboard.admin.moderationSaved")}
              </div>
            ) : null}
            {params.moderation_error ? (
              <div className="mt-6 rounded-lg border border-[#efc4bd] bg-[#fff0ed] px-5 py-4 text-sm font-semibold text-[#9b2d25]">
                {params.moderation_error}
              </div>
            ) : null}
            {pendingPropertiesError ? (
              <div className="mt-6 rounded-lg border border-[#efc4bd] bg-[#fff0ed] px-5 py-4 text-sm font-semibold text-[#9b2d25]">
                {t("dashboard.admin.moderationError")} {pendingPropertiesError}
              </div>
            ) : null}
            <div className="mt-6 grid gap-4">
              {displayedProperties.map((property) => (
                <article className="grid gap-4 rounded-lg border border-stone-200 bg-[#fbf8f1] p-5 xl:grid-cols-[1fr_auto] xl:items-center" key={property.name}>
                  <div className="grid gap-3 md:grid-cols-5">
                    <DashboardField label="Property" value={property.name} />
                    <DashboardField label="Owner" value={property.owner} />
                    <DashboardField label="City" value={property.city} />
                    <div>
                      <FieldLabel label="Status" />
                      <div className="mt-1"><StatusBadge status={property.status} /></div>
                    </div>
                    <DashboardField label="Submitted" value={property.date} />
                  </div>
                  <form action={moderatePropertyAction} className="grid gap-3">
                    <input name="property_id" type="hidden" value={property.id} />
                    <textarea
                      className="min-h-20 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-[#2f4d46]"
                      name="notes"
                      placeholder={t("Moderation notes for the owner")}
                    />
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: "Approve", value: "approve" },
                        { label: "Reject", value: "reject" },
                        { label: "Request changes", value: "request_changes" },
                      ].map((action) => (
                        <button
                          className={`rounded-md px-4 py-2 text-sm font-bold ${
                            action.value === "approve" ? "bg-[#2f4d46] text-white" : "border border-stone-300 bg-white"
                          }`}
                          key={action.value}
                          name="action"
                          type="submit"
                          value={action.value}
                        >
                          {t(action.label as DictionaryKey)}
                        </button>
                      ))}
                    </div>
                  </form>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8" id="users">
            <SectionHeader eyebrow="Users" title="Clients, owners, admins" />
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {adminUsers.map((user) => (
                <article className="rounded-lg border border-stone-200 bg-[#fbf8f1] p-5" key={user.name}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold">{user.name}</h3>
                      <p className="mt-1 text-sm font-semibold capitalize text-stone-500">
                        {t(user.role as DictionaryKey)}
                      </p>
                    </div>
                    <StatusBadge status={user.status} />
                  </div>
                  <button className="mt-5 rounded-md bg-[#17130f] px-4 py-2 text-sm font-bold text-white" type="button">
                    {user.status === "blocked" ? t("dashboard.admin.unblock") : t("dashboard.admin.block")}
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8" id="bookings">
            <SectionHeader eyebrow="Bookings" title="Request operations" />
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                { label: "dashboard.admin.newRequests", value: "48" },
                { label: "confirmed", value: "312" },
                { label: "dashboard.admin.needsSupport", value: "9" },
              ].map((item) => (
                <div className="rounded-lg bg-[#f6f3ed] p-5 text-xl font-semibold" key={item.label}>
                  {t(item.label as DictionaryKey)}: {item.value}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8" id="locations">
            <SectionHeader eyebrow="Locations" title="Editable Almaty places" />
            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {adminLocations.map((location) => (
                <article className="flex items-center justify-between rounded-lg border border-stone-200 bg-[#fbf8f1] p-4" key={location}>
                  <span className="font-semibold">{location}</span>
                  <button className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-bold" type="button">
                    {t("dashboard.admin.edit")}
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8" id="advertisements">
            <SectionHeader eyebrow="Advertisements" title="Promotion inventory" />
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {adminAdvertisements.map((ad) => (
                <article className="rounded-lg border border-stone-200 bg-[#fbf8f1] p-5" key={ad.name}>
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-xl font-semibold">{t(ad.name as DictionaryKey)}</h3>
                    <StatusBadge status={ad.status} />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-stone-600">
                    {t(ad.placement as DictionaryKey)}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8" id="tariffs">
            <SectionHeader eyebrow="Tariffs" title="Commercial plans" />
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {adminTariffs.map((tariff) => (
                <article className="rounded-lg bg-[#f6f3ed] p-5" key={tariff.name}>
                  <h3 className="text-lg font-semibold">{t(tariff.name as DictionaryKey)}</h3>
                  <p className="mt-4 text-2xl font-bold text-[#2f4d46]">{tariff.price}</p>
                  <p className="mt-2 text-sm font-semibold text-stone-500">
                    {t(tariff.period as DictionaryKey)}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8" id="reviews">
            <SectionHeader eyebrow="Reviews" title="Moderation queue" />
            <div className="mt-6 grid gap-4">
              {adminReviews.map((review) => (
                <article className="grid gap-4 rounded-lg border border-stone-200 bg-[#fbf8f1] p-5 lg:grid-cols-[1fr_auto] lg:items-center" key={`${review.hotel}-${review.author}`}>
                  <div>
                    <h3 className="font-semibold">{review.hotel}</h3>
                    <p className="mt-1 text-sm text-stone-600">
                      {review.author} · {t("dashboard.admin.rating")} {review.rating}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Approve", "Hide", "Delete"].map((action) => (
                      <button className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-bold" key={action} type="button">
                        {t(action as DictionaryKey)}
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8" id="settings">
            <SectionHeader eyebrow="Analytics" title="Search, views, booking trends" />
            <div className="mt-6 grid gap-5 xl:grid-cols-3">
              <AnalyticsCard title={t("dashboard.admin.topSearchedLocations")} items={adminSearchedLocations.map((item) => `${item.name} ${item.value}`)} />
              <AnalyticsCard title={t("dashboard.admin.mostViewedHotels")} items={adminViewedHotels} />
              <div className="rounded-lg bg-[#17130f] p-5 text-white">
                <h3 className="text-xl font-semibold">{t("Booking trends")}</h3>
                <div className="mt-6 flex h-44 items-end gap-3">
                  {adminTrendBars.map((height, index) => (
                    <div className="flex flex-1 flex-col items-center gap-2" key={`${height}-${index}`}>
                      <div className="w-full rounded-t bg-[#f0bb67]" style={{ height }} />
                      <span className="text-xs text-white/60">{index + 1}</span>
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

function AnalyticsCard({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="rounded-lg bg-[#f6f3ed] p-5">
      <h3 className="text-xl font-semibold">{title}</h3>
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <p className="rounded-md bg-white px-4 py-3 text-sm font-semibold" key={item}>
            {item}
          </p>
        ))}
      </div>
    </article>
  );
}
