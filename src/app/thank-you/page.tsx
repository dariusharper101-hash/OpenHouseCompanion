import Link from "next/link";
import Nav from "@/components/nav";

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

function getQualifyingPrograms(params: {
  credit: string;
  veteran: string;
  owned: string;
  purpose: string;
  role: string;
}): { name: string; badge: string; desc: string }[] {
  const programs: { name: string; badge: string; desc: string }[] = [];
  const credit = params.credit || "";
  const isVet = params.veteran === "true";
  const notOwned3Yrs = params.owned !== "true";
  const isPrimary = params.purpose === "primary" || params.purpose === "";
  const isBuying = params.role === "buying" || params.role === "both";

  if (!isBuying) return [];

  if (isVet && isPrimary) {
    programs.push({
      name: "VA Home Loan",
      badge: "0% Down",
      desc: "No down payment, no PMI, competitive rates. One of the best loan programs available for eligible veterans and active duty service members.",
    });
  }

  if (isPrimary && notOwned3Yrs && (credit === "620-659" || credit === "660-699" || credit === "700-739" || credit === "740+")) {
    programs.push({
      name: "FHA Loan (3.5% Down)",
      badge: "3.5% Down",
      desc: "Backed by the Federal Housing Administration. Great for first-time buyers with credit scores of 580+. Lower down payment requirements than conventional loans.",
    });
    programs.push({
      name: "My First Texas Home (TDHCA)",
      badge: "Down Payment Assist",
      desc: "Texas state program offering up to 5% in down payment and closing cost assistance for first-time buyers who meet income limits.",
    });
    programs.push({
      name: "TSAHC Home Buyer Programs",
      badge: "Texas Grant",
      desc: "Texas State Affordable Housing Corporation offers grants (not loans) for down payment assistance. Does not need to be repaid.",
    });
  }

  if (isPrimary && notOwned3Yrs && credit === "580-619") {
    programs.push({
      name: "FHA Loan (10% Down)",
      badge: "10% Down",
      desc: "FHA loans are available with a 10% down payment for credit scores between 500–579. Requires mortgage insurance premium (MIP).",
    });
  }

  if (isPrimary && (credit === "660-699" || credit === "700-739" || credit === "740+")) {
    programs.push({
      name: "Conventional 97",
      badge: "3% Down",
      desc: "Fannie Mae / Freddie Mac backed loan with just 3% down for primary residences. PMI can be removed once you hit 20% equity.",
    });
  }

  if (isPrimary && credit === "740+") {
    programs.push({
      name: "Conventional Loan",
      badge: "Best Rates",
      desc: "With a 740+ credit score you'll qualify for the best conventional loan rates on the market. You may be able to skip PMI with 20% down.",
    });
  }

  return programs;
}

export default async function ThankYouPage({ searchParams }: Props) {
  const params = await searchParams;
  const name = params.name || "there";
  const role = params.role || "buying";
  const programs = getQualifyingPrograms({
    credit: params.credit || "",
    veteran: params.veteran || "false",
    owned: params.owned || "false",
    purpose: params.purpose || "primary",
    role,
  });

  const isBuying = role === "buying" || role === "both";

  return (
    <div className="min-h-screen bg-cream">
      <Nav />

      <div className="max-w-2xl mx-auto px-4 pt-32 pb-20">
        {/* Success header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-full bg-green/10 border-2 border-green/40 flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-ink mb-2">
            Got it, {name}!
          </h1>
          <p className="text-muted max-w-sm mx-auto">
            I&apos;ll review your information and reach out within 24 hours to talk through your situation and next steps.
          </p>
        </div>

        {/* Program qualifications */}
        {isBuying && programs.length > 0 && (
          <div className="mb-8">
            <div className="bg-paper border border-line rounded-2xl p-6">
              <h2 className="text-ink font-bold text-lg mb-1">
                Programs You May Qualify For
              </h2>
              <p className="text-muted text-sm mb-5">
                Based on your answers, here are programs worth discussing. Final qualification
                requires a full application — these are strong starting points.
              </p>
              <div className="space-y-4">
                {programs.map(({ name: prog, badge, desc }) => (
                  <div key={prog} className="flex items-start gap-4 bg-cream rounded-xl p-4 border border-line">
                    <div className="flex-shrink-0">
                      <span className="inline-block bg-green/20 border border-green/40 text-green text-xs font-semibold px-2.5 py-1 rounded-full">
                        {badge}
                      </span>
                    </div>
                    <div>
                      <p className="text-ink text-sm font-semibold mb-1">{prog}</p>
                      <p className="text-muted text-xs leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-faint text-xs mt-4">
                We&apos;ll go through all of these together. I&apos;ll also check for any county-specific or
                employer-based programs that may apply to you.
              </p>
            </div>
          </div>
        )}

        {/* What happens next */}
        <div className="bg-paper border border-line rounded-2xl p-6 mb-8">
          <h2 className="text-ink font-bold text-lg mb-4">What Happens Next</h2>
          <div className="space-y-4">
            {[
              {
                n: "1",
                title: "I'll reach out within 24 hours",
                desc: "We'll schedule a quick call to go over your situation, goals, and any questions you have.",
              },
              {
                n: "2",
                title: "Review your options together",
                desc: isBuying
                  ? "We'll walk through the programs you qualify for, get you pointed toward the right lender, and build a plan."
                  : "We'll discuss pricing strategy, market conditions, and what the selling process will look like for your property.",
              },
              {
                n: "3",
                title: "Sign the required agreements",
                desc: "Before I can fully represent you, we'll complete the IABS disclosure and Buyer Representation Agreement (if buying). No surprises.",
              },
              {
                n: "4",
                title: "Start working together",
                desc: "Once the paperwork is signed, my fiduciary duty to you begins — I'm in your corner for the entire process.",
              },
            ].map(({ n, title, desc }) => (
              <div key={n} className="flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-green text-cream text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {n}
                </div>
                <div>
                  <p className="text-ink text-sm font-medium">{title}</p>
                  <p className="text-muted text-xs mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education CTA */}
        <div className="bg-green/10 border border-green/30 rounded-2xl p-6 text-center">
          <h2 className="text-ink font-bold text-lg mb-2">
            While you wait — get informed
          </h2>
          <p className="text-muted text-sm mb-5">
            Head to the Education Hub to learn exactly what to expect: taxes, insurance,
            inspections, warranties, contracts, and the full process from start to finish.
          </p>
          <Link
            href="/learn"
            className="inline-block px-8 py-3 rounded-xl bg-green hover:bg-green-600 text-cream text-sm font-semibold transition-all shadow-lg"
          >
            Explore the Education Hub →
          </Link>
        </div>
      </div>
    </div>
  );
}
