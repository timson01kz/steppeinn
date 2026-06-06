import { createBookingRequestAction } from "@/lib/actions/bookingActions";

type BookingRoomOption = {
  id: string;
  name: string;
  price: string;
};

type BookingRequestFormProps = {
  bookingError?: string;
  bookingSuccess?: boolean;
  propertyId?: string;
  returnPath: string;
  rooms: BookingRoomOption[];
};

export function BookingRequestForm({
  bookingError,
  bookingSuccess,
  propertyId,
  returnPath,
  rooms,
}: BookingRequestFormProps) {
  if (bookingSuccess) {
    return (
      <div
        className="grid gap-4 rounded-lg border border-[#b8dfc7] bg-[#eef8f1] p-5"
        id="booking-request"
      >
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1f6b43]">
          Request sent
        </p>
        <h2 className="text-2xl font-semibold text-[#17130f]">
          Your booking request has been sent.
        </h2>
        <p className="leading-7 text-stone-700">
          The hotel will confirm availability soon.
        </p>
      </div>
    );
  }

  return (
    <form action={createBookingRequestAction} className="grid gap-4" id="booking-request">
      <input name="property_id" type="hidden" value={propertyId ?? ""} />
      <input name="return_path" type="hidden" value={returnPath} />
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#a66f2d]">
          Booking request
        </p>
        <h2 className="mt-2 text-2xl font-semibold">Send a request</h2>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Authenticated clients can send pending booking requests. Payment stays
          disabled.
        </p>
      </div>
      {bookingError ? (
        <div className="rounded-lg border border-[#efc4bd] bg-[#fff0ed] px-4 py-3 text-sm font-semibold text-[#9b2d25]">
          {bookingError}
        </div>
      ) : null}
      {!propertyId ? (
        <div className="rounded-lg border border-stone-200 bg-[#fbf8f1] px-4 py-3 text-sm font-semibold text-stone-600">
          Real booking requests are available for published Supabase properties.
        </div>
      ) : null}
      {[
        { label: "Name", name: "guest_name", type: "text" },
        { label: "Phone", name: "phone", type: "tel" },
        { label: "Email", name: "email", type: "email" },
      ].map((field) => (
        <label className="grid gap-2 text-sm font-bold" key={field.name}>
          {field.label}
          <input
            className="h-12 rounded-md border border-stone-300 px-4 font-normal outline-none focus:border-[#2f4d46]"
            name={field.name}
            placeholder={field.label}
            required={field.name === "guest_name"}
            type={field.type}
          />
        </label>
      ))}
      <label className="grid gap-2 text-sm font-bold">
        Room
        <select
          className="h-12 rounded-md border border-stone-300 px-4 font-normal outline-none focus:border-[#2f4d46]"
          name="room_id"
        >
          <option value="">Let hotel assign a room</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name} · {room.price}
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <label className="grid gap-2 text-sm font-bold">
          Check-in date
          <input
            className="h-12 rounded-md border border-stone-300 px-4 font-normal outline-none focus:border-[#2f4d46]"
            name="check_in"
            required
            type="date"
          />
        </label>
        <label className="grid gap-2 text-sm font-bold">
          Check-out date
          <input
            className="h-12 rounded-md border border-stone-300 px-4 font-normal outline-none focus:border-[#2f4d46]"
            name="check_out"
            required
            type="date"
          />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-bold">
        Guests
        <select
          className="h-12 rounded-md border border-stone-300 px-4 font-normal outline-none focus:border-[#2f4d46]"
          name="guests"
        >
          <option value="2">2 guests</option>
          <option value="1">1 guest</option>
          <option value="3">3 guests</option>
          <option value="4">4 guests</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm font-bold">
        Special requests
        <textarea
          className="min-h-28 rounded-md border border-stone-300 p-4 font-normal outline-none focus:border-[#2f4d46]"
          name="special_requests"
          placeholder="Arrival time, room preference, or special requests"
        />
      </label>
      <button
        className="h-12 rounded-md bg-[#17130f] font-bold text-white transition enabled:hover:bg-[#2f4d46] disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!propertyId}
        type="submit"
      >
        Send booking request
      </button>
    </form>
  );
}
