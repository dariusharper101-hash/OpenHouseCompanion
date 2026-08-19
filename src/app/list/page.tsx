import type { Metadata } from "next";
import Nav from "@/components/nav";
import ListView from "@/components/list-view";
import { AGENT } from "@/config/agent";
import { DEFAULT_PAYLOAD, HOMES } from "@/data/houseList";

export const metadata: Metadata = {
  title: `${DEFAULT_PAYLOAD.name} — ${AGENT.appName}`,
  description: `A curated set of ${HOMES.length} homes across Dallas, organized by area and days on market.`,
};

export default function ListPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <Nav />
      <ListView defaultPayload={DEFAULT_PAYLOAD} />
    </div>
  );
}
