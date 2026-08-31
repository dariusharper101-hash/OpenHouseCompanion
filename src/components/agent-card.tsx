"use client";

import { useState } from "react";
import { AGENT, agentInitials } from "@/config/agent";

// Instagram + Facebook links, shown wherever we surface the agent.
export function SocialLinks({ className = "" }: { className?: string }) {
  const { instagram, facebook } = AGENT.socials;
  if (!instagram && !facebook) return null;
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {instagram && (
        <a
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="text-muted hover:text-green transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.2 1 .48 1.4.9.42.4.7.8.9 1.4.17.4.37 1 .42 2.2.06 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.05 1.2-.25 1.8-.42 2.2-.2.6-.48 1-.9 1.4-.4.42-.8.7-1.4.9-.4.17-1 .37-2.2.42-1.3.06-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.05-1.8-.25-2.2-.42-.6-.2-1-.48-1.4-.9-.42-.4-.7-.8-.9-1.4-.17-.4-.37-1-.42-2.2C2.21 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.05-1.2.25-1.8.42-2.2.2-.6.48-1 .9-1.4.4-.42.8-.7 1.4-.9.4-.17 1-.37 2.2-.42C8.4 2.21 8.8 2.2 12 2.2zm0 1.8c-3.15 0-3.5 0-4.75.07-.9.04-1.4.2-1.7.32-.43.17-.73.37-1.05.7-.32.31-.52.6-.7 1.04-.12.3-.28.8-.32 1.7C3.2 8.5 3.2 8.85 3.2 12s0 3.5.07 4.75c.04.9.2 1.4.32 1.7.17.43.37.73.7 1.05.31.32.6.52 1.04.7.3.12.8.28 1.7.32 1.25.06 1.6.07 4.75.07s3.5 0 4.75-.07c.9-.04 1.4-.2 1.7-.32.43-.17.73-.37 1.05-.7.32-.31.52-.6.7-1.04.12-.3.28-.8.32-1.7.06-1.25.07-1.6.07-4.75s0-3.5-.07-4.75c-.04-.9-.2-1.4-.32-1.7a2.8 2.8 0 0 0-.7-1.05 2.8 2.8 0 0 0-1.04-.7c-.3-.12-.8-.28-1.7-.32C15.5 4 15.15 4 12 4zm0 3.06A4.94 4.94 0 1 0 12 17a4.94 4.94 0 0 0 0-9.88zm0 8.14A3.2 3.2 0 1 1 12 8.8a3.2 3.2 0 0 1 0 6.4zm6.3-8.34a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0z" />
          </svg>
        </a>
      )}
      {facebook && (
        <a
          href={facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="text-muted hover:text-green transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
          </svg>
        </a>
      )}
    </div>
  );
}

// Avatar: uses the headshot if photoUrl is set, otherwise a clean initials disc.
export function AgentAvatar({ size = 96 }: { size?: number }) {
  const [failed, setFailed] = useState(false);
  if (AGENT.photoUrl && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={AGENT.photoUrl}
        alt={AGENT.name || AGENT.appName}
        width={size}
        height={size}
        onError={() => setFailed(true)}
        className="rounded-full object-cover border-2 border-gold/50"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="rounded-full bg-gradient-to-br from-green-600 to-green border border-gold/40 flex items-center justify-center text-cream font-display font-semibold"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {agentInitials}
    </div>
  );
}

// "About Your Agent" section for the homepage.
export default function AgentCard() {
  if (!AGENT.name) return null;

  return (
    <section className="py-20 md:py-28 px-5">
      <div className="max-w-4xl mx-auto">
        <div className="bg-paper border border-line rounded-3xl p-8 md:p-12 flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left shadow-[0_1px_30px_rgba(28,59,48,0.06)]">
          <div className="flex-shrink-0">
            <AgentAvatar size={128} />
          </div>
          <div>
            <p className="text-gold text-xs uppercase tracking-[0.2em] font-medium mb-2">Your agent</p>
            <h2 className="font-display text-3xl font-semibold text-ink tracking-tight">
              {AGENT.name}
              {AGENT.title && <span className="text-muted text-xl font-normal">, {AGENT.title}</span>}
            </h2>
            {AGENT.brokerage && <p className="text-muted text-sm mt-1">{AGENT.brokerage}</p>}
            <p className="text-muted leading-relaxed mt-4">
              Based in {AGENT.serviceArea}, I help buyers, sellers, renters, and investors make confident,
              fully-informed decisions. My job is to make sure you understand every program, cost, and form
              before you sign anything — and if I don&apos;t know the answer, I&apos;ll find out.
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-x-5 gap-y-1 mt-5 text-sm">
              {AGENT.phone && (
                <a href={`tel:${AGENT.phone.replace(/[^\d+]/g, "")}`} className="text-green font-medium hover:text-green-600 transition-colors">
                  {AGENT.phone}
                </a>
              )}
              {AGENT.email && (
                <a href={`mailto:${AGENT.email}`} className="text-green font-medium hover:text-green-600 transition-colors">
                  {AGENT.email}
                </a>
              )}
            </div>
            <SocialLinks className="justify-center sm:justify-start mt-4" />
            {AGENT.licenseNumber && (
              <p className="text-faint text-xs mt-4">TREC License #{AGENT.licenseNumber}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
