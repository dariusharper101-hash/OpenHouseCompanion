import type { Metadata } from "next";
import Nav from "@/components/nav";
import ListBuilder from "@/components/list-builder";

export const metadata: Metadata = {
  title: "List Builder — Agent Tools",
  // Keep the private tool out of search engines.
  robots: { index: false, follow: false },
};

export default function BuilderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <Nav />
      <ListBuilder />
    </div>
  );
}
