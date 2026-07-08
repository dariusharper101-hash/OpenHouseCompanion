import { AGENT, agentInitials } from "@/config/agent";

// Avatar: uses the headshot if photoUrl is set, otherwise a clean initials disc.
export function AgentAvatar({ size = 96 }: { size?: number }) {
  if (AGENT.photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={AGENT.photoUrl}
        alt={AGENT.name || AGENT.appName}
        width={size}
        height={size}
        className="rounded-full object-cover border-2 border-blue-400/40"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="rounded-full bg-gradient-to-br from-blue-500 to-blue-700 border-2 border-blue-400/40 flex items-center justify-center text-white font-bold"
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
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="flex-shrink-0">
            <AgentAvatar size={112} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {AGENT.name}
              {AGENT.title && <span className="text-blue-400 text-lg font-semibold">, {AGENT.title}</span>}
            </h2>
            {AGENT.brokerage && (
              <p className="text-slate-400 text-sm mt-0.5">{AGENT.brokerage}</p>
            )}
            <p className="text-slate-300 text-sm leading-relaxed mt-3">
              Based in {AGENT.serviceArea}, I help buyers, sellers, and investors make confident,
              fully-informed real estate decisions. My job is to make sure you understand every program,
              cost, and form before you sign anything — and if I don&apos;t know the answer, I&apos;ll find out.
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-x-5 gap-y-1 mt-4 text-sm">
              {AGENT.phone && (
                <a href={`tel:${AGENT.phone.replace(/[^\d+]/g, "")}`} className="text-blue-400 hover:text-blue-300 transition-colors">
                  {AGENT.phone}
                </a>
              )}
              {AGENT.email && (
                <a href={`mailto:${AGENT.email}`} className="text-blue-400 hover:text-blue-300 transition-colors">
                  {AGENT.email}
                </a>
              )}
            </div>
            {AGENT.licenseNumber && (
              <p className="text-slate-600 text-xs mt-3">TREC License #{AGENT.licenseNumber}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
