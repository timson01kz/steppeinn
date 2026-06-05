const statusStyles: Record<string, string> = {
  active: "bg-[#dff3e7] text-[#1f6b43]",
  approved: "bg-[#dff3e7] text-[#1f6b43]",
  visible: "bg-[#dff3e7] text-[#1f6b43]",
  published: "bg-[#dff3e7] text-[#1f6b43]",
  new: "bg-[#dff3e7] text-[#1f6b43]",
  pending: "bg-[#fff3d8] text-[#8a5a17]",
  changes: "bg-[#e3edf8] text-[#244d7a]",
  confirmed: "bg-[#e3edf8] text-[#244d7a]",
  completed: "bg-[#e3edf8] text-[#244d7a]",
  draft: "bg-stone-100 text-stone-700",
  cancelled: "bg-stone-100 text-stone-700",
  blocked: "bg-[#f7dfdc] text-[#9b2d25]",
  declined: "bg-[#f7dfdc] text-[#9b2d25]",
  expired: "bg-[#f7dfdc] text-[#9b2d25]",
  flagged: "bg-[#f7dfdc] text-[#9b2d25]",
  "needs reply": "bg-[#fff3d8] text-[#8a5a17]",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${
        statusStyles[status] ?? "bg-stone-100 text-stone-700"
      }`}
    >
      {status}
    </span>
  );
}

export function SectionHeader({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#a66f2d]">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-3xl font-semibold">{title}</h2>
    </div>
  );
}

export function FieldLabel({ label }: { label: string }) {
  return (
    <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
      {label}
    </p>
  );
}

export function DashboardField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <FieldLabel label={label} />
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
