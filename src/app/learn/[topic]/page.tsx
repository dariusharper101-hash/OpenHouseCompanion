import JourneyPlanner from "@/components/journey-planner";
import GuideQuestionPlan from "@/components/guide-question-plan";
import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import { ActionLink } from "@/components/ui";
import { AGENT } from "@/config/agent";

// ─── Content ──────────────────────────────────────────────────────────────────

type Section = {
  heading: string;
  body: string;
  bullets?: string[];
  callout?: string;
};

type TopicContent = {
  icon: string;
  title: string;
  subtitle: string;
  sections: Section[];
  cta: string;
};

const CONTENT: Record<string, TopicContent> = {
  process: {
    icon: "🗺️",
    title: "The Home Buying Process",
    subtitle: "10 steps from pre-approval to keys in hand — no surprises.",
    sections: [
      {
        heading: "Step 1 — Get Pre-Approved (Not Pre-Qualified)",
        body: "Pre-qualification is a quick estimate based on what you say. Pre-approval is a real underwriting review — the lender verifies your income, credit, and assets. Sellers take pre-approved buyers seriously. Pre-qualified buyers often get ignored in competitive markets.",
        bullets: [
          "Choose a lender and complete a full application",
          "Provide W-2s, tax returns, pay stubs, and bank statements",
          "Lender pulls a hard credit inquiry",
          "You receive a pre-approval letter with a specific loan amount",
        ],
        callout: "A pre-approval letter is your ticket to make competitive offers. Without it, most sellers won't even respond.",
      },
      {
        heading: "Step 2 — Sign a Buyer Representation Agreement",
        body: "Hop will explain the applicable written agreement before a showing or representation begins. Review the services, duration and compensation terms before signing separately through the brokerage’s approved process. Browsing this guide does not establish representation.",
        bullets: [
          "Defines the scope and duration of our working relationship",
          "Establishes how agent compensation is handled",
          "Activates fiduciary duties: loyalty, disclosure, confidentiality, obedience, accounting",
        ],
      },
      {
        heading: "Step 3 — Property Search & Showings",
        body: "We search MLS listings, off-market properties, and coming-soon listings based on your criteria. I'll schedule showings and help you evaluate each property — structure, location, market position, and red flags.",
      },
      {
        heading: "Step 4 — Make an Offer",
        body: "When you find the right property, we submit a written offer using the TREC-promulgated contract (Texas Real Estate Commission forms — these are standardized and non-negotiable in their base form). We'll discuss offer price, earnest money, option fee, closing date, and any contingencies.",
        bullets: [
          "Purchase price and financing terms",
          "Earnest money deposit (typically 1% — held in escrow by title company)",
          "Option fee (gives you the unrestricted right to terminate during the option period)",
          "Closing date and possession",
          "Any repairs or concessions you're requesting",
        ],
      },
      {
        heading: "Step 5 — Option Period & Inspections",
        body: "Texas buyers have a unique tool: the Option Period. You pay a small fee (negotiated, typically $100–$500) to reserve the right to terminate the contract for any reason within the option period (typically 7–10 days). During this window, you'll complete all inspections.",
        callout: "The option period is your safety net. Don't waive it — it costs very little and protects you from an enormous mistake.",
      },
      {
        heading: "Step 6 — Negotiate Repairs or Credits",
        body: "After inspections, you can request the seller make repairs, provide a price reduction, or issue a closing cost credit. We negotiate based on inspection findings, market conditions, and what's reasonable. Not every item needs to be fixed — we'll prioritize what matters.",
      },
      {
        heading: "Step 7 — Appraisal",
        body: "Your lender orders an independent appraisal to confirm the property is worth what you're paying. If it comes in low, you have options: renegotiate the price, pay the difference in cash, or (if you have an appraisal contingency) walk away.",
        bullets: [
          "Ordered by the lender after the option period",
          "Appraiser is independent — neither you nor I choose them",
          "If it appraises at or above contract price, you're clear",
          "If it comes in under, you have a gap to bridge",
        ],
      },
      {
        heading: "Step 8 — Underwriting",
        body: "Your file goes to the lender's underwriter for final review. This is the most document-intensive phase. Do not change jobs, open new credit accounts, or make large purchases during this time. Underwriting typically takes 2–3 weeks.",
        callout: "The cardinal rule: do not touch your finances during underwriting. No new credit, no large deposits, no job changes.",
      },
      {
        heading: "Step 9 — Clear to Close",
        body: "When underwriting signs off, you receive a 'Clear to Close' (CTC). The title company prepares your closing disclosure (CD) which details every dollar in the transaction. You must receive it 3 business days before closing. Review it carefully.",
      },
      {
        heading: "Step 10 — Closing Day",
        body: "Bring your government-issued ID. Bring a certified check or wire the closing funds (your lender will give you exact amounts). You'll sign a large stack of documents. The deed is recorded — often same day in Texas. Then you get the keys.",
        bullets: [
          "Closing typically takes 1–2 hours",
          "Funds must wire before the cutoff time for same-day recording",
          "Title company disburses funds to seller after recording",
          "You receive keys upon funding",
        ],
      },
    ],
    cta: "Ready to start the process?",
  },

  programs: {
    "icon": "💰",
    "title": "Loan Programs You Should Know",
    "subtitle": "Compare the questions, costs and requirements before choosing a lender or program.",
    "sections": [
        {
            "heading": "VA Home Loan",
            "body": "VA-backed purchase loans may offer no down payment and no monthly mortgage insurance for eligible borrowers. A Certificate of Eligibility, lender review, occupancy requirements and the property appraisal still matter. Compare actual lender offers rather than assuming this is the best loan for you.",
            "bullets": [
                "No down payment may be available when the sales price does not exceed the appraised value; entitlement and lender requirements apply.",
                "No private mortgage insurance or FHA mortgage insurance premium.",
                "A funding fee may apply; exemptions exist. Your lender confirms the fee, rate and closing costs."
            ],
            "callout": "Ask the lender to compare the complete cost, including any funding fee. The fee varies by loan type, use and down payment; service alone does not establish approval."
        },
        {
            "heading": "FHA Loan",
            "body": "FHA insures loans made by participating lenders. HUD describes down payments as low as 3.5% for eligible borrowers. Your lender checks credit, income, property requirements and the complete cash needed to close.",
            "bullets": [
                "Discuss the down payment and closing costs separately.",
                "Ask for the upfront and annual mortgage insurance costs and how long they apply.",
                "A published program minimum is not a lender approval."
            ],
            "callout": "Ask the lender for current FHA requirements and a written comparison with other options. This guide does not determine eligibility."
        },
        {
            "heading": "Conventional Loan",
            "body": "Conventional options vary by lender and product. Some low-down-payment programs, including HomeReady, offer down payments as low as 3% for eligible borrowers. Requirements differ for a primary residence, second home or investment property.",
            "bullets": [
                "Ask which product, occupancy and income rules apply.",
                "Compare rate, points, closing costs and mortgage insurance.",
                "For many covered mortgages, you can request PMI cancellation at 80% of original value if the conditions are met; automatic termination generally occurs at the scheduled 78% balance when payments are current."
            ],
            "callout": "20% equity does not automatically cancel PMI in every case. Check the mortgage insurance disclosure and ask the servicer about your loan."
        },
        {
            "heading": "USDA Guaranteed Loan",
            "body": "The USDA guaranteed program can provide 100% financing for eligible primary residences in eligible rural areas. An approved lender reviews the application; a city or neighborhood name alone does not establish eligibility.",
            "bullets": [
                "Check the specific address on USDA’s eligibility site.",
                "Household income limits apply; the program describes a limit of 115% of median household income.",
                "Compare lender rates, fees and the full cost to close."
            ],
            "callout": "Use the address checker and an approved lender to verify the property and household requirements. No-down-payment financing is not the same as no closing costs."
        },
        {
            "heading": "My First Texas Home (TDHCA)",
            "body": "TDHCA offers My First Texas Home for first-time homebuyers and qualified veterans, with mortgage and down-payment assistance options. Its published materials describe assistance up to 5%, subject to program limits and lender review.",
            "bullets": [
                "Income and purchase-price limits apply.",
                "Work with a TDHCA Approved Loan Officer and complete required homebuyer education.",
                "Ask which assistance structure is offered, when repayment is due and what conditions apply."
            ],
            "callout": "Do not assume every assistance option is forgiven after three years. Review the actual assistance documents, including sale, refinance and occupancy conditions."
        },
        {
            "heading": "TSAHC Homebuyer Programs",
            "body": "TSAHC’s Home Sweet Texas and Homes for Texas Heroes programs have eligibility requirements. Home Sweet Texas describes assistance up to 5% as a grant or a forgivable second lien; the available option and terms need lender confirmation.",
            "bullets": [
                "Income, occupation where applicable, property and loan requirements need checking.",
                "A grant and a second lien have different obligations.",
                "The published three-year second-lien option has conditions, including sale or refinance during that period."
            ],
            "callout": "Ask for the current program terms and compare the mortgage together with its assistance. No program choice here is an approval or a promise of funding."
        }
    ],
    "cta": "Compare the options with the right provider"
},

  taxes: {
    icon: "📋",
    title: "Texas Property Taxes",
    subtitle: "No state income tax, but property taxes are some of the highest in the nation. Here's what to expect.",
    sections: [
      {
        heading: "How Texas Property Taxes Work",
        body: "Texas property taxes are levied by local taxing authorities — county, city, school district, and special districts. There is no state property tax. Your total rate is the sum of all applicable taxing jurisdictions.",
        bullets: [
          "Taxes are based on assessed value, set annually by the county appraisal district",
          "You can protest your appraisal if you believe it's too high",
          "Taxes are paid in arrears — January 31 deadline for prior year",
          "Penalty and interest apply after January 31 (up to 12% penalty + 1% monthly interest)",
          "Lenders typically escrow property taxes and pay on your behalf",
        ],
      },
      {
        heading: "Typical Rates by County",
        body: "Rates vary significantly by county, city, and school district. These are ballpark effective rates — actual rates depend on your specific taxing jurisdictions.",
        bullets: [
          "Harris County (Houston): ~2.0%–2.3%",
          "Dallas County: ~1.8%–2.2%",
          "Travis County (Austin): ~1.7%–2.1%",
          "Bexar County (San Antonio): ~1.9%–2.4%",
          "Tarrant County (Fort Worth): ~1.9%–2.3%",
          "Collin County (Plano/Frisco): ~1.6%–2.0%",
          "Denton County: ~1.7%–2.1%",
          "Fort Bend County: ~2.0%–2.5%",
        ],
        callout: "On a $350,000 home at 2.2%, you're looking at $7,700/year or ~$642/month in property taxes — a major part of your total housing payment.",
      },
      {
        heading: "Homestead Exemption",
        body: "If the home is your primary residence, you can apply for a Homestead Exemption, which reduces your taxable assessed value and caps how much your value can increase each year.",
        bullets: [
          "The Comptroller currently describes a $140,000 residence homestead exemption for school district taxes; the appraisal district determines qualification.",
          "Additional exemptions available for seniors (65+), disabled persons, and veterans",
          "Caps annual assessed value increase at 10% for your homestead",
          "Must apply with the county appraisal district — not automatic",
          "Ask the appraisal district when you qualify and about current application deadlines; do not assume you must wait until the year after purchase.",
        ],
        callout: "The homestead exemption is one of the most valuable tax benefits in Texas. File it the first year you own your home — don't miss the window.",
      },
      {
        heading: "Protesting Your Appraisal",
        body: "Every year the county appraisal district sends a Notice of Appraised Value. If you believe it's too high, you have the right to protest. Many homeowners who protest successfully get reductions.",
        bullets: [
          "File a protest by May 15 (or 30 days after the notice is mailed, whichever is later)",
          "You can protest informally or request a formal ARB (Appraisal Review Board) hearing",
          "Provide comparable sales data (comps) that support a lower value",
          "Third-party protest services exist and often work on contingency",
        ],
      },
      {
        heading: "How Taxes Affect Your Monthly Payment",
        body: "Most lenders require taxes to be escrowed. Here's how taxes affect PITI (Principal, Interest, Taxes, Insurance):",
        bullets: [
          "$200,000 home at 2.2% tax rate = ~$367/month in taxes",
          "$350,000 home at 2.2% tax rate = ~$642/month in taxes",
          "$500,000 home at 2.2% tax rate = ~$917/month in taxes",
          "$750,000 home at 2.0% tax rate = ~$1,250/month in taxes",
          "Always request the current tax bill when making an offer — not the appraised value",
        ],
        callout: "The tax rate on a new home vs. a resale can be dramatically different. Ask for the current year's tax bill, not just the rate.",
      },
    ],
    cta: "Have questions about taxes in your area?",
  },

  insurance: {
    icon: "🛡️",
    title: "Homeowners Insurance",
    subtitle: "What you're required to have, what's actually covered, and what most people forget to get.",
    sections: [
      {
        heading: "Standard Homeowners Insurance (HO-3)",
        body: "The HO-3 is the most common homeowners policy. It covers the structure of your home on an open-peril basis (covers all risks except those explicitly excluded) and your personal property on a named-peril basis (covers only listed risks).",
        bullets: [
          "Dwelling coverage: rebuilding cost if the home is damaged or destroyed",
          "Other structures: detached garages, fences (usually 10% of dwelling)",
          "Personal property: furniture, electronics, clothing",
          "Loss of use: hotel and living expenses if home is uninhabitable",
          "Liability: covers injuries that occur on your property",
          "Medical payments: covers minor injuries to guests regardless of fault",
        ],
      },
      {
        heading: "What Standard HO-3 Does NOT Cover",
        body: "This is the part most buyers don't read until they have a claim. Standard homeowners insurance excludes several major risks.",
        bullets: [
          "Flooding (requires a separate flood insurance policy)",
          "Earthquakes",
          "Sewer or drain backup (often available as a rider)",
          "Mold (unless from a covered water event)",
          "Pest damage (termites, rodents)",
          "Normal wear and tear",
          "Foundation movement (in some policies)",
        ],
        callout: "Many Texas homeowners learn the hard way that standard policies don't cover flooding. Hurricane Harvey flooded ~200,000 homes — the majority were uninsured for flood.",
      },
      {
        heading: "Flood Insurance",
        body: "Flood insurance is a separate policy, usually through the National Flood Insurance Program (NFIP) or private insurers. If your home is in a FEMA-designated Special Flood Hazard Area (SFHA), your lender will require it. But even outside those zones, flooding happens.",
        bullets: [
          "NFIP maximum coverage: $250,000 for structure, $100,000 for contents",
          "Private flood insurance often provides higher limits",
          "Average NFIP premium: $700–$900/year, though can be much higher in high-risk zones",
          "30-day waiting period before coverage takes effect (plan ahead)",
          "Even in Zone X (low risk), 20–25% of flood claims come from outside high-risk zones",
        ],
      },
      {
        heading: "Windstorm & Hail Coverage",
        body: "In most of Texas, windstorm and hail are included in the standard HO-3 policy. However, in the Gulf Coast counties designated by TDI (Texas Department of Insurance), windstorm coverage must be purchased separately through the Texas Windstorm Insurance Association (TWIA).",
        bullets: [
          "TWIA coverage is required for properties in the 14 Gulf Coast counties",
          "Premiums can be significantly higher in coastal areas",
          "Hail is the #1 cause of homeowners insurance claims in Texas",
          "Some insurers are pulling out of Texas or increasing rates due to hail losses",
        ],
      },
      {
        heading: "HOA Insurance vs. Individual Coverage",
        body: "If you're buying a condo or a home in an HOA with shared structures, understanding what the HOA's master policy covers is critical.",
        bullets: [
          "HOA master policies typically cover common areas and building exteriors",
          "\"Bare walls in\" coverage: you're responsible for everything inside your unit",
          "\"All-in\" coverage: HOA covers fixtures and sometimes improvements",
          "You still need an HO-6 (condo) policy for your personal property and improvements",
          "Always request a copy of the HOA master policy before closing",
        ],
      },
      {
        heading: "How Much Does It Cost?",
        body: "Texas homeowners insurance is among the most expensive in the nation due to hail, wind, and weather risk.",
        bullets: [
          "Average Texas homeowners insurance: $3,500–$5,000+/year (significantly above the national average)",
          "Coastal properties and older homes cost more",
          "New construction often qualifies for lower rates",
          "Raising your deductible from $1,000 to $2,500 can reduce premiums 10–15%",
          "Bundling auto and home with the same insurer typically saves 5–10%",
        ],
        callout: "Get insurance quotes before you close — not after. In some areas of Texas, you may struggle to find coverage or the cost may change your affordability calculation.",
      },
    ],
    cta: "Ready to talk through your insurance options?",
  },

  warranties: {
    icon: "🔧",
    title: "Home Warranties",
    subtitle: "What they cover, what they don't, and whether you need one.",
    sections: [
      {
        heading: "New Construction Builder's Warranty",
        body: "When you buy a new home in Texas, the builder is required to provide warranty coverage under Texas Property Code. This is separate from any optional extended warranty the builder might offer.",
        bullets: [
          "1 year: workmanship and materials (roof, doors, windows, cabinets, paint)",
          "2 years: mechanical systems (HVAC, plumbing, electrical)",
          "10 years: major structural defects (foundation, load-bearing walls, roof framing)",
          "Builder must honor these — document issues in writing",
          "Some builders also offer extended warranty options through third-party providers",
        ],
        callout: "Get a home inspection on new construction before closing. Builders make mistakes — and once you close, the warranty clock starts.",
      },
      {
        heading: "Third-Party Home Warranty Plans",
        body: "These are annual service contracts (not insurance) that cover repair or replacement of home systems and appliances. Common companies include American Home Shield, Choice Home Warranty, and First American Home Warranty.",
        bullets: [
          "Typical annual cost: $400–$800/year",
          "Service call fee (deductible): $75–$125 per claim",
          "Covers: HVAC, plumbing, electrical, appliances (dishwasher, refrigerator, oven, etc.)",
          "Does NOT cover: pre-existing conditions, lack of maintenance, cosmetic issues",
          "Repairs use the warranty company's contracted vendors — not your own",
        ],
      },
      {
        heading: "What Home Warranties Don't Cover",
        body: "This is the fine print that trips people up. Home warranties have more exclusions than most people expect.",
        bullets: [
          "Pre-existing conditions (this is huge — inspect before buying)",
          "Code upgrades (if a repair requires bringing the system up to current code, you often pay the difference)",
          "Secondary damage (if a plumbing leak damages drywall, the warranty covers the pipe, not the wall)",
          "Improper installation or modification by a previous owner",
          "Cosmetic damage",
          "Pest damage, mold, or structural issues",
        ],
      },
      {
        heading: "Seller-Offered Warranty",
        body: "In a buyer's market, sellers sometimes offer a home warranty as an incentive. It's typically a 1-year plan paid for at closing. While not a substitute for inspections, it can provide peace of mind in the first year of ownership.",
        bullets: [
          "Usually ranges from $400–$700 — sellers often agree to include it in negotiations",
          "Effective from the date of closing",
          "You can often transfer or renew at the end of the year",
          "Ask which plan and company the seller is offering — not all are equal",
        ],
        callout: "A home warranty is not a replacement for inspections. It doesn't cover everything, and claims can be denied. Inspect thoroughly first.",
      },
    ],
    cta: "Questions about what coverage makes sense for your home?",
  },

  inspections: {
    icon: "🔍",
    title: "Home Inspections",
    subtitle: "Every inspection type, what to expect, and how to use findings to protect yourself.",
    sections: [
      {
        heading: "The General Home Inspection",
        body: "A licensed Texas inspector (TREC-licensed) will spend 3–4 hours examining the home's visible and accessible systems and components. They'll produce a written report with photos detailing every issue found.",
        bullets: [
          "Typical cost: $350–$600 depending on home size and age",
          "Covers: roof, foundation, HVAC, plumbing, electrical, structure, windows, doors",
          "Inspectors can't see behind walls or under the slab — visual inspection only",
          "Attend the inspection if possible — walk through with the inspector",
          "Request a TREC-format inspection report",
        ],
        callout: "The inspection report is not a reason to panic — it's a negotiation tool. Every home has issues. What matters is which ones are material.",
      },
      {
        heading: "Foundation Inspection",
        body: "Texas has some of the most challenging soil conditions in the country — expansive clay soil that swells when wet and shrinks when dry. Foundation movement is extremely common, especially in the DFW and Houston areas. Get a foundation inspection on any home that isn't brand new.",
        bullets: [
          "Performed by a structural engineer or licensed foundation inspector",
          "Includes a level reading (how much the floor slopes)",
          "Typical cost: $300–$500",
          "Engineer's report will include a repair recommendation if needed",
          "Foundation repairs can range from $3,000 (minor piers) to $20,000+ (major structural work)",
          "Most foundation companies offer free estimates — get 2-3",
        ],
      },
      {
        heading: "Pest / Termite Inspection",
        body: "Texas is termite country. A WDI (Wood Destroying Insect) inspection checks for termites, carpenter ants, wood rot, and other wood-destroying organisms.",
        bullets: [
          "Performed by a licensed pest control company",
          "Typical cost: $75–$150",
          "Required by VA and FHA lenders",
          "Check if there's an active termite bond (transferable treatment contract) on the home",
          "Termite treatment can run $1,000–$3,000+ depending on severity",
        ],
      },
      {
        heading: "Roof Inspection",
        body: "General inspectors assess the roof visually, but can't always get on the roof or identify subtle issues. A dedicated roof inspection is worth the cost, especially on older homes or if the general inspector noted concerns.",
        bullets: [
          "Roofer or specialized inspector goes on the roof",
          "Typical cost: $100–$300",
          "Checks: shingles, flashing, valleys, gutters, soffit, fascia",
          "Hail damage is common in Texas and may be covered by homeowners insurance",
          "Roof replacement can run $10,000–$30,000+ — know what you're getting into",
        ],
      },
      {
        heading: "Sewer Scope",
        body: "A camera is run through the main sewer line from the house to the city connection. This is especially important for older homes. Tree roots, collapsed pipes, and joint separations are common issues that aren't visible any other way.",
        bullets: [
          "Typical cost: $150–$250",
          "Highly recommended for homes 20+ years old",
          "Tree roots are the most common finding",
          "Sewer line replacement can cost $3,000–$15,000+",
          "Inspect before the option period ends — this is a negotiating point",
        ],
      },
      {
        heading: "HVAC Inspection",
        body: "General inspectors assess HVAC function, but an HVAC technician can check refrigerant levels, heat exchanger integrity, and overall system condition more thoroughly.",
        bullets: [
          "Especially important for systems 10+ years old",
          "HVAC replacement typically runs $5,000–$12,000 for a full system",
          "Ask for maintenance records from the seller",
          "In Texas, a properly functioning AC isn't optional — it's essential",
        ],
        callout: "The option period is your window for ALL of this. Don't wait until day 8 of a 7-day option period to start scheduling inspections.",
      },
      {
        heading: "Using Inspection Findings",
        body: "After the inspection, we evaluate findings and decide what to request. Not every item needs to be fixed — we focus on safety issues, major systems, and material defects.",
        bullets: [
          "Request repairs (seller fixes before closing)",
          "Request a cash credit at closing (you handle repairs after closing)",
          "Request a price reduction",
          "Walk away (within the option period, for any reason)",
          "Accept as-is (if findings are minor)",
        ],
      },
    ],
    cta: "Have concerns about a specific property?",
  },

  contracts: {
    icon: "✍️",
    title: "Contracts & Signing",
    subtitle: "The TREC contract, earnest money, option periods, and every cost you'll pay at closing.",
    sections: [
      {
        heading: "TREC-Promulgated Contracts",
        body: "Texas is unique in that the Texas Real Estate Commission (TREC) issues standardized contracts that agents must use. These are not negotiable in their core structure — they protect both buyers and sellers. The most common is the One to Four Family Residential Contract.",
        bullets: [
          "All agents in Texas must use TREC forms",
          "Addenda (additional terms) can be added for specific situations",
          "Common addenda: financing contingency, third-party financing, short sale, new home construction",
          "Any modifications to the base contract must be initialed by both parties",
        ],
      },
      {
        heading: "Earnest Money",
        body: "Earnest money is a good-faith deposit that demonstrates you're serious about the purchase. It's held in escrow by the title company — not the agent or seller.",
        bullets: [
          "Typical amount: 1% of the purchase price (sometimes more in competitive markets)",
          "Due within 3 business days of contract execution",
          "Applied to your down payment and closing costs at closing",
          "If you terminate outside the option period without a valid reason, you may lose earnest money",
          "If the seller breaches, you're entitled to your earnest money back",
        ],
        callout: "Earnest money is NOT automatically lost if the deal falls through. The termination rules depend on why and when the deal ended.",
      },
      {
        heading: "The Option Period & Option Fee",
        body: "This is one of the most valuable features of Texas real estate contracts. For a negotiated fee, you can terminate the contract for any reason during the option period.",
        bullets: [
          "Option fee: typically $100–$500+ (negotiated, non-refundable)",
          "Option period: typically 7–10 days (negotiated)",
          "During this time you can terminate for any reason — no explanation needed",
          "Option fee is credited toward purchase price at closing if the deal goes through",
          "Must be received by the seller within 3 days of contract execution",
        ],
      },
      {
        heading: "Financing Contingency",
        body: "The Third Party Financing Addendum gives you a window to terminate the contract if you cannot obtain financing on the specified terms. This protects you from losing earnest money if your loan is denied.",
        bullets: [
          "Specifies loan type, amount, interest rate cap, and deadline",
          "If you can't get the loan, you can terminate and recover earnest money",
          "Waiving this contingency (for cash offers or to compete) carries real risk",
          "Termination must be delivered before the financing deadline",
        ],
      },
      {
        heading: "Closing Costs — Buyer",
        body: "Closing costs are fees paid to various parties to complete the transaction. Budget 2%–4% of the purchase price for closing costs (on top of your down payment).",
        bullets: [
          "Origination fee / lender fees: $1,000–$3,000+",
          "Appraisal: $500–$800",
          "Title policy (owner's): 0.5%–1% of purchase price (varies by county)",
          "Title policy (lender's): required by lender",
          "Survey: $400–$600 if new survey required",
          "Recording fees: $100–$300",
          "Prepaid interest: depends on closing date (closer to end of month = less)",
          "Prepaid insurance: first year premium",
          "Property tax escrow: 2–3 months of estimated taxes",
        ],
      },
      {
        heading: "Closing Costs — Seller",
        body: "Sellers have their own set of closing costs, which are typically higher as a percentage.",
        bullets: [
          "Real estate commissions (buyer's agent + listing agent): varies by negotiation",
          "Title policy (seller pays in most Texas counties): 0.5%–1% of sale price",
          "HOA transfer fees and resale certificate: $100–$500",
          "Prorated property taxes",
          "Any negotiated seller credits or concessions",
          "Payoff of existing mortgage(s)",
        ],
      },
      {
        heading: "Seller's Disclosure Notice",
        body: "Sellers in Texas are required to provide a Seller's Disclosure Notice (SDN) — a written account of everything the seller knows about the property's condition. This is one of the most important documents in the transaction.",
        bullets: [
          "Must be provided before closing (ideally early in the process)",
          "Covers: foundation, roof, electrical, plumbing, HVAC, pool, flooding, HOA status",
          "Seller must disclose known defects — failure to do so can expose them to legal liability",
          "Read it carefully — disclosures can reveal red flags",
          "Exception: estate sales often have limited disclosure because the seller has no personal knowledge",
        ],
        callout: "The SDN is not a guarantee — it's a disclosure of what the seller knows. Inspections are still essential.",
      },
      {
        heading: "When & Where You'll Actually Sign",
        body: "This site helps you learn the process and describe your goals. Hop will confirm the brokerage’s approved forms and signing provider before sending a private invitation for the relevant transaction. Review each document and ask questions before signing. Do not upload financial documents or account information to this website.",
        callout: "You will never be asked to upload sensitive documents or sign a binding contract on this website. Signing always happens through the secure, verified email invitation I send you directly.",
      },
    ],
    cta: "Have questions about a specific contract term?",
  },

  selling: {
    icon: "🏷️",
    title: "The Selling Process",
    subtitle: "From pricing to closing — here's what selling a home in Texas actually looks like.",
    sections: [
      {
        heading: "Step 1 — Determine Your Net Proceeds",
        body: "Before you list, you need to know what you'll walk away with. A Comparative Market Analysis (CMA) helps establish listing price. A Net Sheet calculates what you'll actually receive after all costs.",
        bullets: [
          "CMA: I'll analyze recent sales, active listings, and expired listings in your area",
          "Net Sheet: includes mortgage payoff, agent fees, title costs, prorated taxes, any repairs or credits",
          "Don't confuse list price with net — what you clear is what matters",
        ],
      },
      {
        heading: "Step 2 — Prepare the Property",
        body: "First impressions drive offers. Buyers make decisions in the first 30 seconds inside a home. Strategic preparation can add thousands to your sale price.",
        bullets: [
          "Declutter and depersonalize — buyers want to imagine themselves living there",
          "Deep clean, including carpets and windows",
          "Address deferred maintenance — buyers will find it in the inspection",
          "Consider professional staging for higher-priced homes",
          "Professional photography is non-negotiable",
        ],
      },
      {
        heading: "Step 3 — Seller's Disclosure Notice",
        body: "Texas requires sellers to complete the Seller's Disclosure Notice, disclosing all known defects and material facts about the property. Complete this honestly.",
        bullets: [
          "Disclose foundation repairs, roof replacements, flooding history, HOA details",
          "Failure to disclose known issues can expose you to legal liability after closing",
          "When in doubt, disclose — buyers and their agents will find out eventually",
        ],
        callout: "Disclose, disclose, disclose. Hiding a known defect is not worth the lawsuit after closing.",
      },
      {
        heading: "Step 4 — List and Market",
        body: "Your listing goes live on the MLS, which syndicates to Zillow, Realtor.com, and hundreds of other sites. My marketing strategy includes professional photos, targeted social media, in-person showings, and agent-to-agent outreach.",
        bullets: [
          "MLS listing with professional photography",
          "Targeted Facebook and Instagram advertising",
          "Private showings and broker tours",
          "Email campaigns to active buyer pools",
          "Yard sign and lockbox installation",
        ],
      },
      {
        heading: "Step 5 — Receive and Negotiate Offers",
        body: "When offers come in, we evaluate not just price but terms. A higher offer with bad terms can be worse than a lower offer with strong terms.",
        bullets: [
          "Purchase price — but also the financing type (cash, conventional, FHA, VA)",
          "Closing date — does it align with your move-out needs?",
          "Option period length and fee",
          "Requested concessions or repairs",
          "Earnest money amount (signals buyer's seriousness)",
          "Contingencies (financing, inspection, sale of another home)",
        ],
      },
      {
        heading: "Step 6 — Inspection & Negotiation",
        body: "Buyers will inspect the property during the option period. They'll likely request repairs or credits. This is normal — expect it and plan for it.",
        bullets: [
          "Decide in advance what you're willing to repair vs. credit vs. hold firm",
          "Credits at closing (seller pays buyer's costs) are often cleaner than repairs",
          "If a buyer terminates, their earnest money comes back to them — you keep the option fee",
        ],
      },
      {
        heading: "Step 7 — Appraisal and Closing",
        body: "The buyer's lender orders an appraisal. If it comes in below your contract price, you may need to renegotiate. After that, it's underwriting, clear to close, and closing day.",
        bullets: [
          "If appraisal is low, options: reduce price, split the difference, or hold firm (buyer walks)",
          "Final walkthrough is buyer's right — typically 24 hours before closing",
          "Closing: you sign the deed transfer, receive proceeds wire",
          "You're responsible for property taxes through the closing date (prorated)",
        ],
      },
    ],
    cta: "Ready to talk about selling your home?",
  },
};

