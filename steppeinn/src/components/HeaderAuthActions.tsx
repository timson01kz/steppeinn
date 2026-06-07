"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { UserRole } from "@/lib/auth/roles";
import { roleHome } from "@/lib/auth/roles";
import { useI18n } from "@/i18n";

type HeaderAuthActionsProps = {
  overlay?: boolean;
};

export function HeaderAuthActions({ overlay = false }: HeaderAuthActionsProps) {
  const { translate } = useI18n();
  const [role, setRole] = useState<UserRole | null>(null);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      try {
        const supabase = createBrowserSupabaseClient();
        const { data } = await supabase.auth.getUser();

        if (!active || !data.user) {
          return;
        }

        setIsAuthed(true);

        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        if (active) {
          setRole(profile?.role ?? "client");
        }
      } catch {
        if (active) {
          setIsAuthed(false);
          setRole(null);
        }
      }
    }

    loadUser();

    return () => {
      active = false;
    };
  }, []);

  const buttonClass = `rounded-full px-5 py-2.5 text-sm font-bold shadow-sm transition ${
    overlay
      ? "bg-white text-[#1f4d43] hover:bg-[#f4ead9]"
      : "bg-[#17130f] text-white hover:bg-[#2f4d46]"
  }`;

  if (!isAuthed) {
    return (
      <Link className={buttonClass} href="/login">
        {translate("Login")}
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link className={buttonClass} href={role ? roleHome[role] : "/dashboard/client"}>
        {translate("Dashboard")}
      </Link>
      <button
        className={`hidden rounded-full px-4 py-2.5 text-sm font-bold md:inline-flex ${
          overlay
            ? "border border-white/35 text-white"
            : "border border-stone-300 text-[#17130f]"
        }`}
        onClick={async () => {
          const supabase = createBrowserSupabaseClient();
          await supabase.auth.signOut();
          window.location.assign("/");
        }}
        type="button"
      >
        {translate("Sign out")}
      </button>
    </div>
  );
}
