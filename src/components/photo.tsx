"use client";

import { useState } from "react";

// A photograph that degrades gracefully. If the (external, license-free) image
// fails to load, we hide the <img> and the tasteful gradient underneath shows
// through — so an image slot never renders as a broken icon.
export default function Photo({
  src,
  alt,
  className = "",
  imgClassName = "",
  gradient = "linear-gradient(135deg, #26503f 0%, #1c3b30 55%, #14342b 100%)",
  overlay = false,
  children,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  gradient?: string;
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
          loading="lazy"
          onError={() => setFailed(true)}
          className={`absolute inset-0 w-full h-full object-cover ${imgClassName}`}
        />
      )}
      {overlay && <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />}
      {children}
    </div>
  );
}
