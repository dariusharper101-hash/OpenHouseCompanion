export type BuyerTimeline =
  | "asap"
  | "1-3-months"
  | "3-6-months"
  | "6-12-months"
  | "just-browsing";

export type PropertyType = "house" | "condo" | "townhouse" | "multi-family" | "land" | "any";

export interface LeadFormData {
  // Contact
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // Buyer intent
  timeline: BuyerTimeline;
  isPreApproved: boolean;
  // Budget
  budgetMin: string;
  budgetMax: string;
  // Property preferences
  propertyType: PropertyType;
  bedrooms: string;
  bathrooms: string;
  neighborhoods: string;
  // Optional notes
  notes: string;
  // Meta
  source: string; // which social platform referred them
}

export interface Lead extends LeadFormData {
  id: string;
  createdAt: string;
}
