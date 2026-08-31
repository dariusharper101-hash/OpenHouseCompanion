import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AGENT } from "@/config/agent";

const brandLine = AGENT.name
  ? `${AGENT.appName} — ${AGENT.name}${AGENT.brokerage ? `, ${AGENT.brokerage}` : ""}`
  : "Hop In Real Estate — Real Estate Done Right";
const brandDesc = AGENT.name
  ? `Expert real estate guidance for buyers, sellers, and investors across ${AGENT.serviceArea} with ${AGENT.name}${AGENT.brokerage ? ` of ${AGENT.brokerage}` : ""}. Know your programs, understand the process, and work with an agent who has your back.`
  : "Expert real estate guidance for buyers, sellers, and investors. Know your programs, understand the process, and work with an agent who has your back.";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(AGENT.siteUrl),
  title: brandLine,
  description: brandDesc,
  keywords: [
    `${AGENT.serviceArea} realtor`,
    `${AGENT.serviceArea} real estate agent`,
    "buy a home Dallas Fort Worth",
    "sell my home DFW",
    "first-time home buyer Texas",
    "DFW mortgage calculator",
    "how much home can I afford",
    "Texas VA FHA loan programs",
    AGENT.name,
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: brandLine,
    description: brandDesc,
    url: AGENT.siteUrl,
    siteName: AGENT.appName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: brandLine,
    description: brandDesc,
  },
};

// RealEstateAgent structured data — helps Google understand who this site is for
// and can surface a rich result (name, area, contact).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: AGENT.name || AGENT.appName,
  url: AGENT.siteUrl,
  ...(AGENT.phone ? { telephone: AGENT.phone } : {}),
  ...(AGENT.email ? { email: AGENT.email } : {}),
  areaServed: AGENT.serviceArea,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dallas–Fort Worth",
    addressRegion: "TX",
    addressCountry: "US",
  },
  ...(AGENT.brokerage ? { memberOf: { "@type": "Organization", name: AGENT.brokerage } } : {}),
  sameAs: [AGENT.socials.instagram, AGENT.socials.facebook].filter(Boolean),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-900 text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
