// ─── Stock photography (license-free) ─────────────────────────────────────────
// Curated Unsplash photos (Unsplash License — free for commercial use, no
// attribution required). These are hotlinked from Unsplash's CDN, which the live
// site loads client-side. Every use goes through <Photo>, which falls back to a
// gradient if a given URL doesn't resolve — so swapping one is safe and easy.
//
// To change a photo: browse unsplash.com, open a photo, right-click the image →
// "Copy image address", and paste it here (keep the ?w=&q= params for sizing).

const U = "https://images.unsplash.com";
const P = "?auto=format&fit=crop&q=70";

export const IMAGES = {
  // Downtown Dallas skyline — hero. Self-hosted so it's guaranteed to be Dallas
  // (upload public/dallas-skyline.jpg). Until then, <Photo> shows a green gradient.
  heroSkyline: `/dallas-skyline.jpg`,
  // Modern luxury home exterior at dusk.
  luxuryHome: `${U}/photo-1568605114967-8130f3a36994${P}&w=1400`,
  // Bright, warm living-room interior.
  interior: `${U}/photo-1616486338812-3dadae4b4ace${P}&w=1400`,
  // Uptown / Downtown high-rise apartments — leasing.
  highrise: `${U}/photo-1545324418-cc1a3fa10c00${P}&w=1400`,
  // Suburban street / neighborhood homes.
  neighborhood: `${U}/photo-1570129477492-45c003edd2be${P}&w=1400`,
  // Handing over the keys / closing moment.
  keys: `${U}/photo-1560518883-ce09059eeffa${P}&w=1400`,
} as const;
