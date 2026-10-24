"use client";
/* eslint-disable @next/next/no-img-element -- local portrait has an explicit image-failure identity state. */
import { useState } from "react";
import { AGENT } from "@/config/agent";
export default function Portrait({ className = "" }: { className?: string }) {
 const [failed, setFailed] = useState(false);
 return <figure className={`hop-portrait ${className}`}><div className="hop-portrait-image">{!failed ? <img src={AGENT.photoUrl} alt="Darius Harper, known as Hop" width={640} height={640} onError={() => setFailed(true)} /> : <div className="hop-portrait-fallback"><span className="hop-display">Meet Hop.</span><p>Darius Harper · {AGENT.brokerage}</p></div>}</div><figcaption><strong>Darius Harper</strong><span>Call me Hop. · {AGENT.brokerage}</span></figcaption></figure>;
}
