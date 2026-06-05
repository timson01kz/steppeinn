import type { Metadata } from "next";
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
  return <html lang="en"><body>{children}</body></html>;
}
