import type { Metadata } from "next";
import { cookies } from "next/headers";
import { I18nClientProvider } from "@/components/I18nClientProvider";
import type { Locale } from "@/i18n";
import "./globals.css";

export const metadata: Metadata = {
  title: "SteppeInn | Premium stays in Almaty",
  description:
    "SteppeInn helps travelers find hotels and hostels across Kazakhstan.",
};

const cookieName = "steppeinn_locale";

function normalizeLocale(value: string | undefined): Locale {
  return value === "ru" || value === "kz" ? value : "en";
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialLocale = normalizeLocale(cookieStore.get(cookieName)?.value);

  return (
    <html lang={initialLocale === "kz" ? "kk" : initialLocale}>
      <body>
        <I18nClientProvider initialLocale={initialLocale}>
          {children}
        </I18nClientProvider>
      </body>
    </html>
  );
}