// ─── External resource links ──────────────────────────────────────────────────
// Official / authoritative sources where clients can research programs, verify
// professionals, and (where applicable) apply. Provided for convenience — these
// are resources, not endorsements. Government/agency links are favored over
// specific commercial lenders to steer clear of RESPA/steering concerns.

type ResourceLink = { label: string; url: string; note?: string };

const RESOURCES: Record<string, ResourceLink[]> = {
  programs: [
    {label:"CFPB — Mortgage insurance cancellation",url:"https://www.consumerfinance.gov/ask-cfpb/when-can-i-remove-private-mortgage-insurance-pmi-from-my-loan-en-202/",note:"Requesting cancellation differs from automatic termination"},
    {label:"VA — Funding fees and closing costs",url:"https://www.va.gov/housing-assistance/home-loans/funding-fee-and-closing-costs/",note:"Current fee tables and exemptions"},
    { label: "CFPB — Compare Loan Options", url: "https://www.consumerfinance.gov/owning-a-home/loan-options/", note: "Neutral overview of FHA, VA, USDA & conventional loans" },
    { label: "VA Home Loans — VA.gov", url: "https://www.va.gov/housing-assistance/home-loans/", note: "Check eligibility & request your Certificate of Eligibility" },
    { label: "USDA Single-Family Housing", url: "https://www.rd.usda.gov/programs-services/single-family-housing-programs", note: "0% down in eligible rural/suburban areas" },
    { label: "USDA Property Eligibility Map", url: "https://eligibility.sc.egov.usda.gov/eligibility/", note: "Check whether a specific address qualifies" },
    { label: "FHA / HUD Homebuyer Resources", url: "https://www.hud.gov/helping-americans/loans", note: "Federal Housing Administration program info" },
    { label: "Fannie Mae — HomeReady & buyer tools", url: "https://yourhome.fanniemae.com/", note: "3% down conventional option" },
    { label: "Freddie Mac — Home Possible & buyer tools", url: "https://myhome.freddiemac.com/", note: "3% down conventional option" },
    { label: "My First Texas Home (TDHCA)", url: "https://welcomehome.tdhca.texas.gov/programs", note: "Texas down-payment & closing-cost assistance" },
    { label: "TSAHC Homebuyer Programs", url: "https://www.tsahc.org/homebuyers-renters/loans-and-down-payment-assistance/", note: "Grants for Texas buyers & 'Texas Heroes'" },
  ],
  taxes: [
    {label:"Texas Comptroller — Property tax exemptions",url:"https://comptroller.texas.gov/taxes/property-tax/exemptions/",note:"Current exemption rules; appraisal districts determine qualification"},
    { label: "Texas Comptroller — Property Tax", url: "https://comptroller.texas.gov/taxes/property-tax/", note: "Statewide rules, deadlines, and taxpayer rights" },
    { label: "Find Your County Appraisal District", url: "https://comptroller.texas.gov/taxes/property-tax/county-directory/", note: "Look up assessed value, tax rates & protest info" },
    { label: "Homestead & Other Exemptions", url: "https://comptroller.texas.gov/taxes/property-tax/exemptions/", note: "File after you move in to lower your taxable value" },
  ],
  insurance: [
    { label: "Texas Department of Insurance (TDI)", url: "https://www.tdi.texas.gov/", note: "Consumer guides, complaints, and company lookup" },
    { label: "TDI HelpInsure — Compare Policies", url: "https://www.helpinsure.com/", note: "Compare home & windstorm coverage across insurers" },
    { label: "FloodSmart / NFIP", url: "https://www.floodsmart.gov/", note: "Flood insurance (a separate policy from HO-3)" },
    { label: "FEMA Flood Map Service Center", url: "https://msc.fema.gov/portal/home", note: "Check a property's flood zone" },
    { label: "Texas Windstorm Insurance Assoc. (TWIA)", url: "https://www.twia.org/", note: "Coastal windstorm/hail coverage" },
  ],
  warranties: [
    { label: "Texas Property Code, Ch. 27 (Residential Construction)", url: "https://statutes.capitol.texas.gov/Docs/PR/htm/PR.27.htm", note: "Your rights on new-construction defects" },
    { label: "BBB — Research Home Warranty Companies", url: "https://www.bbb.org/", note: "Check ratings & complaints before buying a plan" },
  ],
  inspections: [
    { label: "TREC — Verify a Licensed Inspector", url: "https://www.trec.texas.gov/apps/license-holder-search/", note: "Confirm any inspector's license before hiring" },
    { label: "InterNACHI — Find an Inspector", url: "https://www.nachi.org/", note: "Directory of certified inspectors" },
    { label: "ASHI — American Society of Home Inspectors", url: "https://www.homeinspector.org/", note: "Directory & standards of practice" },
  ],
  contracts: [
    { label: "TREC — Contracts & Forms", url: "https://www.trec.texas.gov/forms", note: "Read the actual One-to-Four Family Contract & addenda" },
    { label: "TREC — Information About Brokerage Services (IABS)", url: "https://www.trec.texas.gov/forms/information-about-brokerage-services", note: "The disclosure I'm required to give you" },
    { label: "TREC — Consumer Information", url: "https://www.trec.texas.gov/education/consumers", note: "Your rights and how to file a complaint" },
    { label: `Signing via ${AGENT.signing.platform}`, url: AGENT.signing.infoUrl, note: "How documents get signed — you'll receive a secure email invite per document" },
  ],
  selling: [
    { label: "TREC — Seller's Disclosure & Listing Forms", url: "https://www.trec.texas.gov/forms", note: "The disclosure notice you'll complete as a seller" },
    { label: "TREC — Consumer Information", url: "https://www.trec.texas.gov/education/consumers", note: "Your rights in the transaction" },
    { label: "HAR.com — Texas Market Data", url: "https://www.har.com/", note: "Public listing and neighborhood market data" },
  ],
};

