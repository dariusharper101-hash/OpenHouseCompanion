"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HousePresentation, { AgentFooter } from "@/components/house-cards";
import CopyShare from "@/components/copy-share";
import {
  decodePayload,
  formatTextList,
  type ListPayload,
} from "@/data/houseList";

/**
 * Client-facing list view. Renders the default list on first paint, then—if the
 * URL carries an encoded list in its hash (#d=…)—swaps to that. The hash never
 * reaches the server, so shared client links stay private to the link holder.
 */
export default function ListView({ defaultPayload }: { defaultPayload: ListPayload }) {
  const [payload, setPayload] = useState<ListPayload>(defaultPayload);

  useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/[#&]d=([^&]+)/);
    if (match) {
      const decoded = decodePayload(decodeURIComponent(match[1]));
      // Sync from the URL hash (browser-only) after mount; matches SSR default first.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (decoded) setPayload(decoded);
    }
  }, []);

  const textList = formatTextList(payload.homes, payload);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-28">
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/20 px-4 py-1.5">
          <span className="text-sm font-medium text-blue-300">Curated Home List</span>
        </div>
        <h1 className="mt-5 text-4xl font-bold text-white">{payload.name}</h1>
        <p className="mt-2 text-slate-400">
          {payload.homes.length} {payload.homes.length === 1 ? "home" : "homes"} across Dallas ·
          organized by area and days on market · Updated {payload.updatedOn}
        </p>

        <div className="mt-6 print:hidden">
          <CopyShare textList={textList} />
        </div>
      </header>

      <HousePresentation homes={payload.homes} />

      <AgentFooter />

      <p className="mt-6 text-center print:hidden">
        <Link href="/list/builder" className="text-xs text-slate-600 hover:text-slate-400">
          Agent tools
        </Link>
      </p>
    </div>
  );
}
