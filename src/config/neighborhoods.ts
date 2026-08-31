// ─── DFW neighborhood / city guides ───────────────────────────────────────────
// Content source for the /neighborhoods landing pages. Each entry becomes its own
// SEO-optimized page targeting local searches (e.g. "homes for sale in Frisco TX").
//
// Keep the copy TRUE and evergreen — general, durable characteristics of each city,
// not time-sensitive claims. `priceBand` is INDICATIVE and meant to be verified /
// updated (same spirit as config/market.ts); it is clearly labeled as such on the
// page. To add an area, append an entry — the route, sitemap, and index update
// automatically.

export interface Highlight {
  title: string;
  desc: string;
}

export interface Neighborhood {
  slug: string;
  name: string;
  county: string;
  schoolDistrict: string;
  /** One-line positioning shown under the H1. */
  tagline: string;
  /** 2–3 sentence intro paragraph. */
  intro: string;
  /** Indicative typical price band — verify before promoting. */
  priceBand: string;
  /** Tailored, unique bullets (keeps each page from reading as duplicate content). */
  highlights: Highlight[];
  /** Who this area tends to suit — drives the "great for" chips. */
  goodFor: string[];
  /** Slugs of nearby areas, for internal linking. */
  nearby: string[];
}

export const NEIGHBORHOODS: Neighborhood[] = [
  {
    slug: "frisco",
    name: "Frisco",
    county: "Collin County",
    schoolDistrict: "Frisco ISD",
    tagline: "Master-planned, family-first, and one of the fastest-growing cities in America.",
    intro:
      "Frisco pairs newer construction and master-planned communities with some of the most sought-after schools in North Texas. It's home to The Star (the Dallas Cowboys' world headquarters) and the PGA of America, and it draws families who want amenities, space, and a strong resale market.",
    priceBand: "High $500s to $1M+",
    highlights: [
      { title: "Schools that move markets", desc: "Frisco ISD is a primary reason buyers pay a premium here — school boundaries meaningfully affect resale value, so where you buy matters." },
      { title: "Newer homes, planned communities", desc: "Much of Frisco's housing stock is recent, with HOA-run neighborhoods, parks, and amenity centers. Great for buyers who want turnkey over fixer-upper." },
      { title: "Amenities on your doorstep", desc: "The Star, PGA Frisco, and a wave of retail and dining mean you rarely have to leave the city for entertainment." },
      { title: "Strong, liquid resale", desc: "Demand stays high, which supports resale — but it also means well-priced homes move fast and multiple offers are common." },
    ],
    goodFor: ["Families", "Move-up buyers", "New-construction buyers", "Relocating professionals"],
    nearby: ["plano", "mckinney", "prosper", "allen"],
  },
  {
    slug: "plano",
    name: "Plano",
    county: "Collin County",
    schoolDistrict: "Plano ISD",
    tagline: "Established, corporate, and consistently ranked among the best places to live in the U.S.",
    intro:
      "Plano offers the rare combination of established, tree-lined neighborhoods and a booming corporate core — Toyota North America, JPMorgan, and Frito-Lay all call it home. You get a wider range of price points than newer suburbs, from starter homes to luxury near Legacy West.",
    priceBand: "Mid $400s to $800s",
    highlights: [
      { title: "Mature neighborhoods + new luxury", desc: "Unlike newer suburbs, Plano spans 1980s–90s established areas and modern high-end product around Legacy West, so there's more variety in price and character." },
      { title: "A true job center", desc: "With major employers in-city, many buyers cut their commute dramatically — a real quality-of-life and resale advantage." },
      { title: "Walkable, urban-lite districts", desc: "Legacy West and downtown Plano bring dining, offices, and apartments together for buyers who want energy without moving into Dallas." },
      { title: "Broad buyer pool", desc: "The mix of price points means your future resale audience is large — a quiet but important factor when you buy." },
    ],
    goodFor: ["First-time buyers", "Move-up buyers", "Professionals", "Investors"],
    nearby: ["frisco", "allen", "richardson", "mckinney"],
  },
  {
    slug: "mckinney",
    name: "McKinney",
    county: "Collin County",
    schoolDistrict: "McKinney ISD",
    tagline: "Historic-charm downtown meets fast growth — often more home for the money than its neighbors.",
    intro:
      "McKinney is known for its walkable historic square and a character you don't find in cookie-cutter suburbs, while still delivering the growth and schools that draw families to Collin County. Buyers priced out of Frisco often find more square footage and charm here.",
    priceBand: "High $300s to $700s",
    highlights: [
      { title: "A real downtown", desc: "The historic square — shops, restaurants, and events — gives McKinney a sense of place that newer suburbs are still trying to build." },
      { title: "More value per square foot", desc: "You'll often stretch your budget further here than in Frisco or Plano, especially east of US-75." },
      { title: "Range of vintages", desc: "From historic homes near downtown to brand-new builds on the outskirts, McKinney suits both character-seekers and new-construction buyers." },
      { title: "Fast-growing, steady demand", desc: "Consistent in-migration supports resale, and infrastructure keeps expanding to keep up." },
    ],
    goodFor: ["First-time buyers", "Families", "Value-focused buyers", "Character-home lovers"],
    nearby: ["frisco", "allen", "prosper", "plano"],
  },
  {
    slug: "allen",
    name: "Allen",
    county: "Collin County",
    schoolDistrict: "Allen ISD",
    tagline: "Compact, family-oriented, and anchored by one of the most cohesive school communities in DFW.",
    intro:
      "Allen packs strong schools, parks, and amenities into a tight, easy-to-navigate footprint. With a single high school district, community spirit runs deep, and Watters Creek and the Allen Event Center give residents plenty to do close to home.",
    priceBand: "Mid $400s to $700s",
    highlights: [
      { title: "One-high-school unity", desc: "Allen ISD's single-high-school structure creates unusually strong community identity — a genuine draw for families." },
      { title: "Amenity-rich and walkable pockets", desc: "Watters Creek blends shopping, dining, and living, while the city's trail and park system is a standout." },
      { title: "Central Collin location", desc: "Allen sits conveniently between Plano and McKinney with quick US-75 access toward Dallas job centers." },
      { title: "Well-kept, family housing stock", desc: "Predominantly established suburban homes that hold value, with pride-of-ownership neighborhoods throughout." },
    ],
    goodFor: ["Families", "Move-up buyers", "Relocating professionals"],
    nearby: ["plano", "mckinney", "frisco", "richardson"],
  },
  {
    slug: "prosper",
    name: "Prosper",
    county: "Collin County",
    schoolDistrict: "Prosper ISD",
    tagline: "Upscale, spacious, and semi-rural — DFW's luxury growth frontier.",
    intro:
      "Prosper has become the destination for buyers who want larger lots, luxury new construction, and a bit of breathing room while keeping access to Frisco's amenities. Prosper ISD is newer and highly regarded, and the town has intentionally protected a more open, estate-style feel.",
    priceBand: "High $600s to $1.5M+",
    highlights: [
      { title: "Larger lots and estate homes", desc: "Zoning and planning here favor space — a real differentiator for move-up and luxury buyers who feel boxed in elsewhere." },
      { title: "Newer, fast-rising schools", desc: "Prosper ISD is modern and expanding, a magnet for families investing at a higher price point." },
      { title: "Luxury new construction", desc: "A concentration of custom and semi-custom builders makes Prosper ideal for buyers who want to build or buy nearly new." },
      { title: "Room to grow (in value too)", desc: "As one of the northern growth edges, early-mover buyers have historically benefited from continued expansion." },
    ],
    goodFor: ["Luxury buyers", "Move-up buyers", "New-construction buyers", "Families wanting space"],
    nearby: ["frisco", "mckinney", "celina", "plano"],
  },
  {
    slug: "arlington",
    name: "Arlington",
    county: "Tarrant County",
    schoolDistrict: "Arlington ISD / Mansfield ISD",
    tagline: "The heart of the Metroplex — entertainment, value, and a location between two downtowns.",
    intro:
      "Arlington sits right between Dallas and Fort Worth, home to AT&T Stadium, Globe Life Field, and Six Flags. It offers noticeably more affordable pricing than the northern suburbs, plus UT Arlington, making it popular with first-time buyers, investors, and anyone who wants a central location.",
    priceBand: "High $200s to $450s",
    highlights: [
      { title: "Genuine affordability", desc: "Arlington is one of the best value plays in the core Metroplex — first-time buyers can get in at price points that are tough to find up north." },
      { title: "Dead-center location", desc: "Roughly equidistant to both downtowns and DFW Airport — ideal for households commuting in different directions." },
      { title: "Entertainment capital", desc: "Pro sports and major attractions in your backyard also support a healthy rental and short-term market for investors." },
      { title: "University demand", desc: "UT Arlington underpins steady rental demand — a factor worth weighing for buy-and-hold investors." },
    ],
    goodFor: ["First-time buyers", "Investors", "Value-focused buyers", "Commuters"],
    nearby: ["fort-worth", "mansfield", "grand-prairie"],
  },
  {
    slug: "fort-worth",
    name: "Fort Worth",
    county: "Tarrant County",
    schoolDistrict: "Fort Worth ISD (and others)",
    tagline: "Big-city amenities with a distinct character — and more house for your dollar than Dallas.",
    intro:
      "Fort Worth blends genuine Texas character — the Stockyards, a world-class Cultural District — with fast growth and pricing that's typically friendlier than Dallas. Neighborhoods range widely, from historic districts to brand-new master-planned communities on the fast-growing north and west sides.",
    priceBand: "High $200s to $500s",
    highlights: [
      { title: "More home per dollar", desc: "Compared with Dallas and the north-Dallas suburbs, Fort Worth generally stretches a budget further for similar space." },
      { title: "Distinct neighborhoods", desc: "From the walkable, historic charm of the near-south side to new construction up north, there's a very different Fort Worth for different buyers." },
      { title: "Culture and character", desc: "The Cultural District, Stockyards, and a real downtown give it an identity that draws people who want personality, not just a subdivision." },
      { title: "Growth on the edges", desc: "North and far-west Fort Worth are among the region's most active new-build corridors — good for turnkey and future value." },
    ],
    goodFor: ["First-time buyers", "Move-up buyers", "Value-focused buyers", "Investors"],
    nearby: ["arlington", "mansfield"],
  },
  {
    slug: "denton",
    name: "Denton",
    county: "Denton County",
    schoolDistrict: "Denton ISD",
    tagline: "A creative college town with a historic square, real character, and relative affordability.",
    intro:
      "Anchored by two universities (UNT and TWU) and a beloved courthouse square, Denton has a music-and-arts personality unlike anywhere else in DFW. It remains more affordable than the southern Collin/Denton suburbs and appeals to buyers who want character and community over cookie-cutter.",
    priceBand: "High $200s to $450s",
    highlights: [
      { title: "College-town energy", desc: "UNT and TWU give Denton a young, creative feel — plus steady rental demand that investors pay attention to." },
      { title: "The square", desc: "A genuinely walkable historic downtown with local music, food, and events is the city's beating heart." },
      { title: "Relative value + upside", desc: "Prices have historically trailed the closer-in suburbs, and continued northern growth keeps demand healthy." },
      { title: "Gateway location", desc: "Sitting at the north end of I-35's split, Denton offers access to both the Dallas and Fort Worth sides of the Metroplex." },
    ],
    goodFor: ["First-time buyers", "Investors", "Value-focused buyers", "Character-home lovers"],
    nearby: ["flower-mound", "frisco"],
  },
  {
    slug: "flower-mound",
    name: "Flower Mound",
    county: "Denton County",
    schoolDistrict: "Lewisville ISD",
    tagline: "Affluent, green, and lake-adjacent — a polished suburb with strong schools.",
    intro:
      "Flower Mound is known for its careful planning, extensive trail system, and proximity to Lake Grapevine, all wrapped in a higher-end, family-oriented feel. Well-regarded Lewisville ISD schools and easy airport access make it a perennial favorite for relocating professionals.",
    priceBand: "High $500s to $1M+",
    highlights: [
      { title: "Planned and green", desc: "A strong emphasis on open space, trails, and the namesake mound gives Flower Mound a more manicured feel than many suburbs." },
      { title: "Lake and recreation", desc: "Proximity to Lake Grapevine adds boating, parks, and weekend recreation right at the city's edge." },
      { title: "Airport-close", desc: "Quick access to DFW Airport is a genuine perk for frequent travelers and relocating executives." },
      { title: "Steady, higher-end demand", desc: "A limited supply of newer luxury inventory tends to support values in the upper price bands." },
    ],
    goodFor: ["Families", "Luxury buyers", "Relocating professionals", "Move-up buyers"],
    nearby: ["denton", "frisco"],
  },
  {
    slug: "mansfield",
    name: "Mansfield",
    county: "Tarrant County",
    schoolDistrict: "Mansfield ISD",
    tagline: "A well-kept family suburb between Fort Worth and Arlington — strong schools, real value.",
    intro:
      "Mansfield offers highly regarded schools and a friendly, family-oriented feel while keeping pricing more accessible than the northern suburbs. Its location between Fort Worth and Arlington gives residents solid access to jobs and entertainment across the southern Metroplex.",
    priceBand: "High $300s to $550s",
    highlights: [
      { title: "Respected schools at a lower entry", desc: "Mansfield ISD earns strong marks, and you can often access it for less than comparable northern districts." },
      { title: "Southern-Metroplex convenience", desc: "Nestled between Fort Worth and Arlington, with reasonable reach to both downtowns and the entertainment district." },
      { title: "Family-friendly and growing", desc: "Parks, a historic downtown, and steady new construction make it comfortable for families putting down roots." },
      { title: "Value with headroom", desc: "More accessible pricing plus ongoing growth make it appealing for first-time and move-up buyers alike." },
    ],
    goodFor: ["Families", "First-time buyers", "Value-focused buyers", "Move-up buyers"],
    nearby: ["arlington", "fort-worth"],
  },
];

// ─── Lookups ──────────────────────────────────────────────────────────────────

export const neighborhoodSlugs = NEIGHBORHOODS.map((n) => n.slug);

export function getNeighborhood(slug: string): Neighborhood | undefined {
  return NEIGHBORHOODS.find((n) => n.slug === slug);
}
