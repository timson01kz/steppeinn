"use client";

import { useState } from "react";

export function BookingRequestForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
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
        <button
          className="h-11 rounded-md border border-[#2f4d46] bg-white px-4 font-bold text-[#2f4d46]"
          onClick={() => setSent(false)}
          type="button"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form
      className="grid gap-4"
      id="booking-request"
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#a66f2d]">
          Booking request
        </p>
        <h2 className="mt-2 text-2xl font-semibold">Send a request</h2>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Mock form only. No database or Supabase connection yet.
        </p>
      </div>
      {[
        { label: "Name", type: "text" },
        { label: "Phone", type: "tel" },
        { label: "Email", type: "email" },
      ].map((field) => (
        <label className="grid gap-2 text-sm font-bold" key={field.label}>
          {field.label}
          <input
            className="h-12 rounded-md border border-stone-300 px-4 font-normal outline-none focus:border-[#2f4d46]"
            placeholder={field.label}
            required
            type={field.type}
          />
        </label>
      ))}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <label className="grid gap-2 text-sm font-bold">
          Check-in date
          <input
            className="h-12 rounded-md border border-stone-300 px-4 font-normal outline-none focus:border-[#2f4d46]"
            required
            type="date"
          />
        </label>
        <label className="grid gap-2 text-sm font-bold">
          Check-out date
          <input
            className="h-12 rounded-md border border-stone-300 px-4 font-normal outline-none focus:border-[#2f4d46]"
            required
            type="date"
          />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-bold">
        Guests
        <select className="h-12 rounded-md border border-stone-300 px-4 font-normal outline-none focus:border-[#2f4d46]">
          <option>2 guests</option>
          <option>1 guest</option>
          <option>3 guests</option>
          <option>4 guests</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm font-bold">
        Comment
        <textarea
          className="min-h-28 rounded-md border border-stone-300 p-4 font-normal outline-none focus:border-[#2f4d46]"
          placeholder="Arrival time, room preference, or special requests"
        />
      </label>
      <button
        className="h-12 rounded-md bg-[#17130f] font-bold text-white transition hover:bg-[#2f4d46]"
        type="submit"
      >
        Send booking request
      </button>
    </form>
  );
}
