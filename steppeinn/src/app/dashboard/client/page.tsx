import Link from "next/link";
import {
  DashboardField,
  FieldLabel,
  SectionHeader,
  StatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import { HotelCard } from "@/components/HotelCard";
import { clientBookings } from "@/data/bookings";
import { favoriteHotels } from "@/data/hotels";
import {
  clientNotifications,
  clientProfile,
  clientStats,
  supportFaqs,
} from "@/data/users";

const sidebarItems = [
  { label: "Overview", href: "#overview" },
  { label: "My bookings", href: "#bookings" },
  { label: "Favorites", href: "#favorites" },
  { label: "Profile", href: "#profile" },
  { label: "Notifications", href: "#notifications" },
  { label: "Support", href: "#support" },
];

export default function ClientDashboardPage() {
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
            href="/hotels"
          >
            Find hotels
          </Link>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-lg border border-stone-200 bg-white p-4 shadow-sm lg:sticky lg:top-6">
          <p className="px-3 text-xs font-bold uppercase tracking-[0.18em] text-[#a66f2d]">
            Client dashboard
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
            <p className="text-sm font-bold">Mock account</p>
            <p className="mt-2 text-sm leading-6 text-white/62">
              Booking data, favorites, profile, and support messages are local
              mock content only.
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
            <h1 className="mt-3 text-4xl font-semibold sm:text-6xl">
              Your Almaty trips.
            </h1>
            <p className="mt-4 max-w-3xl leading-7 text-white/68">
              Track booking requests, saved hotels, profile preferences, and
              support messages in one client workspace.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {clientStats.map((stat) => (
                <article className="rounded-lg border border-white/12 bg-white/10 p-5" key={stat.label}>
                  <p className="text-sm font-semibold text-white/62">{stat.label}</p>
                  <p className="mt-3 text-3xl font-semibold">{stat.value}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8" id="bookings">
            <SectionHeader eyebrow="My bookings" title="Requests and stays" />
            <div className="mt-6 grid gap-4">
              {clientBookings.map((booking) => (
                <article
                  className="grid gap-4 rounded-lg border border-stone-200 bg-[#fbf8f1] p-5 xl:grid-cols-[1fr_auto] xl:items-center"
                  key={`${booking.hotel}-${booking.dates}`}
                >
                  <div className="grid gap-3 md:grid-cols-5">
                    <DashboardField label="Hotel" value={booking.hotel} />
                    <DashboardField label="Dates" value={booking.dates} />
                    <DashboardField label="Guests" value={booking.guests} />
                    <DashboardField label="Room" value={booking.room} />
                    <div>
                      <FieldLabel label="Status" />
                      <div className="mt-1">
                        <StatusBadge status={booking.status} />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["View details", "Cancel request", "Contact hotel"].map((action) => (
                      <button
                        className={`rounded-md px-4 py-2 text-sm font-bold ${
                          action === "View details"
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

          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8" id="favorites">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <SectionHeader eyebrow="Favorites" title="Saved hotels" />
              <Link className="font-bold text-[#2f4d46]" href="/hotels">
                Explore more
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
                    Remove from favorites
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
                  {item.label}
                  <input
                    className="h-12 rounded-md border border-stone-300 bg-[#fbf8f1] px-4 font-normal outline-none"
                    defaultValue={item.value}
                  />
                </label>
              ))}
            </div>
            <button className="mt-6 rounded-md bg-[#17130f] px-5 py-3 font-bold text-white" type="button">
              Save mock profile
            </button>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8" id="notifications">
            <SectionHeader eyebrow="Notifications" title="Recent updates" />
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {clientNotifications.map((notification) => (
                <article className="rounded-lg border border-stone-200 bg-[#fbf8f1] p-5" key={notification.type}>
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#a66f2d]">
                    {notification.type}
                  </p>
                  <p className="mt-3 leading-7 text-stone-700">{notification.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8" id="support">
            <SectionHeader eyebrow="Support" title="Need help?" />
            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_.9fr]">
              <form className="grid gap-4 rounded-lg bg-[#fbf8f1] p-5">
                <label className="grid gap-2 text-sm font-bold">
                  Subject
                  <input className="h-12 rounded-md border border-stone-300 px-4 font-normal outline-none" />
                </label>
                <label className="grid gap-2 text-sm font-bold">
                  Message
                  <textarea
                    className="min-h-36 rounded-md border border-stone-300 p-4 font-normal outline-none"
                    placeholder="Tell SteppeInn support what happened"
                  />
                </label>
                <button className="h-12 rounded-md bg-[#17130f] font-bold text-white" type="button">
                  Send support request
                </button>
              </form>
              <div className="grid gap-3">
                {supportFaqs.map((faq) => (
                  <article className="rounded-lg border border-stone-200 bg-[#fbf8f1] p-5" key={faq}>
                    <h3 className="font-semibold">{faq}</h3>
                    <p className="mt-2 text-sm leading-6 text-stone-600">
                      Placeholder answer for the MVP support knowledge base.
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
