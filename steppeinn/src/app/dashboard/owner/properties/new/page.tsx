import Link from "next/link";
import { createOwnerPropertyAction } from "@/lib/actions/propertyActions";

const propertyTypes = ["Hotel", "Boutique hotel", "Apartment", "Guest house", "Resort"];

export default async function NewOwnerPropertyPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-[#f6f3ed] text-[#17130f]">
      <div className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link className="flex items-center gap-3" href="/dashboard/owner">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-[#2f4d46] text-lg font-black text-white shadow-lg">
              S
            </span>
            <span className="text-xl font-semibold tracking-[0.08em]">
              SteppeInn Owner
            </span>
          </Link>
          <Link className="font-bold text-[#2f4d46]" href="/dashboard/owner">
            Back to dashboard
          </Link>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[.7fr_1.3fr]">
        <section className="h-fit rounded-lg bg-[#17130f] p-6 text-white shadow-[0_28px_90px_rgba(34,28,18,.16)] sm:p-8 lg:sticky lg:top-6">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f0bb67]">
            Add property
          </p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">
            Submit a listing for moderation.
          </h1>
          <p className="mt-4 leading-7 text-white/68">
            This MVP form saves the core property profile to Supabase and keeps
            photos and videos as mock-only placeholders for now.
          </p>
          <div className="mt-8 rounded-lg border border-white/12 bg-white/10 p-5">
            <p className="text-sm font-bold text-white">Moderation state</p>
            <p className="mt-2 text-sm leading-6 text-white/62">
              New submissions are saved with pending status and assigned to the
              authenticated owner account.
            </p>
          </div>
        </section>

        <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#a66f2d]">
              Property profile
            </p>
            <h2 className="mt-2 text-3xl font-semibold">Basic details</h2>
          </div>

          {params.success ? (
            <div className="mt-6 rounded-lg border border-[#b8dcc7] bg-[#e9f8ee] px-5 py-4 font-semibold text-[#1f6b43]">
              Property submitted for moderation.
            </div>
          ) : null}

          {params.error ? (
            <div className="mt-6 rounded-lg border border-[#efc4bd] bg-[#fff0ed] px-5 py-4 font-semibold text-[#9b2d25]">
              {params.error}
            </div>
          ) : null}

          <form action={createOwnerPropertyAction} className="mt-6 grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Title">
                <input name="title" required className={inputClass} placeholder="Medeu Alpine Rooms" />
              </Field>
              <Field label="Property type">
                <select name="property_type" required className={inputClass} defaultValue="Hotel">
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="City">
                <input name="city" required className={inputClass} defaultValue="Almaty" />
              </Field>
              <Field label="Address">
                <input name="address" required className={inputClass} placeholder="Dostyk Avenue 85" />
              </Field>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Latitude">
                <input name="latitude" inputMode="decimal" className={inputClass} placeholder="43.2389" />
              </Field>
              <Field label="Longitude">
                <input name="longitude" inputMode="decimal" className={inputClass} placeholder="76.8897" />
              </Field>
            </div>

            <Field label="Short description">
              <input
                name="short_description"
                required
                className={inputClass}
                placeholder="Premium mountain-view stay near Medeu."
              />
            </Field>

            <Field label="Full description">
              <textarea
                name="description"
                required
                className={`${inputClass} min-h-36 resize-y`}
                placeholder="Describe the property, experience, service style, and neighborhood."
              />
            </Field>

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Amenities">
                <input
                  name="amenities"
                  className={inputClass}
                  placeholder="Wi-Fi, Parking, Breakfast, Mountain view"
                />
              </Field>
              <Field label="Starting price">
                <input
                  name="price_from"
                  required
                  type="number"
                  min="1"
                  className={inputClass}
                  placeholder="45000"
                />
              </Field>
            </div>

            <div className="rounded-lg border border-dashed border-stone-300 bg-[#fbf8f1] p-5">
              <p className="font-semibold">Photos and videos</p>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Media upload stays mock-only for Task 13. Files will be wired
                after storage policy and media tables are connected.
              </p>
            </div>

            <button
              className="rounded-md bg-[#17130f] px-5 py-3 font-bold text-white transition hover:bg-[#2f4d46]"
              type="submit"
            >
              Submit for moderation
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-md border border-stone-300 bg-white px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#2f4d46] focus:ring-2 focus:ring-[#2f4d46]/15";
