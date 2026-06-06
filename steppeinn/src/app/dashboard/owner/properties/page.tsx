import Link from "next/link";
import { StatusBadge } from "@/components/dashboard/DashboardPrimitives";
import {
  deletePropertyPhotoAction,
  markPrimaryPhotoAction,
  reorderPropertyPhotoAction,
  uploadPropertyPhotosAction,
} from "@/lib/actions/propertyMediaActions";
import {
  createPropertyRoomAction,
  deletePropertyRoomAction,
  updatePropertyRoomAction,
} from "@/lib/actions/propertyRoomActions";
import { getCurrentOwnerProperties } from "@/lib/services/propertyService";
import type { PropertyRoom } from "@/lib/services/propertyService";

export const dynamic = "force-dynamic";

export default async function OwnerPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{
    media_error?: string;
    media_success?: string;
    rooms_error?: string;
    rooms_success?: string;
  }>;
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

        {params.rooms_success ? (
          <div className="mt-6 rounded-lg border border-[#b8dcc7] bg-[#e9f8ee] px-5 py-4 text-sm font-semibold text-[#1f6b43]">
            {params.rooms_success}
          </div>
        ) : null}

        {params.media_error || params.rooms_error || error ? (
          <div className="mt-6 rounded-lg border border-[#efc4bd] bg-[#fff0ed] px-5 py-4 text-sm font-semibold text-[#9b2d25]">
            {params.media_error ?? params.rooms_error ?? error}
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

              <section className="mt-6 rounded-lg border border-stone-200 bg-[#fbf8f1] p-5">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#a66f2d]">
                    Rooms and pricing
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold">Room inventory</h3>
                </div>

                <RoomForm
                  action={createPropertyRoomAction}
                  propertyId={property.id}
                  submitLabel="Create room"
                />

                {property.rooms.length > 0 ? (
                  <div className="mt-6 grid gap-4">
                    {property.rooms.map((room) => (
                      <article
                        className="rounded-lg border border-stone-200 bg-white p-5"
                        key={room.id}
                      >
                        <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-start">
                          <div>
                            <div className="flex flex-wrap items-center gap-3">
                              <h4 className="text-xl font-semibold">{room.name}</h4>
                              <StatusBadge status={room.availabilityStatus} />
                            </div>
                            <p className="mt-2 text-sm font-semibold text-stone-600">
                              {room.roomType ?? "Room"} · {room.maxGuests} guests ·{" "}
                              {room.areaM2 ?? "-"} m2 · {room.quantity} units
                            </p>
                            {room.description ? (
                              <p className="mt-3 text-sm leading-6 text-stone-600">
                                {room.description}
                              </p>
                            ) : null}
                          </div>
                          <p className="text-xl font-bold text-[#2f4d46]">
                            {room.pricePerNight.toLocaleString("ru-RU")} KZT
                          </p>
                        </div>
                        <RoomForm
                          action={updatePropertyRoomAction}
                          propertyId={property.id}
                          room={room}
                          submitLabel="Save room"
                        />
                        <form action={deletePropertyRoomAction} className="mt-3">
                          <input name="property_id" type="hidden" value={property.id} />
                          <input name="room_id" type="hidden" value={room.id} />
                          <button
                            className="rounded-md border border-[#efc4bd] bg-white px-4 py-2 text-sm font-bold text-[#9b2d25]"
                            type="submit"
                          >
                            Delete room
                          </button>
                        </form>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="mt-6 rounded-lg border border-dashed border-stone-300 bg-white p-5 text-sm font-semibold text-stone-600">
                    No rooms yet. Add at least one room type so public hotel pages
                    can show real pricing and capacity.
                  </p>
                )}
              </section>

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

function RoomForm({
  action,
  propertyId,
  room,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  propertyId: string;
  room?: PropertyRoom;
  submitLabel: string;
}) {
  return (
    <form action={action} className="mt-5 grid gap-4 rounded-lg border border-stone-200 bg-white p-5">
      <input name="property_id" type="hidden" value={propertyId} />
      {room ? <input name="room_id" type="hidden" value={room.id} /> : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <RoomField label="Room name">
          <input
            className={roomInputClass}
            defaultValue={room?.name}
            name="room_name"
            placeholder="Panorama King Room"
            required
          />
        </RoomField>
        <RoomField label="Room type">
          <input
            className={roomInputClass}
            defaultValue={room?.roomType ?? ""}
            name="room_type"
            placeholder="Suite"
            required
          />
        </RoomField>
        <RoomField label="Bed type">
          <input
            className={roomInputClass}
            defaultValue={room?.bedType ?? ""}
            name="bed_type"
            placeholder="1 king bed"
            required
          />
        </RoomField>
        <RoomField label="Status">
          <select
            className={roomInputClass}
            defaultValue={room?.availabilityStatus ?? "available"}
            name="availability_status"
          >
            <option value="available">available</option>
            <option value="unavailable">unavailable</option>
          </select>
        </RoomField>
      </div>
      <RoomField label="Description">
        <textarea
          className={`${roomInputClass} min-h-24 resize-y`}
          defaultValue={room?.description ?? ""}
          name="description"
          placeholder="Short room description for guests."
        />
      </RoomField>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <RoomField label="Area m2">
          <input
            className={roomInputClass}
            defaultValue={room?.areaM2 ?? ""}
            min="1"
            name="area_m2"
            type="number"
          />
        </RoomField>
        <RoomField label="Max guests">
          <input
            className={roomInputClass}
            defaultValue={room?.maxGuests ?? 2}
            min="1"
            name="max_guests"
            required
            type="number"
          />
        </RoomField>
        <RoomField label="Quantity">
          <input
            className={roomInputClass}
            defaultValue={room?.quantity ?? 1}
            min="1"
            name="quantity"
            required
            type="number"
          />
        </RoomField>
        <RoomField label="Price per night">
          <input
            className={roomInputClass}
            defaultValue={room?.pricePerNight ?? ""}
            min="1"
            name="price_per_night"
            placeholder="52000"
            required
            type="number"
          />
        </RoomField>
      </div>
      <button
        className="w-fit rounded-md bg-[#17130f] px-5 py-3 text-sm font-bold text-white"
        type="submit"
      >
        {submitLabel}
      </button>
    </form>
  );
}

function RoomField({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
        {label}
      </span>
      {children}
    </label>
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

const roomInputClass =
  "rounded-md border border-stone-300 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#2f4d46]";
