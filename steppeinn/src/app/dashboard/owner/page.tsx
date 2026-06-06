import Link from "next/link";
import { StatusBadge } from "@/components/dashboard/DashboardPrimitives";
import { ownerBookingRequests } from "@/data/bookings";
import { ownerBillingPlans } from "@/data/tariffs";
import {
  addPropertySteps,
  ownerMetrics,
  ownerProperties,
  ownerTopLocations,
} from "@/data/users";
import { getCurrentOwnerProperties } from "@/lib/services/propertyService";

export const dynamic = "force-dynamic";

const sidebarItems = [
  { label: "Overview", href: "#overview" },
  { label: "My properties", href: "#properties" },
  { label: "Add property", href: "/dashboard/owner/properties/new" },
  { label: "Requests", href: "#requests" },
  { label: "Billing", href: "#billing" },
  { label: "Statistics", href: "#statistics" },
];

export default async function OwnerDashboardPage() {
  const { data: supabaseProperties, error: propertiesError } =
    await getCurrentOwnerProperties();
  const displayedProperties =
    supabaseProperties.length > 0
      ? supabaseProperties
      : ownerProperties.map((property) => ({
          ...property,
          id: property.name,
          slug: slugFromName(property.name),
          moderationNotes: null,
          moderationHistory: [],
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
          <Link
            className="rounded-full bg-[#17130f] px-5 py-2.5 text-sm font-bold text-white"
            href="/for-hotels"
          >
            Partner center
          </Link>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-lg border border-stone-200 bg-white p-4 shadow-sm lg:sticky lg:top-6">
          <p className="px-3 text-xs font-bold uppercase tracking-[0.18em] text-[#a66f2d]">
            Owner dashboard
          </p>
          <nav className="mt-4 grid gap-1">
            {sidebarItems.map((item) => (
              <a
                className="rounded-md px-3 py-2.5 text-sm font-semibold text-stone-600 transition hover:bg-[#f6f3ed] hover:text-[#17130f]"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mt-6 rounded-lg bg-[#17130f] p-4 text-white">
            <p className="text-sm font-bold">Mock mode</p>
            <p className="mt-2 text-sm leading-6 text-white/62">
              Supabase now powers owner-submitted listings. Remaining dashboard
              modules still use local mock content.
            </p>
          </div>
        </aside>

        <div className="grid gap-8">
          <section
            className="rounded-lg bg-[#17130f] p-6 text-white shadow-[0_28px_90px_rgba(34,28,18,.16)] sm:p-8"
            id="overview"
          >
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f0bb67]">
              Overview
            </p>
            <div className="mt-4 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
              <div>
                <h1 className="text-4xl font-semibold sm:text-6xl">
                  Manage your stays.
                </h1>
                <p className="mt-4 max-w-3xl leading-7 text-white/68">
                  Track property performance, requests, moderation, billing, and
                  listing setup from one owner workspace.
                </p>
              </div>
              <Link
                className="inline-flex rounded-md bg-white px-5 py-3 font-bold text-[#17130f]"
                href="/dashboard/owner/properties/new"
              >
                Add property
              </Link>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {ownerMetrics.map((metric) => (
                <article
                  className="rounded-lg border border-white/12 bg-white/10 p-5 backdrop-blur"
                  key={metric.label}
                >
                  <p className="text-sm font-semibold text-white/62">{metric.label}</p>
                  <p className="mt-3 text-3xl font-semibold">{metric.value}</p>
                  <p className="mt-2 text-sm text-[#f0bb67]">{metric.trend}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8" id="properties">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#a66f2d]">
                  My properties
                </p>
                <h2 className="mt-2 text-3xl font-semibold">Listings</h2>
              </div>
              <Link className="font-bold text-[#2f4d46]" href="/dashboard/owner/properties/new">
                Create new listing
              </Link>
            </div>
            {propertiesError ? (
              <div className="mt-6 rounded-lg border border-[#efc4bd] bg-[#fff0ed] px-5 py-4 text-sm font-semibold text-[#9b2d25]">
                Supabase properties could not be loaded: {propertiesError}
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
                      {property.location} · {property.views} views ·{" "}
                      {property.requests} requests
                    </p>
                    {property.moderationNotes ? (
                      <p className="mt-3 rounded-md bg-white px-4 py-3 text-sm font-semibold text-stone-700">
                        Moderation notes: {property.moderationNotes}
                      </p>
                    ) : null}
                    {property.moderationHistory.length > 0 ? (
                      <div className="mt-4 grid gap-2">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
                          Moderation history
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
                      Edit photos
                    </Link>
                    <Link
                      className="rounded-md bg-[#17130f] px-4 py-2 text-sm font-bold text-white"
                      href={`/hotels/${property.slug ?? "kok-tobe-skyline-residence"}`}
                    >
                      Preview
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8" id="add-property">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#a66f2d]">
              Add property
            </p>
            <h2 className="mt-2 text-3xl font-semibold">Listing flow placeholder</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {addPropertySteps.map((step, index) => (
                <article
                  className="rounded-lg border border-stone-200 bg-[#f6f3ed] p-5"
                  key={step}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2f4d46] text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold">{step}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    Placeholder form step for future owner onboarding.
                  </p>
                </article>
              ))}
            </div>
            <Link
              className="mt-6 inline-flex rounded-md bg-[#17130f] px-5 py-3 font-bold text-white"
              href="/dashboard/owner/properties/new"
            >
              Submit for moderation
            </Link>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8" id="requests">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#a66f2d]">
              Booking requests
            </p>
            <h2 className="mt-2 text-3xl font-semibold">Guest inquiries</h2>
            <div className="mt-6 grid gap-4">
              {ownerBookingRequests.map((request) => (
                <article
                  className="grid gap-4 rounded-lg border border-stone-200 bg-[#fbf8f1] p-5 xl:grid-cols-[1fr_auto] xl:items-center"
                  key={`${request.guest}-${request.dates}`}
                >
                  <div className="grid gap-3 md:grid-cols-5">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
                        Guest
                      </p>
                      <p className="mt-1 font-semibold">{request.guest}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
                        Dates
                      </p>
                      <p className="mt-1 font-semibold">{request.dates}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
                        Guests
                      </p>
                      <p className="mt-1 font-semibold">{request.guests}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
                        Room
                      </p>
                      <p className="mt-1 font-semibold">{request.room}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
                        Status
                      </p>
                      <div className="mt-1">
                        <StatusBadge status={request.status} />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Confirm", "Decline", "Message"].map((action) => (
                      <button
                        className={`rounded-md px-4 py-2 text-sm font-bold ${
                          action === "Confirm"
                            ? "bg-[#2f4d46] text-white"
                            : "border border-stone-300 bg-white"
                        }`}
                        key={action}
                        type="button"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8" id="billing">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#a66f2d]">
              Billing
            </p>
            <h2 className="mt-2 text-3xl font-semibold">Simple MVP pricing</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {ownerBillingPlans.map((plan) => (
                <article
                  className="rounded-lg border border-stone-200 bg-[#f6f3ed] p-5"
                  key={plan.name}
                >
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="mt-4 text-2xl font-bold text-[#2f4d46]">{plan.price}</p>
                  <p className="mt-3 text-sm leading-6 text-stone-600">{plan.note}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8" id="statistics">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#a66f2d]">
              Statistics
            </p>
            <h2 className="mt-2 text-3xl font-semibold">Performance snapshot</h2>
            <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_.8fr]">
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Views", value: "18 420" },
                  { label: "Inquiries", value: "126" },
                  { label: "Conversion rate", value: "6.8%" },
                ].map((stat) => (
                  <article className="rounded-lg bg-[#f6f3ed] p-5" key={stat.label}>
                    <p className="text-sm font-semibold text-stone-500">{stat.label}</p>
                    <p className="mt-3 text-3xl font-semibold">{stat.value}</p>
                  </article>
                ))}
              </div>
              <div className="rounded-lg bg-[#17130f] p-5 text-white">
                <h3 className="text-xl font-semibold">Top locations</h3>
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
