export type ClientRole = "buying" | "selling" | "both" | "renting";

export type ClientType =
  | "first-time-buyer"
  | "move-up-buyer"
  | "investor"
  | "downsizing"
  | "relocating";

export type BuyerTimeline =
  | "asap"
  | "1-3-months"
  | "3-6-months"
  | "6-12-months"
  | "just-browsing";

export type PropertyType =
  | "house"
  | "condo"
  | "townhouse"
  | "multi-family"
  | "land"
  | "any";

export type PurchasePurpose = "primary" | "second-home" | "investment";

export type CreditRange =
  | "below-580"
  | "580-619"
  | "620-659"
  | "660-699"
  | "700-739"
  | "740+";

export type EmploymentType =
  | "w2"
  | "self-employed"
  | "1099"
  | "business-owner"
  | "retired"
  | "other";

export type InvestorStrategy =
  | "flip"
  | "rental"
  | "brrrr"
  | "wholesale"
  | "other";

export type MortgageStatus = "paid-off" | "has-mortgage" | "underwater";

export type LeadStatus = "new" | "contacted" | "active" | "closed" | "lost";

export const LEAD_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "active",
  "closed",
  "lost",
];

// Which front-end product captured the lead. Both products write to the same
// shared database; this tag is how the dashboard segments them.
//   website    → the Hop In Real Estate site (hopinrealestate.com) intake form
//   social     → the Hop In Real Estate social funnel
//   open-house → the Open House Companion visitor sign-in (separate app)
export type LeadProduct = "open-house" | "social" | "website";

export const LEAD_PRODUCTS: LeadProduct[] = ["website", "social", "open-house"];

export const PRODUCT_LABELS: Record<LeadProduct, string> = {
  website: "Hop In Real Estate",
  social: "Social Media",
  "open-house": "Open House",
};

export interface LeadFormData {
  // Identity
  role: ClientRole;
  clientType: ClientType;

  // Contact
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  // Buyer – property preferences
  timeline: BuyerTimeline;
  isPreApproved: boolean;
  budgetMin: string;
  budgetMax: string;
  propertyType: PropertyType;
  bedrooms: string;
  bathrooms: string;
  neighborhoods: string;

  // Buyer – program qualifiers
  purchasePurpose: PurchasePurpose;
  ownedHomeLast3Years: boolean;
  isVeteran: boolean;
  employmentType: EmploymentType;
  creditRange: CreditRange;

  // Investor extra
  investorStrategy: InvestorStrategy;
  propertiesOwned: string;

  // Seller fields
  sellerAddress: string;
  sellerEstimatedValue: string;
  sellerMortgageStatus: MortgageStatus;
  sellerReason: string;
  sellerTimeline: string;
  buyingSimultaneously: boolean;

  // Legal acknowledgments
  iabsAcknowledged: boolean;
  buyerRepAcknowledged: boolean;

  // Notes & meta
  notes: string;
  source: string;
  product: LeadProduct;
}

export interface Lead extends LeadFormData {
  id: string;
  createdAt: string;
  status: LeadStatus;
}
