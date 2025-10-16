import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HuddleUp — Social Impact Events",
  description:
    "HuddleUp Protocol — create, fund, verify and reward participants for social cause events. Sponsors deposit PYUSD, Organizers create events and verify attendance, Participants register and receive instant PYUSD rewards upon verification.",
  keywords: [
    "HuddleUp",
    "social impact",
    "PYUSD",
    "event verification",
    "crypto sponsorship",
    "escrow",
    "QR verification",
    "blockchain",
  ],
  authors: [{ name: "HuddleUp Team" }],
  openGraph: {
    title: "HuddleUp — Social Impact Events",
    description:
      "Create, fund and verify social cause events. Sponsors deposit PYUSD; Organizers verify attendees; Participants receive instant PYUSD rewards.",
    siteName: "HuddleUp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