// Step-specific links for the buying process, keyed by section index (steps 1–3).
const PROCESS_STEP_LINKS: Record<number, ResourceLink[]> = {
  0: [
    { label: "CFPB — Owning a Home (mortgage shopping toolkit)", url: "https://www.consumerfinance.gov/owning-a-home/", note: "Checklists, loan-estimate explainers, and what to prep" },
    { label: "CFPB — Explore Interest Rates", url: "https://www.consumerfinance.gov/owning-a-home/explore-rates/", note: "See realistic rate ranges before you apply" },
  ],
  1: [
    { label: "TREC — Information About Brokerage Services (IABS)", url: "https://www.trec.texas.gov/forms/information-about-brokerage-services", note: "Read the disclosure before we begin" },
    { label: "TREC — Consumer Information", url: "https://www.trec.texas.gov/education/consumers", note: "Understand agency and your protections" },
  ],
  2: [
    { label: "Realtor.com", url: "https://www.realtor.com/", note: "MLS-sourced listings" },
    { label: "HAR.com", url: "https://www.har.com/", note: "Texas MLS public search" },
    { label: "Redfin", url: "https://www.redfin.com/", note: "Listings & sold-price history" },
  ],
};

function ExternalLinkList({ links }: { links: ResourceLink[] }) {
  return (
    <div className="hop-resource-cards">
      {links.map((l) => (
        <a
          key={l.url}
          href={l.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hop-resource-card"
        >
          <svg
            className="w-4 h-4 text-green flex-shrink-0 mt-0.5 group-hover:text-green transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
          <span>
            <span className="hop-resource-card-label">
              {l.label}
            </span>
            {l.note && <span className="hop-resource-card-note">{l.note}</span>}
          </span>
        </a>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function TopicPage(props: PageProps<"/learn/[topic]">){
 const {topic}=await props.params;const content=CONTENT[topic];if(!content)notFound();
 return <><Nav/><main id="main-content" tabIndex={-1} className="hop-wrap hop-guide"><nav aria-label="Breadcrumb" className="hop-breadcrumb"><Link href="/learn">Field guide</Link><span aria-hidden="true">/</span><span>{content.title}</span></nav><header className="hop-guide-intro"><p className="hop-eyebrow">Know before you decide</p><h1 className="hop-title">{content.title}</h1><p className="hop-lead">{content.subtitle}</p><p className="hop-note mt-5">Use this as orientation for your questions. Current terms, eligibility and transaction-specific disclosures need confirmation with the relevant provider and brokerage.</p></header><div className="hop-guide-layout"><aside className="hop-guide-contents"><details open><summary>In this guide</summary><ol>{content.sections.map((s,i)=><li key={s.heading}><a href={`#section-${i+1}`}>{s.heading}</a></li>)}</ol></details></aside><div className="hop-guide-body">{content.sections.map((s,i)=><section id={`section-${i+1}`} key={s.heading}><p className="hop-number" aria-hidden="true">{String(i+1).padStart(2,"0")}</p><h2>{s.heading}</h2><p>{s.body}</p>{s.bullets&&<ul>{s.bullets.map(b=><li key={b}>{b}</li>)}</ul>}{s.callout&&<div className="hop-status"><strong>Key point</strong><p>{s.callout}</p></div>}{topic==="process"&&PROCESS_STEP_LINKS[i]&&<div className="hop-guide-resources"><h3>Research this step</h3><ExternalLinkList links={PROCESS_STEP_LINKS[i]}/></div>}</section>)}{RESOURCES[topic]&&<section className="hop-guide-resources"><h2>Continue your research</h2><p className="hop-note">Resources for research and applications, not endorsements. Confirm current terms directly with each provider.</p><ExternalLinkList links={RESOURCES[topic]}/></section>}{topic==="selling"?<JourneyPlanner kind="selling"/>:<GuideQuestionPlan topic={topic} title={content.title}/>}<section className="hop-guide-conversation"><p className="hop-eyebrow">Put the information to work</p><h2>{content.cta}</h2><p>Bring your questions and your situation. Let’s work out the next useful step.</p><ActionLink href={topic==="selling"?"/start?role=selling&src=guide":"/start?src=guide"}>Talk this through with Hop</ActionLink></section><section><h2>Keep exploring</h2><div className="hop-guide-related">{Object.entries(CONTENT).filter(([slug])=>slug!==topic).slice(0,4).map(([slug,c])=><Link key={slug} href={`/learn/${slug}`}>{c.title}<span aria-hidden="true">↗</span></Link>)}</div></section></div></div></main><Footer/></>;
}
