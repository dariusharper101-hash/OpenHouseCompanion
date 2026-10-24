// Lead capture (the /start form, /api/leads, admin) only runs when durable
// storage has been set up and NEXT_PUBLIC_HOP_LEADS=1, or in local review mode.
// Otherwise the site is public-only: visitors reach Darius by phone, text or email.
export const reviewMode = process.env.NEXT_PUBLIC_HOP_REVIEW_MODE === "1";
export const leadsEnabled = reviewMode || process.env.NEXT_PUBLIC_HOP_LEADS === "1";
