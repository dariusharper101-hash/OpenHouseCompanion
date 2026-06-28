import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Open House Companion — Real Estate Done Right",
  description:
    "Expert real estate guidance for buyers, sellers, and investors. Know your programs, understand the process, and work with an agent who has your back.",
  openGraph: {
    title: "Open House Companion — Real Estate Done Right",
    description:
      "Expert real estate guidance for buyers, sellers, and investors. Know your programs, understand the process, and work with an agent who has your back.",
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
