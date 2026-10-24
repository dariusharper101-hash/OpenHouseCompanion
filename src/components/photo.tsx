"use client";

import { useState } from "react";

// A photograph that degrades gracefully. If the (external, license-free) image
// fails to load, an explicit neutral fallback avoids a broken icon.
export default function Photo({
  src,
  alt,
  className = "",
  imgClassName = "",
  gradient = "var(--line)",
  eager = false,
  overlay = false,
  children,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  gradient?: string;
  eager?: boolean;
  overlay?: boolean;
  children?: React.ReactNode;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: gradient }}>
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          onError={() => setFailed(true)}
          className={`absolute inset-0 w-full h-full object-cover ${imgClassName}`}
        />
      )}
      {failed && <p className="absolute inset-x-0 top-1/3 z-10 text-center text-ink bg-paper p-4">Photography unavailable</p>}
      {overlay && <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />}
      {children}
    </div>
  );
}
