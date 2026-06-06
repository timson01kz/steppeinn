import Link from "next/link";
import { BookingRequestForm } from "@/components/BookingRequestForm";
import { StatusBadge } from "@/components/dashboard/DashboardPrimitives";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HotelCard } from "@/components/HotelCard";
import { SectionTitle } from "@/components/SectionTitle";
import { hotelDetail, hotelReviews, rooms, similarHotels } from "@/data/hotels";
import { hotelNearbyPlaces } from "@/data/locations";
import { getPublishedPropertyDetail } from "@/lib/services/propertyService";

type HotelDetailsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatTitleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function HotelDetailsPage({ params }: HotelDetailsPageProps) {
  const { slug } = await params;
  const { data: publishedProperty } = await getPublishedPropertyDetail(slug);
  const displayName =
    publishedProperty?.name ??
    (slug === hotelDetail.slug
      ? hotelDetail.name
      : `${formatTitleFromSlug(slug)} (Mock Hotel)`);
  const detail = {
    type: publishedProperty?.type ?? hotelDetail.type,
    address: publishedProperty?.address ?? hotelDetail.address,
    rating: publishedProperty?.rating ?? hotelDetail.rating,
    price: publishedProperty?.price ?? hotelDetail.price,
    description: publishedProperty?.description ?? hotelDetail.description,
    amenities:
      publishedProperty && publishedProperty.amenities.length > 0
        ? publishedProperty.amenities
        : hotelDetail.amenities,
  };
  const realPhotos = publishedProperty?.photos ?? [];
  const displayRooms =
    publishedProperty && publishedProperty.rooms.length > 0
      ? publishedProperty.rooms.map((room, index) => ({
          id: room.id,
          name: room.name,
          imageClass: rooms[index % rooms.length].imageClass,
          capacity: `${room.maxGuests} guests`,
          bed: room.bedType ?? "Bed type on request",
          size: room.areaM2 ? `${room.areaM2} m2` : "Size on request",
          price: `${room.pricePerNight.toLocaleString("ru-RU")} KZT`,
          description: room.description,
          quantity: room.quantity,
          availabilityStatus: room.availabilityStatus,
        }))
      : rooms.map((room) => ({
          id: room.name,
          ...room,
          description: null,
          quantity: null,
          availabilityStatus: "available" as const,
        }));

  return (
    <main className="min-h-screen bg-[#f6f3ed] pb-24 text-[#17130f] lg:pb-0">
      <Header />

      <section className="mx-auto w-full max-w-7xl px-5 pb-8 pt-8 sm:px-8">
        <Link className="text-sm font-bold text-[#2f4d46]" href="/hotels">
          Back to hotels
        </Link>
        <div className="mt-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#a66f2d]">
              {detail.type}
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-6xl">
              {displayName}
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-stone-600">
              {detail.address}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm">
              Rating {detail.rating}
            </span>
            <span className="rounded-full bg-[#2f4d46] px-4 py-2 text-sm font-bold text-white shadow-sm">
              from {detail.price}
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-3 px-5 sm:px-8 lg:grid-cols-[1.4fr_.6fr]">
        <div
          className={`relative min-h-[430px] rounded-lg ${
            realPhotos[0] ? "bg-cover bg-center" : hotelDetail.gallery[0]
          } shadow-[0_28px_90px_rgba(34,28,18,.14)]`}
          style={realPhotos[0] ? { backgroundImage: `url(${realPhotos[0].url})` } : undefined}
        >
          <div className="absolute inset-0 rounded-lg bg-[linear-gradient(180deg,rgba(0,0,0,0)_42%,rgba(0,0,0,.42)_100%)]" />
          <button className="absolute bottom-5 right-5 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#17130f] shadow-lg" type="button">
            Show all photos
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {hotelDetail.gallery.slice(1).map((imageClass, index) => (
            <button
              className={`min-h-[205px] rounded-lg transition hover:scale-[1.02] ${
                realPhotos[index + 1] ? "bg-cover bg-center" : imageClass
              }`}
              key={realPhotos[index + 1]?.id ?? imageClass}
              style={
                realPhotos[index + 1]
                  ? { backgroundImage: `url(${realPhotos[index + 1].url})` }
                  : undefined
              }
              type="button"
            >
              <span className="sr-only">Gallery thumbnail {index + 1}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_380px]">
        <div className="grid gap-12">
          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <SectionTitle
              description={detail.description}
              eyebrow="Hotel overview"
              title="Premium city comfort with mountain energy."
            />
            <div className="mt-8 flex flex-wrap gap-2">
              {detail.amenities.map((amenity) => (
                <span
                  className="rounded-full border border-stone-200 bg-[#f6f3ed] px-4 py-2 text-sm font-semibold"
                  key={amenity}
                >
                  {amenity}
                </span>
              ))}
            </div>
          </section>

          <section>
            <SectionTitle
              description="Video modules are placeholders for future media uploads."
              eyebrow="Video"
              title="See the stay before booking."
            />
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {["Hotel overview video", "Room video"].map((label) => (
                <div
                  className="grid min-h-72 place-items-center rounded-lg bg-[#17130f] text-center text-white shadow-[0_20px_70px_rgba(34,28,18,.16)]"
                  key={label}
                >
                  <div>
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white text-[#17130f]">
                      Play
                    </div>
                    <p className="mt-5 text-xl font-semibold">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <SectionTitle
              description={
                publishedProperty && publishedProperty.rooms.length > 0
                  ? "Real room types and pricing loaded from Supabase."
                  : "Mock room types with practical booking details."
              }
              eyebrow="Rooms"
              title="Choose your room."
            />
            <div className="mt-8 grid gap-5">
              {displayRooms.map((room) => (
                <article
                  className="grid overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm md:grid-cols-[260px_1fr]"
                  key={room.id}
                >
                  <div className={`min-h-64 ${room.imageClass}`} />
                  <div className="p-6">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-2xl font-semibold">{room.name}</h3>
                          <StatusBadge status={room.availabilityStatus} />
                        </div>
                        <div className="mt-4 grid gap-2 text-sm font-semibold text-stone-600 sm:grid-cols-3">
                          <p>{room.capacity}</p>
                          <p>{room.bed}</p>
                          <p>{room.size}</p>
                        </div>
                        {room.description ? (
                          <p className="mt-4 text-sm leading-6 text-stone-600">
                            {room.description}
                          </p>
                        ) : null}
                        {room.quantity ? (
                          <p className="mt-3 text-sm font-semibold text-stone-500">
                            {room.quantity} rooms in inventory
                          </p>
                        ) : null}
                      </div>
                      <p className="text-xl font-bold text-[#2f4d46]">{room.price}</p>
                    </div>
                    <button
                      className="mt-7 h-12 rounded-md bg-[#17130f] px-6 font-bold text-white transition hover:bg-[#2f4d46]"
                      type="button"
                    >
                      Request this room
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section>
            <SectionTitle
              description="Distances are mock values for the first version."
              eyebrow="What is nearby"
              title="Almaty highlights around the stay."
            />
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {hotelNearbyPlaces.map((place) => (
                <div
                  className="flex items-center justify-between rounded-lg border border-stone-200 bg-white p-5 shadow-sm"
                  key={place.name}
                >
                  <span className="font-semibold">{place.name}</span>
                  <span className="text-sm font-bold text-[#2f4d46]">
                    {place.distance}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <SectionTitle
              description="Map integration is intentionally deferred until data and provider decisions are ready."
              eyebrow="Map"
              title="Location preview."
            />
            <div className="relative mt-8 min-h-[420px] overflow-hidden rounded-lg border border-stone-200 bg-[#dde8df] shadow-[0_28px_90px_rgba(34,28,18,.12)]">
              <div className="absolute inset-0 city-map-grid" />
              <div className="absolute left-[18%] top-[30%] h-2 w-[68%] rotate-[24deg] rounded-full bg-white/70" />
              <div className="absolute left-[22%] top-[58%] h-2 w-[62%] -rotate-[11deg] rounded-full bg-white/70" />
              <div className="absolute left-[54%] top-[39%] h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#f0bb67] shadow-[0_0_0_12px_rgba(240,187,103,.24)]" />
            </div>
          </section>

          <section>
            <SectionTitle
              description="Mock guest sentiment for product layout validation."
              eyebrow="Reviews"
              title="Loved by city explorers."
            />
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {hotelReviews.map((review) => (
                <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm" key={review.author}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{review.author}</h3>
                    <span className="rounded-full bg-[#f6f3ed] px-3 py-1 text-sm font-bold">
                      {review.rating}
                    </span>
                  </div>
                  <p className="mt-4 leading-7 text-stone-600">{review.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section>
            <SectionTitle
              description="More mock stays from the same discovery surface."
              eyebrow="Similar hotels"
              title="Keep exploring Almaty."
            />
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {similarHotels.map((similarHotel) => (
                <HotelCard hotel={similarHotel} key={similarHotel.slug} />
              ))}
            </div>
          </section>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-6 rounded-lg border border-stone-200 bg-white p-6 shadow-[0_24px_80px_rgba(34,28,18,.14)]">
            <BookingRequestForm />
          </div>
        </aside>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white p-4 shadow-[0_-18px_60px_rgba(34,28,18,.14)] lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-stone-500">
              from
            </p>
            <p className="text-lg font-bold text-[#2f4d46]">{detail.price}</p>
          </div>
          <a
            className="flex h-12 items-center justify-center rounded-md bg-[#17130f] px-6 font-bold text-white"
            href="#booking-request"
          >
            Request booking
          </a>
        </div>
      </div>

      <Footer />
    </main>
  );
}
