"use client";

import { useSearchParams } from "next/navigation";

// Headline A/B. ?v=b shows B; anything else shows A. Wrapped in <Suspense> by
// the page with HEADLINE_A as the fallback, so the static HTML always has a
// headline and the page stays prerendered.
export const HEADLINE_A = "Moving in December? Start with the specials.";
export const HEADLINE_B = "Your December Apartment Search, Simplified";

const h1 = "font-display text-[2.6rem] leading-[1.05] md:text-7xl font-semibold tracking-tight text-ink max-w-3xl";

export function HeadlineFallback() {
  return <h1 className={h1}>{HEADLINE_A}</h1>;
}

export default function Headline() {
  const v = useSearchParams().get("v");
  return <h1 className={h1}>{v === "b" ? HEADLINE_B : HEADLINE_A}</h1>;
}
