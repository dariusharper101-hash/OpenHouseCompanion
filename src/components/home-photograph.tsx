"use client";
import { useState } from "react";
import Image from "next/image";

/** Stock photography establishes context; it never represents a live listing. */
export default function HomePhotograph({ src = "/homes/neighborhood.jpg", alt = "A house with a front porch and garden", className = "", eager = false }: { src?: string; alt?: string; className?: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  return <figure className={className}>
    <div className="relative aspect-[4/3] overflow-hidden bg-line">
      <Image onError={() => setFailed(true)} src={src} alt={alt} fill sizes="(max-width: 1023px) 100vw, 55vw" preload={eager} className="object-cover" />{failed && <div className="absolute inset-0 flex items-center justify-center bg-surface p-6 text-muted">Home photograph unavailable. Explore the planning tools below.</div>}
    </div>
    <figcaption className="mt-3 text-xs text-muted leading-relaxed">Illustrative home photography · Not an available listing</figcaption>
  </figure>;
}
