"use client";
import { useState } from "react";
import { ActionLink } from "@/components/ui";
const MOVES = [
 { id: "buy", label: "Buying", title: "A home that fits your life.", copy: "Start with your places, your budget and your must-haves. Leave with a plan before you share your contact details.", cta: "Build my buying plan", href: "/buy" },
 { id: "rent", label: "Renting", title: "A new lease. A real plan.", copy: "Get clear on your search, tour options and the property’s actual application process.", cta: "Explore my rental search", href: "/leasing" },
 { id: "move", label: "Moving to DFW", title: "New city. Your kind of life.", copy: "Start with where you need to be and how you want to live. We’ll work outward from there.", cta: "Get to know DFW", href: "/relocate" },
 { id: "sell", label: "Selling", title: "Make your next move count.", copy: "Understand preparation, pricing questions and what happens next. A useful starting point before a valuation conversation.", cta: "Explore the selling guide", href: "/learn/selling" },
 { id: "invest", label: "Investing", title: "A clear strategy. Grounded decisions.", copy: "Bring your assumptions, compare costs and identify the next checks before choosing a property.", cta: "Build my investment brief", href: "/invest" },
];
export default function MovePicker({ origin }: { origin: "website" | "social" }) {
 const [selected, setSelected] = useState("buy"); const move = MOVES.find(m => m.id === selected)!;
 return <section className="hop-move-picker" aria-label="Choose your next move"><p className="hop-eyebrow">What’s your next move?</p><div className="hop-move-options" role="group" aria-label="Your move">{MOVES.map(m => <button key={m.id} type="button" aria-pressed={selected === m.id} onClick={() => setSelected(m.id)}>{m.label}</button>)}</div><div className="hop-move-outcome" key={move.id} aria-live="polite"><h2>{move.title}</h2><p>{move.copy}</p><ActionLink href={`${move.href}?src=${origin}`}>{move.cta}</ActionLink></div><p className="hop-note">Useful answers first. No signup to explore.</p></section>;
}
