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
  title: brandLine,
  description: brandDesc,
  openGraph: {
    title: brandLine,
    description: brandDesc,
    type: "website",
  },
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
      <body className="min-h-full flex flex-col bg-slate-900 text-white">{children}</body>
    </html>
  );
}
