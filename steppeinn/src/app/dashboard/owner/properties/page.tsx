import Link from "next/link";
import { StatusBadge } from "@/components/dashboard/DashboardPrimitives";
import {
  deletePropertyPhotoAction,
  markPrimaryPhotoAction,
  reorderPropertyPhotoAction,
  uploadPropertyPhotosAction,
} from "@/lib/actions/propertyMediaActions";
import { getCurrentOwnerProperties } from "@/lib/services/propertyService";

export const dynamic = "force-dynamic";

export default async function OwnerPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ media_error?: string; media_success?: string }>;
}) {
  const params = await searchParams;
  const { data: properties, error } = await getCurrentOwnerProperties();

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
          <Link className="font-bold text-[#2f4d46]" href="/dashboard/owner/properties/new">
            Add property
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <section className="rounded-lg bg-[#17130f] p-6 text-white shadow-[0_28px_90px_rgba(34,28,18,.16)] sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f0bb67]">
            Property photos
          </p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">
            Upload real listing images.
          </h1>
          <p className="mt-4 max-w-3xl leading-7 text-white/68">
            Photos are stored in Supabase Storage and saved to property_media.
            Videos remain mock-only for now.
          </p>
        </section>

        {params.media_success ? (
          <div className="mt-6 rounded-lg border border-[#b8dcc7] bg-[#e9f8ee] px-5 py-4 text-sm font-semibold text-[#1f6b43]">
            {params.media_success}
          </div>
        ) : null}

        {params.media_error || error ? (
          <div className="mt-6 rounded-lg border border-[#efc4bd] bg-[#fff0ed] px-5 py-4 text-sm font-semibold text-[#9b2d25]">
            {params.media_error ?? error}
          </div>
        ) : null}

        <div className="mt-8 grid gap-6">
          {properties.map((property) => (
            <article
              className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
              key={property.id}
            >
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-semibold">{property.name}</h2>
                    <StatusBadge status={property.status} />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-stone-600">
                    {property.location}
                  </p>
                </div>
                <Link
                  className="rounded-md bg-[#17130f] px-4 py-2 text-sm font-bold text-white"
                  href={`/hotels/${property.slug}`}
                >
                  Preview
                </Link>
              </div>

              <form action={uploadPropertyPhotosAction} className="mt-6 grid gap-4 rounded-lg bg-[#fbf8f1] p-5">
                <input name="property_id" type="hidden" value={property.id} />
                <div className="grid gap-4 md:grid-cols-[1fr_.8fr_auto] md:items-end">
                  <label className="grid gap-2">
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
                      Photos
                    </span>
                    <input
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      className="rounded-md border border-stone-300 bg-white px-4 py-3 text-sm font-semibold"
                      multiple
                      name="photos"
                      required
                      type="file"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
                      Alt text
                    </span>
                    <input
                      className="rounded-md border border-stone-300 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#2f4d46]"
                      name="alt_text"
                      placeholder="Hotel exterior in Almaty"
                    />
                  </label>
                  <button className="rounded-md bg-[#2f4d46] px-5 py-3 text-sm font-bold text-white" type="submit">
                    Upload photos
                  </button>
                </div>
                <p className="text-sm font-semibold text-stone-600">
                  JPG, JPEG, PNG, or WEBP only. Maximum 5MB per image.
                </p>
              </form>

              {property.photos.length > 0 ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {property.photos.map((photo, index) => (
                    <div
                      className="overflow-hidden rounded-lg border border-stone-200 bg-[#fbf8f1]"
                      key={photo.id}
                    >
                      <div
                        className="min-h-56 bg-cover bg-center"
                        style={{ backgroundImage: `url(${photo.url})` }}
                      />
                      <div className="grid gap-3 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-stone-600">
                            Sort {photo.sortOrder}
                          </p>
                          {photo.isPrimary ? <StatusBadge status="primary" /> : null}
                        </div>
                        {photo.altText ? (
                          <p className="text-sm text-stone-600">{photo.altText}</p>
                        ) : null}
                        <div className="flex flex-wrap gap-2">
                          {!photo.isPrimary ? (
                            <PhotoAction
                              action={markPrimaryPhotoAction}
                              label="Primary"
                              photoId={photo.id}
                              propertyId={property.id}
                            />
                          ) : null}
                          <PhotoAction
                            action={reorderPropertyPhotoAction}
                            direction="up"
                            disabled={index === 0}
                            label="Up"
                            photoId={photo.id}
                            propertyId={property.id}
                          />
                          <PhotoAction
                            action={reorderPropertyPhotoAction}
                            direction="down"
                            disabled={index === property.photos.length - 1}
                            label="Down"
                            photoId={photo.id}
                            propertyId={property.id}
                          />
                          <PhotoAction
                            action={deletePropertyPhotoAction}
                            label="Delete"
                            photoId={photo.id}
                            propertyId={property.id}
                            tone="danger"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-6 rounded-lg border border-dashed border-stone-300 bg-[#fbf8f1] p-5 text-sm font-semibold text-stone-600">
                  No real photos uploaded yet. Public pages will use mock fallback
                  images until the first photo is added.
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

function PhotoAction({
  action,
  direction,
  disabled,
  label,
  photoId,
  propertyId,
  tone,
}: {
  action: (formData: FormData) => Promise<void>;
  direction?: "up" | "down";
  disabled?: boolean;
  label: string;
  photoId: string;
  propertyId: string;
  tone?: "danger";
}) {
  return (
    <form action={action}>
      <input name="property_id" type="hidden" value={propertyId} />
      <input name="photo_id" type="hidden" value={photoId} />
      {direction ? <input name="direction" type="hidden" value={direction} /> : null}
      <button
        className={`rounded-md px-3 py-2 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-40 ${
          tone === "danger"
            ? "border border-[#efc4bd] bg-white text-[#9b2d25]"
            : "border border-stone-300 bg-white text-[#17130f]"
        }`}
        disabled={disabled}
        type="submit"
      >
        {label}
      </button>
    </form>
  );
}
