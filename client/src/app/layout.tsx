import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Container from "./components/common/Container";

// Load Poppins (for headings)
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Arial is a system font, no need to import
// We'll use it directly via CSS variable in globals.css

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
      <body className={`${poppins.variable} antialiased font-body`}>
        <Container>
          {children}
        </Container>
      </body>
    </html>
  );
}
