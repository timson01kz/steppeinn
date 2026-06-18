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

type HeaderAccount = {
  displayName: string;
  role: UserRole;
};

export function HeaderAuthActions({ overlay = false }: HeaderAuthActionsProps) {
  const { translate } = useI18n();
  const [account, setAccount] = useState<HeaderAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      try {
        const supabase = createBrowserSupabaseClient();

        if (!supabase) {
          if (active) {
            setAccount(null);
            setIsLoading(false);
          }
          return;
        }

        const { data } = await supabase.auth.getUser();

        if (!active) {
          return;
        }

        if (!data.user) {
          setAccount(null);
          setIsLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, role")
          .eq("id", data.user.id)
          .single();

        if (active) {
          const emailPrefix = data.user.email?.split("@")[0] ?? "Account";
          setAccount({
            displayName: profile?.full_name?.trim() || emailPrefix,
            role: profile?.role ?? "client",
          });
          setIsLoading(false);
        }
      } catch {
        if (active) {
          setAccount(null);
          setIsLoading(false);
        }
      }
    }

    loadUser();

    const supabase = createBrowserSupabaseClient();
    const subscription = supabase
      ? supabase.auth.onAuthStateChange(() => {
          loadUser();
        }).data.subscription
      : null;

    return () => {
      active = false;
      subscription?.unsubscribe();
    };
  }, []);

  const buttonClass = `rounded-full px-5 py-2.5 text-sm font-bold shadow-sm transition ${
    overlay
      ? "bg-white text-[#1f4d43] hover:bg-[#f4ead9]"
      : "bg-[#17130f] text-white hover:bg-[#2f4d46]"
  }`;

  if (isLoading) {
    return (
      <span
        className={`inline-flex h-10 w-24 rounded-full ${
          overlay ? "bg-white/18" : "bg-stone-200"
        }`}
        aria-hidden="true"
      />
    );
  }

  if (!account) {
    return (
      <Link className={buttonClass} href="/login">
        {translate("Login")}
      </Link>
    );
  }

  const dashboardHref = roleHome[account.role];
  const ownerMenu = account.role === "owner";

  return (
    <details className="group relative">
      <summary className={`${buttonClass} flex cursor-pointer list-none items-center gap-2`}>
        <span className="max-w-32 truncate sm:max-w-44">{account.displayName}</span>
        <span aria-hidden="true" className="text-xs">▾</span>
      </summary>
      <div
        className={`absolute right-0 mt-3 w-56 rounded-lg border p-2 text-sm font-semibold shadow-[0_24px_70px_rgba(23,19,15,.18)] ${
          overlay
            ? "border-white/20 bg-[#17130f] text-white"
            : "border-stone-200 bg-white text-[#17130f]"
        }`}
      >
        {ownerMenu ? (
          <>
            <HeaderMenuLink href="/dashboard/owner" label={translate("dashboard.owner.menu.dashboard")} />
            <HeaderMenuLink href="/dashboard/owner#properties" label={translate("dashboard.owner.menu.properties")} />
            <HeaderMenuLink href="/dashboard/owner/properties/new" label={translate("dashboard.owner.menu.addProperty")} />
            <HeaderMenuLink href="/dashboard/owner#billing" label={translate("dashboard.owner.menu.tariffs")} />
          </>
        ) : (
          <>
            <HeaderMenuLink href={dashboardHref} label={translate("My dashboard")} />
            <HeaderMenuLink href="/dashboard/client#bookings" label={translate("My bookings")} />
            <HeaderMenuLink href="/dashboard/client#favorites" label={translate("Favorites")} />
            <HeaderMenuLink href="/dashboard/client#profile" label={translate("Profile")} />
          </>
        )}
        <button
          className={`mt-1 w-full rounded-md px-3 py-2 text-left transition ${
            overlay ? "hover:bg-white/10" : "hover:bg-[#f6f3ed]"
          }`}
          onClick={async () => {
            const supabase = createBrowserSupabaseClient();
            await supabase?.auth.signOut();
            window.location.assign("/");
          }}
          type="button"
        >
          {translate("Sign out")}
        </button>
      </div>
    </details>
  );
}

function HeaderMenuLink({ href, label }: { href: string; label: string }) {
  return (
    <Link className="block rounded-md px-3 py-2 transition hover:bg-[#f6f3ed] hover:text-[#17130f]" href={href}>
      {label}
    </Link>
  );
}
