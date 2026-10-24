"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AGENT } from "@/config/agent";
import { BrandWordmark } from "@/components/brand";
const LINKS = [{href:"/buy",label:"Your next move"},{href:"/neighborhoods",label:"Explore DFW"},{href:"/learn",label:"Get answers"}];
export default function Nav() {
 const path = usePathname(); const [open, setOpen] = useState(false);
 return <nav className="hop-nav" aria-label="Main navigation"><div className="hop-wrap hop-nav-inner"><Link href="/" className="hop-nav-brand" aria-label={`${AGENT.appName} · ${AGENT.name} · ${AGENT.brokerage}`}><BrandWordmark className="w-36 sm:w-44" plate={false}/><span>{AGENT.name} · {AGENT.brokerage}</span></Link><div className="hop-nav-desktop">{LINKS.map(l => <Link key={l.href} href={l.href} aria-current={path === l.href ? "page" : undefined}>{l.label}</Link>)}</div><div className="hop-nav-actions"><button type="button" aria-expanded={open} aria-controls="hop-menu" onClick={() => setOpen(!open)} className="hop-menu-trigger">{open ? "Close" : "Menu"} <span aria-hidden="true">{open ? "−" : "+"}</span></button><Link href="/start" className="hop-nav-contact">Ask Hop <span aria-hidden="true">↗</span></Link></div></div>{open && <div id="hop-menu" className="hop-mobile-menu"><div className="hop-wrap">{[{href:"/buy",label:"Build a buying plan"},{href:"/leasing",label:"Find a rental"},{href:"/relocate",label:"Move to DFW"},{href:"/learn/selling",label:"Sell a property"},{href:"/invest",label:"Explore investing"},{href:"/neighborhoods",label:"Explore DFW"},{href:"/tools",label:"Estimate a payment"},{href:"/open-houses",label:"Plan a visit"},{href:"/learn",label:"Get answers"}].map(l => <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}<span aria-hidden="true">↗</span></Link>)}</div></div>}</nav>;
}
