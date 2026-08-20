import { Bebas_Neue, IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const ibm = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-ibm",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "roastmeonsol — Roast My Wallet",
  description: "Paste a Solana wallet. Find out how badly you degen. Nothing is saved.",
  openGraph: {
    title: "roastmeonsol — Roast My Wallet",
    description: "Find out how badly you degen.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "roastmeonsol — Roast My Wallet",
    description: "Find out how badly you degen.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${bebas.variable} ${ibm.variable}`}>
      <body className="dots bg-rm-bg text-rm-text antialiased">{children}</body>
    </html>
  );
}
