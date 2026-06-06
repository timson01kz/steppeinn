import type { Metadata } from "next";
import { I18nClientProvider } from "@/components/I18nClientProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "SteppeInn | Premium stays in Almaty",
  description:
    "SteppeInn MVP shell for premium travel stays, maps, and hotel partners in Almaty.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <I18nClientProvider>{children}</I18nClientProvider>
      </body>
    </html>
  );
}
