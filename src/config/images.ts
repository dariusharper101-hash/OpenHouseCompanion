// Existing project-selected Unsplash photography. House/rental assets are
// self-hosted; source IDs are retained in public/homes/SOURCES.json.
// Photos are illustrative, not verified DFW locations or available listings.
// The remaining keys image is remote and uses Photo's explicit error fallback.

const U = "https://images.unsplash.com";
const P = "?auto=format&fit=crop&q=70";

export const IMAGES = {
  // Downtown Dallas skyline — hero. Self-hosted so it's guaranteed to be Dallas
  // Location is not established by any stock image; confirm before using this asset.
  heroSkyline: `/dallas-skyline.jpg`,
  // Modern luxury home exterior at dusk.
  luxuryHome: "/homes/exterior.jpg",
  // Bright, warm living-room interior.
  interior: "/homes/interior.jpg",
  // Illustrative apartment buildings — leasing.
  highrise: "/homes/rentals.jpg",
  // Suburban street / neighborhood homes.
  neighborhood: "/homes/neighborhood.jpg",
  // Handing over the keys / closing moment.
  keys: `${U}/photo-1560518883-ce09059eeffa${P}&w=1400`,
} as const;
